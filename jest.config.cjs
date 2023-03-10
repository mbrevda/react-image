module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts*'],
  coverageReporters: ['json', 'lcov', 'text-summary', 'html'],
  testURL: 'http://localhost',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.m?(|j|t)sx?$': [
      'esbuild-jest-transform',
      {
        sourcemap: true,
      },
    ],
  },
}
