import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] With common blocks`, () => {
  it(`[auto generated] skip the name of the common block`, async () => {
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
      `; main level`,
      `compile_opt idl2`,
      `common theName, a1, bb, cc`,
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
        code: 104,
        info: 'Unused variable "a1"',
        start: [2, 16, 2],
        end: [2, 16, 2],
      },
      {
        code: 104,
        info: 'Unused variable "bb"',
        start: [2, 20, 2],
        end: [2, 20, 2],
      },
      {
        code: 104,
        info: 'Unused variable "cc"',
        start: [2, 24, 2],
        end: [2, 24, 2],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
