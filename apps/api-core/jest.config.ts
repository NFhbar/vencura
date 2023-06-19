/* eslint-disable */
export default {
  displayName: 'api-core',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api-core',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'types',
    'config',
    'db',
    'entities',
    'dto',
    'guards',
    'strategies',
    'decorators',
    'validators',
    'constants',
    'index.ts',
    '.module.ts',
    '<rootDir>/main.ts',
    '.mock.ts',
  ],
}
