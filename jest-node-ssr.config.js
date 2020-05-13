module.exports = {
  testMatch: ['**/src/**/*.ssr-test.js'],
  testURL: 'http://localhost',
  testEnvironment: 'node',
  preset: 'ts-jest/presets/js-with-babel',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
}
