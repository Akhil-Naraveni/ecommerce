module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/test/styleMock.js",
  },

  testMatch: [
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};