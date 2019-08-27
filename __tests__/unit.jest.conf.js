const path = require('path')

module.exports = {
  verbose: false,
  globals: {
    __static: __dirname
  },
  rootDir: path.resolve(__dirname, '../'),
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@tailwind': '<rootDir>/tailwind.js',
    '^@package.json$': '<rootDir>/package.json',
    '^@config': '<rootDir>/config/index.js',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@/(.*)$': '<rootDir>/src/renderer/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    vue$: '<rootDir>/node_modules/vue/dist/vue.common.js'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'jest-vue-preprocessor',
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/e2e',
    '<rootDir>/__tests__/unit.jest.conf.js',
    '<rootDir>/__tests__/unit/.coverage',
    '<rootDir>/__tests__/unit/__fixtures__',
    '<rootDir>/__tests__/unit/__mocks__',
    '<rootDir>/__tests__/unit/__utils__'
  ],
  snapshotSerializers: ['jest-serializer-vue'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageDirectory: '<rootDir>/__tests__/unit/.coverage',
  collectCoverageFrom: [
    'src/renderer/**/*.{js,ts,tsx,vue}'
  ],
  setupFilesAfterEnv: [
    'jest-extended',
    '<rootDir>/__tests__/unit/__utils__/setup.js'
  ],
  watchman: false
}
