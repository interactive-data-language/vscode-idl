import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Check for known keywords`, () => {
  it(`[auto generated] but always ignore extra and strict extra`, async () => {
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
      `;+`,
      `; :Returns:`,
      `;   any`,
      `;`,
      `;-`,
      `function auto_doc_example`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `; main`,
      `compile_opt idl2`,
      ``,
      `; no error`,
      `a = auto_doc_example(_extra = !null)`,
      ``,
      `; no error`,
      `a = auto_doc_example(_strict_extra = !null)`,
      ``,
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
    const expected: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
