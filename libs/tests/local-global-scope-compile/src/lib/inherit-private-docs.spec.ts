import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly inherits docs for`, () => {
  it(`[auto generated] private`, async () => {
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
      ``,
      `;+`,
      `; My procedure`,
      `;`,
      `; :Keywords:`,
      `;  kw1: in, optional, type=boolean, private`,
      `;    Super Cool flag`,
      `;`,
      `;-`,
      `pro mypro, KW1=kw1`,
      `  compile_opt idl2`,
      `end`,
      ``,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: {
        mypro: {
          kw1: {
            type: 'v',
            name: 'kw1',
            pos: [9, 15, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              usage: [[9, 15, 3]],
              docs: 'Super Cool flag',
              source: 'user',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
            },
          },
        },
      },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'mypro',
        pos: [9, 4, 5],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmypro, $\n  /KW1\n```\n\nMy procedure\n\n\n#### Keywords\n\n- **KW1**: in, optional, Boolean\n\n    Super Cool flag\n\n',
          docsLookup: { default: 'My procedure' },
          display: 'mypro',
          kws: {
            kw1: {
              docs: 'Super Cool flag',
              direction: 'in',
              source: 'internal',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
              private: true,
              req: false,
              display: 'KW1',
              code: true,
              pos: [9, 11, 3],
            },
          },
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { mypro: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
