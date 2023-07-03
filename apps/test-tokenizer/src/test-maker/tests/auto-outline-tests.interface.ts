import { IOutlineTests } from '../tests.interface';

/**
 * Automated tests for generating an outline based on source code
 */
export const AUTO_OUTLINE_TESTS: IOutlineTests[] = [
  {
    suiteName: `Extracts outline`,
    fileName: `ex-1.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        file: `idl/test/hover-help/awesomerasterintersection.pro`,
      },
    ],
  },
  {
    suiteName: `Extracts outline with main`,
    fileName: `ex-2.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        file: `idl/test/hover-help/myfunc.pro`,
      },
    ],
  },
  {
    suiteName: `Extracts outline`,
    fileName: `ex-3.spec.ts`,
    tests: [
      {
        name: `extract correct tokens with multiple parent routines`,
        file: `idl/test/hover-help/mypro.pro`,
      },
    ],
  },
];
