import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] property indexing`, async () => {
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
      `pro mypro1`,
      `  compile_opt idl2`,
      `  ; number or array of numbers`,
      `  index = where('5' eq fn)`,
      `  ; any`,
      `  x = (!null).(1)[index]`,
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
        mypro1: {
          index: {
            type: 'v',
            name: 'index',
            pos: [3, 2, 5],
            meta: {
              display: 'index',
              isDefined: true,
              usage: [
                [3, 2, 5],
                [5, 18, 5],
              ],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                {
                  name: 'Array',
                  display: 'Array<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          fn: {
            type: 'v',
            name: 'fn',
            pos: [3, 23, 2],
            meta: {
              display: 'fn',
              isDefined: false,
              usage: [[3, 23, 2]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          x: {
            type: 'v',
            name: 'x',
            pos: [5, 2, 1],
            meta: {
              display: 'x',
              isDefined: true,
              usage: [[5, 2, 1]],
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
        name: 'mypro1',
        pos: [0, 4, 6],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmypro1\n```\n',
          docsLookup: {},
          display: 'mypro1',
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
      pro: { mypro1: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
