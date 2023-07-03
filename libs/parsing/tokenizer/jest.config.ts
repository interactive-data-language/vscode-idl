/* eslint-disable */
export default {
  displayName: 'parsing-tokenizer',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/parsing/tokenizer',
  preset: '../../../jest.preset.js',
};
