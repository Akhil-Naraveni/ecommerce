
const js = require("@eslint/js");
const globals = require("globals");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
    ],
  },

  js.configs.recommended,

  // Browser application files
  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },

  // Node.js configuration files
  {
    files: [
      "**/webpack.config.js",
      "**/jest.config.js",
      "eslint.config.js",
      "**/test/**/*.js",
    ],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Jest test files
  {
    files: ["**/*.{test,spec}.{js,jsx}"],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
