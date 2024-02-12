import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Without docs, keywords are least restrictive`, () => {
  it(`[auto generated] and bidirectional`, async () => {
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
      `pro unknown_kw_relaxed, kw = kw`,
      `compile_opt idl2`,
      `end`,
      ``,
      `; main`,
      `compile_opt idl2`,
      `unknown_kw_relaxed, kw = newVar`,
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
        info: 'Unused variable "newVar"',
        start: [6, 25, 6],
        end: [6, 25, 6],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [0, 29, 2],
        end: [0, 29, 2],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
