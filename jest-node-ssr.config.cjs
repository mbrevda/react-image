module.exports = {
  testMatch: ['**/src/**/*.ssr-test.js'],
  testURL: 'http://localhost',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
}
