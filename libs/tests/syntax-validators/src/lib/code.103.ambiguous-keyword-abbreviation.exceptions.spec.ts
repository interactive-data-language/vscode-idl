import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Keywords that could be abbreviated`, () => {
  it(`[auto generated] but have a direct match`, async () => {
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
      `; main leve program`,
      `compile_opt idl2`,
      ``,
      `; problem 1`,
      `device, /close`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
