import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly gets docs and variables`, () => {
  it(`[auto generated] for a routine`, async () => {
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
      `; :Keywords:`,
      `;  kw1: in, optional, type=boolean`,
      `;    Super Cool flag`,
      `;`,
      `;-`,
      `pro mypro, var1, KW1=kw1`,
      `  compile_opt idl2`,
      `  ;+ awesome variable with docs`,
      `  a = 42`,
      `  ;+`,
      `  ; Big comment block here`,
      `  ; like a great code writer`,
      `  ;-`,
      `  b = 42`,
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
            pos: [13, 21, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              usage: [[13, 21, 3]],
              docs: 'Super Cool flag',
              source: 'user',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
            },
          },
          var1: {
            type: 'v',
            name: 'var1',
            pos: [13, 11, 4],
            meta: {
              display: 'var1',
              isDefined: true,
              usage: [[13, 11, 4]],
              docs: 'My favorite thing',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [16, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[16, 2, 1]],
              docs: 'awesome variable with docs',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '42',
                },
              ],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [21, 2, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[21, 2, 1]],
              docs: 'Big comment block here\nlike a great code writer',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '42',
                },
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
        pos: [13, 4, 5],
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
              pos: [13, 11, 4],
            },
          },
          docs: '\n```idl\nmypro, var1, $\n [ /KW1 ]\n```\n\nMy procedure\n\n#### Arguments\n\n- **var1**: in, required, any\n\n  My favorite thing\n\n\n#### Keywords\n\n- **KW1**: in, optional, Boolean\n\n    Super Cool flag\n\n',
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
              private: false,
              req: false,
              display: 'KW1',
              code: true,
              pos: [13, 17, 3],
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
