export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(test).js"],
  moduleFileExtensions: ["js", "json", "node"],
  forceExit: true,
  verbose: true,
};
