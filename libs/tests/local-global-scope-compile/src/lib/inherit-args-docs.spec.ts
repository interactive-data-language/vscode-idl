import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly inherits docs for`, () => {
  it(`[auto generated] arguments`, async () => {
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
      `; :Args:`,
      `;  var1: in, required, any`,
      `;    My favorite thing`,
      `;`,
      `;-`,
      `pro mypro, var1`,
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
          var1: {
            type: 'v',
            name: 'var1',
            pos: [9, 11, 4],
            meta: {
              display: 'var1',
              isDefined: true,
              usage: [[9, 11, 4]],
              docs: 'My favorite thing',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
          args: {
            var1: {
              docs: 'My favorite thing',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'var1',
              code: true,
              pos: [9, 11, 4],
            },
          },
          docs: '\n```idl\nmypro, var1\n```\n\nMy procedure\n\n\n#### Arguments\n\n- **var1**: in, required, any\n\n  My favorite thing\n\n',
          docsLookup: { default: 'My procedure' },
          display: 'mypro',
          kws: {},
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
