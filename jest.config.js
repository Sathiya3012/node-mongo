export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(test).js"],
  moduleFileExtensions: ["js", "json", "node"],
  coverageDirectory: "coverage",
  collectCoverage: true,
  collectCoverageFrom: [
    "controller/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
    "!jest.config.js",
  ],
  verbose: true,
};
