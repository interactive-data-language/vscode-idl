import { IGlobalProblemTests } from '../tests.interface';

/**
 * Automated tests to detect conflicts with global routine conflict
 * detection.
 *
 * Includes logic to add and remove files showing that the index
 * properly updates according to the specified action.
 */
export const AUTO_GLOBAL_PROBLEM_TESTS: IGlobalProblemTests[] = [
  {
    suiteName: `Correctly identify duplicate problems`,
    fileName: `duplicates.spec.ts`,
    tests: [
      {
        name: 'while adding and removing files',
        workspace: 'idl/test/global-problems',
        actions: [
          {
            action: 'add',
            file: 'file1.pro',
          },
          {
            action: 'add',
            file: 'file2.pro',
          },
          {
            action: 'add',
            file: 'file3.pro',
          },
          {
            action: 'remove',
            file: 'file1.pro',
          },
          {
            action: 'remove',
            file: 'file2.pro',
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly ignore main level programs as duplicates`,
    fileName: `no-duplicate-main.spec.ts`,
    tests: [
      {
        name: 'with multiple files in the same workspace',
        workspace: 'idl/test/global-main-problems',
        actions: [
          {
            action: 'add',
            file: 'file1.pro',
          },
          {
            action: 'add',
            file: 'file2.pro',
          },
        ],
      },
    ],
  },
];
