module.exports = {
  cache: false,
  collectCoverage: false, // doesnt seem to with with esbuild-jest-transform
  collectCoverageFrom: ['src/**/*.ts*'],
  coverageReporters: ['json', 'lcov', 'text-summary', 'html'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
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
}
