import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects bad continue statements`, () => {
  it(`[auto generated] no problems in loops`, async () => {
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
      `compile_opt idl2`,
      `for i=0,10 do if !true then continue`,
      `foreach val, key do if !true then continue`,
      `while !true do if !false then continue`,
      `repeat if !true then continue until !true`,
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
        code: 99,
        info: 'Undefined variable "key"',
        start: [2, 13, 3],
        end: [2, 13, 3],
      },
      {
        code: 104,
        info: 'Unused variable "i"',
        start: [1, 4, 1],
        end: [1, 4, 1],
      },
      {
        code: 104,
        info: 'Unused variable "val"',
        start: [2, 8, 3],
        end: [2, 8, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems outside of loops`, async () => {
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
    const code = [`compile_opt idl2`, `continue`, `end`];

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
        code: 66,
        info: '"continue" statements can only exist within a loop',
        start: [1, 0, 8],
        end: [1, 0, 8],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
