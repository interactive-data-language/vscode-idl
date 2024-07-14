import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Disable problems:`, () => {
  it(`[auto generated] all problems`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [
      `; idl-disable`,
      `i write perfect code`,
      `with all the errors . . . . .`,
      `-> a = (`,
      `begin`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 0,
        info: 'Statement is not closed as expected',
        start: [3, 7, 1],
        end: [3, 7, 1],
        canReport: false,
      },
      {
        code: 69,
        info: 'Unfinished statement or invalid syntax for properties, methods, or numbers',
        start: [2, 20, 1],
        end: [2, 20, 1],
        canReport: false,
      },
      {
        code: 69,
        info: 'Unfinished statement or invalid syntax for properties, methods, or numbers',
        start: [2, 22, 1],
        end: [2, 22, 1],
        canReport: false,
      },
      {
        code: 69,
        info: 'Unfinished statement or invalid syntax for properties, methods, or numbers',
        start: [2, 24, 1],
        end: [2, 24, 1],
        canReport: false,
      },
      {
        code: 69,
        info: 'Unfinished statement or invalid syntax for properties, methods, or numbers',
        start: [2, 26, 1],
        end: [2, 26, 1],
        canReport: false,
      },
      {
        code: 69,
        info: 'Unfinished statement or invalid syntax for properties, methods, or numbers',
        start: [2, 28, 1],
        end: [2, 28, 1],
        canReport: false,
      },
      {
        code: 8,
        info: 'Arrow functions must be followed by the method name or super::method name and cannot be split between lines',
        start: [3, 0, 3],
        end: [3, 0, 3],
        canReport: false,
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 13],
        end: [0, 0, 13],
        canReport: false,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [1, 0, 1],
        end: [1, 8, 7],
        canReport: false,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [2, 0, 4],
        end: [2, 28, 1],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [1, 0, 1],
        end: [1, 2, 5],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [1, 2, 5],
        end: [1, 8, 7],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [2, 0, 4],
        end: [2, 5, 3],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [2, 5, 3],
        end: [2, 9, 3],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [2, 9, 3],
        end: [2, 13, 6],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [2, 20, 1],
        end: [2, 22, 1],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [2, 22, 1],
        end: [2, 24, 1],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [2, 24, 1],
        end: [2, 26, 1],
        canReport: false,
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [2, 26, 1],
        end: [2, 28, 1],
        canReport: false,
      },
      {
        code: 99,
        info: 'Undefined variable "i"',
        start: [1, 0, 1],
        end: [1, 0, 1],
        canReport: false,
      },
      {
        code: 99,
        info: 'Undefined variable "write"',
        start: [1, 2, 5],
        end: [1, 2, 5],
        canReport: false,
      },
      {
        code: 99,
        info: 'Undefined variable "perfect"',
        start: [1, 8, 7],
        end: [1, 8, 7],
        canReport: false,
      },
      {
        code: 99,
        info: 'Undefined variable "with"',
        start: [2, 0, 4],
        end: [2, 0, 4],
        canReport: false,
      },
      {
        code: 99,
        info: 'Undefined variable "all"',
        start: [2, 5, 3],
        end: [2, 5, 3],
        canReport: false,
      },
      {
        code: 99,
        info: 'Undefined variable "the"',
        start: [2, 9, 3],
        end: [2, 9, 3],
        canReport: false,
      },
      {
        code: 99,
        info: 'Undefined variable "errors"',
        start: [2, 13, 6],
        end: [2, 13, 6],
        canReport: false,
      },
      {
        code: 99,
        info: 'Undefined variable "begin"',
        start: [4, 0, 5],
        end: [4, 0, 5],
        canReport: false,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [3, 3, 1],
        end: [3, 3, 1],
        canReport: false,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] all problems 2`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [`; idl-disable     `, `a = 42`];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 18],
        end: [0, 0, 18],
        canReport: false,
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [1, 0, 1.7976931348623157e308],
        end: [1, 0, 1.7976931348623157e308],
        canReport: false,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [1, 0, 1],
        end: [1, 0, 1],
        canReport: false,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
