import { IAutoSelectedTest } from '../tests.interface';

/**
 * Automated tests to get our selected token at a cursor position
 *
 * These are also covered with hover help and auto-complete tests
 */
export const AUTO_SELECTED_TOKEN_TESTS: IAutoSelectedTest[] = [
  {
    suiteName: `Correctly identifies search terms from syntax tree`,
    fileName: `basic.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        code: [
          `function myfunc`,
          `  return,1`,
          `end`,
          ``,
          `; main level`,
          `something = 42`,
          `end`,
        ],
        position: [
          {
            line: 0,
            character: 0,
          },
          {
            line: 3,
            character: 0,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identifies keywords from routine calls`,
    fileName: `keywords.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        code: [
          `; main level`,
          `r = ENVIRaster(NCOLUMNS = nCols, NROWS = nrows)`,
          `end`,
        ],
        position: [
          {
            line: 1,
            character: 20,
          },
          {
            line: 1,
            character: 35,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identifies search terms from syntax tree`,
    fileName: `proper-parent.spec.ts`,
    tests: [
      {
        name: `extract correct tokens with multiple parent routines`,
        code: [
          `function myfunc2`,
          `  compile_opt idl2`,
          `  a = 42`,
          `  return,1`,
          `end`,
          ``,
          `function myfunc1`,
          `  compile_opt idl2`,
          `  a = 17`,
          `  return,1`,
          `end`,
        ],
        position: [
          {
            line: 2,
            character: 2,
          },
          {
            line: 8,
            character: 2,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly use relaxed options for hover help`,
    fileName: `relaxed.spec.ts`,
    tests: [
      {
        name: `at end of assignment`,
        code: [
          `function myfunc1`,
          `  compile_opt idl2`,
          `  a = `,
          `  return,1`,
          `end`,
        ],
        position: [
          {
            line: 2,
            character: 5,
          },
          {
            line: 8,
            character: 6,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Find the right token when we do/don't have anything selected`,
    fileName: `within-parent.spec.ts`,
    tests: [
      {
        name: `with a branch token`,
        code: [`args.setData,   `, `end`],
        position: [
          { line: 0, character: 12 },
          { line: 0, character: 13 },
          { line: 0, character: 14 },
          { line: 0, character: 15 },
          { line: 0, character: 16 },
        ],
      },
    ],
  },
];
