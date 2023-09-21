import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Illegal structure`, () => {
  it(`[auto generated] operations`, async () => {
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
      `pro struct_checks`,
      `compile_opt idl2`,
      ``,
      `str = {a: 42}`,
      ``,
      `a = 1 + str`,
      ``,
      `b = str + {a: 42}`,
      ``,
      `c = str + list()`,
      ``,
      `d = str + hash()`,
      ``,
      `e = str + orderedhash()`,
      ``,
      `f = str + dictionary()`,
      `end`,
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
        code: 85,
        info: 'Illegal use of structures, operations like addition, subtraction, etc are not allowed.',
        start: [5, 4, 1],
        end: [5, 8, 3],
      },
      {
        code: 85,
        info: 'Illegal use of structures, operations like addition, subtraction, etc are not allowed.',
        start: [9, 4, 3],
        end: [9, 15, 1],
      },
      {
        code: 85,
        info: 'Illegal use of structures, operations like addition, subtraction, etc are not allowed.',
        start: [11, 4, 3],
        end: [11, 15, 1],
      },
      {
        code: 85,
        info: 'Illegal use of structures, operations like addition, subtraction, etc are not allowed.',
        start: [13, 4, 3],
        end: [13, 22, 1],
      },
      {
        code: 85,
        info: 'Illegal use of structures, operations like addition, subtraction, etc are not allowed.',
        start: [15, 4, 3],
        end: [15, 21, 1],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [5, 0, 1],
        end: [5, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [7, 0, 1],
        end: [7, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [9, 0, 1],
        end: [9, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "d"',
        start: [11, 0, 1],
        end: [11, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "e"',
        start: [13, 0, 1],
        end: [13, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "f"',
        start: [15, 0, 1],
        end: [15, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
