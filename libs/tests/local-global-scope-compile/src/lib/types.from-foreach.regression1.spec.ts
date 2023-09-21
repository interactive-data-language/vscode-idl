import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from foreach loop regression tests`, () => {
  it(`[auto generated] with bad syntax`, async () => {
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
      `pro `,
      `;+`,
      `; :Arguments:`,
      `;   item: in, required, List<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;-`,
      `pro foreach, item`,
      `  compile_opt idl2`,
      `  ; item is bad`,
      `  foreach val, item, key do print, val`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = { func: {}, pro: {}, main: {} };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = { func: {}, pro: {}, main: [] };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
