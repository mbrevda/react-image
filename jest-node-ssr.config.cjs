module.exports = {
  testMatch: ['**/src/**/*.ssr-test.js'],
  testURL: 'http://localhost',
  testEnvironment: 'node',
  transform: {
    '^.+\\.m?(|j|t)sx?$': [
      'esbuild-jest-transform',
      {
        sourcemap: true,
      },
    ],
  },
}
