/* eslint-disable */
export default {
  displayName: 'tokenizer-tokenizer',

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
  coverageDirectory: '../../../coverage/libs/tokenizer/tokenizer',
  preset: '../../../jest.preset.js',
};
