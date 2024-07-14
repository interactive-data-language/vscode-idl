import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] ternary`, async () => {
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
      `pro myPro`,
      `  compile_opt idl2`,
      ``,
      `  ; long or envi`,
      `  a = !true ? 5 + 15 : envi()`,
      ``,
      `  ; long or string`,
      `  b = !true ? 5 + 15 : 'string'`,
      ``,
      `  ; string`,
      `  c = !true ? 'string' : 'false'`,
      ``,
      `  ; number`,
      `  d = !true ? 5 : 6`,
      ``,
      `  ; any`,
      `  e = !true ? 5 `,
      ``,
      `  ; any`,
      `  f = !true ? 5 :`,
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
        mypro: {
          a: {
            type: 'v',
            name: 'a',
            pos: [4, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[4, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { display: 'Long', name: 'Long', args: [], meta: {} },
                { name: 'ENVI', display: 'ENVI', args: [], meta: {} },
              ],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [7, 2, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[7, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { display: 'Long', name: 'Long', args: [], meta: {} },
                {
                  display: 'String',
                  name: 'String',
                  args: [],
                  meta: {},
                  value: 'string',
                },
              ],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [10, 2, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[10, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'String',
                  name: 'String',
                  args: [],
                  meta: {},
                  value: 'string',
                },
              ],
            },
          },
          d: {
            type: 'v',
            name: 'd',
            pos: [13, 2, 1],
            meta: {
              display: 'd',
              isDefined: true,
              usage: [[13, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '5',
                },
              ],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [16, 2, 1],
            meta: {
              display: 'e',
              isDefined: true,
              usage: [[16, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          f: {
            type: 'v',
            name: 'f',
            pos: [19, 2, 1],
            meta: {
              display: 'f',
              isDefined: true,
              usage: [[19, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
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
        pos: [0, 4, 5],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmyPro\n```\n',
          docsLookup: {},
          display: 'myPro',
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
