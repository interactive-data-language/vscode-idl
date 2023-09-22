import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects problems after main level`, () => {
  it(`[auto generated] statements after main level`, async () => {
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
    const code = [`compile_opt idl2`, `end`, `a = 5`];

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
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [2, 0, 1],
        end: [2, 0, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [2, 2, 1],
        end: [2, 2, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [2, 4, 1],
        end: [2, 4, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [2, 5, 0],
        end: [2, 5, 0],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] allow comments after main`, async () => {
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
    const code = [`compile_opt idl2`, `end`, `; ok`];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
