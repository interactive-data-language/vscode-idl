import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] strings`, async () => {
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
      `  a = 'single quote'`,
      ``,
      `  b = "double quote"`,
      ``,
      `  c = \`literal string\``,
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
            pos: [3, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[3, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'String',
                  name: 'String',
                  args: [],
                  meta: {},
                  value: 'single quote',
                },
              ],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [5, 2, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[5, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'String',
                  name: 'String',
                  args: [],
                  meta: {},
                  value: 'double quote',
                },
              ],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [7, 2, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[7, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'String',
                  name: 'String',
                  args: [],
                  meta: {},
                  value: 'literal string',
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
