module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts*'],
  coverageReporters: ['json', 'lcov', 'text-summary', 'html'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testURL: 'http://localhost',
}

