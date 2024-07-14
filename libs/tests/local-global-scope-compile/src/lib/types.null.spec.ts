import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] statements with !null types/values`, async () => {
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
      `pro dictionary_checks`,
      `compile_opt idl2`,
      ``,
      `a = 'string' eq !null`,
      ``,
      `b = [1,2,3] eq !null`,
      ``,
      `c = !null`,
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
        dictionary_checks: {
          a: {
            type: 'v',
            name: 'a',
            pos: [3, 0, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[3, 0, 1]],
              docs: '',
              source: 'user',
              type: [
                { display: 'Boolean', name: 'Boolean', args: [], meta: {} },
              ],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [5, 0, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[5, 0, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Boolean>',
                  args: [
                    [
                      {
                        name: 'Boolean',
                        display: 'Boolean',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [7, 0, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[7, 0, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'Null', name: 'Null', args: [], meta: {} }],
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
        name: 'dictionary_checks',
        pos: [0, 4, 17],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\ndictionary_checks\n```\n',
          docsLookup: {},
          display: 'dictionary_checks',
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
      pro: { dictionary_checks: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
