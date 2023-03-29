module.exports = {
  collectCoverage: false, // doesnt seem to with with esbuild-jest-transform
  collectCoverageFrom: ['src/**/*.ts*'],
  coverageReporters: ['json', 'lcov', 'text-summary', 'html'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.m?(|j|t)sx?$': [
      'esbuild-jest-transform',
      {
        sourcemap: true,
        jsx: 'automatic',
        external: ['react', 'react-dom'],
      },
    ],
  },
  globals: {
    // https://stackoverflow.com/a/74680583/747749
    TextEncoder: require('util').TextEncoder,
    TextDecoder: require('util').TextDecoder,
  },
}
