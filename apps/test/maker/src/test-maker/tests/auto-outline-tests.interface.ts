import { IOutlineTests } from '../tests.interface';

/**
 * Automated tests for generating an outline based on source code
 */
export const AUTO_OUTLINE_TESTS: IOutlineTests[] = [
  {
    suiteName: `Extracts outline`,
    fileName: `def-files.1.spec.ts`,
    tests: [
      {
        name: `for def files`,
        file: `apps/test/idl/hover-help/testroutine.pro.def`,
      },
    ],
  },
  {
    suiteName: `Extracts outline`,
    fileName: `ex-1.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        file: `apps/test/idl/hover-help/awesomerasterintersection.pro`,
      },
    ],
  },
  {
    suiteName: `Extracts outline with main`,
    fileName: `ex-2.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        file: `apps/test/idl/hover-help/myfunc.pro`,
      },
    ],
  },
  {
    suiteName: `Extracts outline`,
    fileName: `ex-3.spec.ts`,
    tests: [
      {
        name: `extract correct tokens with multiple parent routines`,
        file: `apps/test/idl/hover-help/mypro.pro`,
      },
    ],
  },
];
