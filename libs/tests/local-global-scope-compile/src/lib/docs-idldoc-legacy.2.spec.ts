import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Parse legacy IDL Doc styles`, () => {
  it(`[auto generated] for multi line and complex docs`, async () => {
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
      `; @Param`,
      `;   TheParam {out}{required}`,
      `;     My docs for a parameter`,
      `;`,
      `; @Keyword`,
      `;   TheKeyword {in}{optional}{type=boolean}{default=0}`,
      `;     My docs for a keyword`,
      `;`,
      `;-`,
      `pro mypro2, TheParam, thekeyword = keyword`,
      `  compile_opt idl2`,
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

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: {
        mypro2: {
          keyword: {
            type: 'v',
            name: 'keyword',
            pos: [10, 35, 7],
            meta: {
              display: 'keyword',
              isDefined: true,
              canReset: false,
              usage: [[10, 35, 7]],
              docs: 'My docs for a keyword',
              source: 'user',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
            },
          },
          theparam: {
            type: 'v',
            name: 'theparam',
            pos: [10, 12, 8],
            meta: {
              display: 'TheParam',
              isDefined: true,
              canReset: false,
              usage: [[10, 12, 8]],
              docs: 'My docs for a parameter',
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
        name: 'mypro2',
        pos: [10, 4, 6],
        range: { start: [10, 0, 4], end: [13, 0, 3] },
        meta: {
          source: 'user',
          args: {
            theparam: {
              docs: 'My docs for a parameter',
              direction: 'out',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'TheParam',
              code: true,
              pos: [10, 12, 8],
            },
          },
          docs: '\n```idl\nmypro2, TheParam, $\n  /thekeyword\n```\n\n\n\n\n#### Arguments\n\n- **TheParam**: out, required, any\n\n  My docs for a parameter\n\n\n\n#### Keywords\n\n- **thekeyword**: in, optional, Boolean\n\n    My docs for a keyword\n\n',
          docsLookup: { default: '' },
          display: 'mypro2',
          kws: {
            thekeyword: {
              docs: 'My docs for a keyword',
              direction: 'in',
              source: 'internal',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
              private: false,
              req: false,
              display: 'thekeyword',
              code: true,
              pos: [10, 22, 10],
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
      pro: { mypro2: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
