import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] type regressions to verify behavior`, async () => {
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
      `pro regressions`,
      `  compile_opt idl2`,
      ``,
      `  long1 = 5`,
      ``,
      `  long2 = ++long1`,
      ``,
      `  long3 = 1 + 2 + ++long2`,
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
        regressions: {
          long1: {
            type: 'v',
            name: 'long1',
            pos: [3, 2, 5],
            meta: {
              display: 'long1',
              isDefined: true,
              usage: [
                [3, 2, 5],
                [5, 12, 5],
              ],
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
          long2: {
            type: 'v',
            name: 'long2',
            pos: [5, 2, 5],
            meta: {
              display: 'long2',
              isDefined: true,
              usage: [
                [5, 2, 5],
                [7, 20, 5],
              ],
              docs: '',
              source: 'user',
              type: [{ display: 'Long', name: 'Long', args: [], meta: {} }],
            },
          },
          long3: {
            type: 'v',
            name: 'long3',
            pos: [7, 2, 5],
            meta: {
              display: 'long3',
              isDefined: true,
              usage: [[7, 2, 5]],
              docs: '',
              source: 'user',
              type: [{ display: 'Long', name: 'Long', args: [], meta: {} }],
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
        name: 'regressions',
        pos: [0, 4, 11],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nregressions\n```\n',
          docsLookup: {},
          display: 'regressions',
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
      pro: { regressions: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
