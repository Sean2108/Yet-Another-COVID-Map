module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  "collectCoverage": true,
  "collectCoverageFrom": ["**/*.{ts,vue}", "!**/node_modules/**", "!**/server.ts", "!**/main.ts", "!**/plugins/**"]
};