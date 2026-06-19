const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  mode: "production",
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true,
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
          maxSize: 244000,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          maxSize: 244000,
        },
      },
    },
  },
  devServer: {
    port: 3002,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"],
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        type: "asset",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_BASE_URL": JSON.stringify(
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1"
      ),
    }),
    new ModuleFederationPlugin({
      name: "products_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Products": "./src/components/Products",
      },
      remotes: {},
      shared: {
        react: { singleton: true, requiredVersion: deps.react, strictVersion: false },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"], strictVersion: false },
        axios: { singleton: true, requiredVersion: deps.axios, strictVersion: false },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};