module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts*'],
  coverageReporters: ['json', 'lcov', 'text-summary', 'html'],
  preset: 'ts-jest/presets/js-with-babel',
  testURL: 'http://localhost',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
}
