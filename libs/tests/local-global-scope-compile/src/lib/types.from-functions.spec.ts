import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] functions`, async () => {
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
      `  a = ENVISubsetRaster()`,
      ``,
      `  b = ENVITask('subsetraster')`,
      ``,
      `  c = obj_new('envitask')`,
      ``,
      `  d = keyword_set(5)`,
      ``,
      `  e = dictionary()`,
      ``,
      `  f = ENVITensorFlowModel()`,
      ``,
      `  g = IDLTask('MyTask')`,
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
                  name: 'ENVISubsetRaster',
                  display: 'ENVISubsetRaster',
                  args: [],
                  meta: {},
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
                  name: 'envisubsetrastertask',
                  display: 'ENVITask<SubsetRaster>',
                  args: [
                    [
                      {
                        name: 'SubsetRaster',
                        display: 'SubsetRaster',
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
            pos: [7, 2, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[7, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'envitask',
                  display: 'ENVITask<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          d: {
            type: 'v',
            name: 'd',
            pos: [9, 2, 1],
            meta: {
              display: 'd',
              isDefined: true,
              usage: [[9, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { display: 'Boolean', name: 'Boolean', args: [], meta: {} },
              ],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [11, 2, 1],
            meta: {
              display: 'e',
              isDefined: true,
              usage: [[11, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Dictionary',
                  display: 'Dictionary<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          f: {
            type: 'v',
            name: 'f',
            pos: [13, 2, 1],
            meta: {
              display: 'f',
              isDefined: true,
              usage: [[13, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ENVITensorFlowModel',
                  display: 'ENVITensorFlowModel',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          g: {
            type: 'v',
            name: 'g',
            pos: [15, 2, 1],
            meta: {
              display: 'g',
              isDefined: true,
              usage: [[15, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'idlmytasktask',
                  display: 'IDLTask<mytask>',
                  args: [
                    [{ name: 'mytask', display: 'mytask', args: [], meta: {} }],
                  ],
                  meta: {},
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

  it(`[auto generated] functions with other strings`, async () => {
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
      `  a = ENVITask("subsetraster")`,
      ``,
      `  b = ENVITask(\`subsetraster\`)`,
      ``,
      `  c = obj_new("envitask")`,
      ``,
      `  d = obj_new(\`envitask\`)`,
      ``,
      `  e = IDLTask("MyTask")`,
      ``,
      `  f = IDLTask(\`MyTask\`)`,
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
                  name: 'envisubsetrastertask',
                  display: 'ENVITask<SubsetRaster>',
                  args: [
                    [
                      {
                        name: 'SubsetRaster',
                        display: 'SubsetRaster',
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
                  name: 'envisubsetrastertask',
                  display: 'ENVITask<SubsetRaster>',
                  args: [
                    [
                      {
                        name: 'SubsetRaster',
                        display: 'SubsetRaster',
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
            pos: [7, 2, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[7, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'envitask',
                  display: 'ENVITask<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          d: {
            type: 'v',
            name: 'd',
            pos: [9, 2, 1],
            meta: {
              display: 'd',
              isDefined: true,
              usage: [[9, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'envitask',
                  display: 'ENVITask<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [11, 2, 1],
            meta: {
              display: 'e',
              isDefined: true,
              usage: [[11, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'idlmytasktask',
                  display: 'IDLTask<mytask>',
                  args: [
                    [{ name: 'mytask', display: 'mytask', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          f: {
            type: 'v',
            name: 'f',
            pos: [13, 2, 1],
            meta: {
              display: 'f',
              isDefined: true,
              usage: [[13, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'idlmytasktask',
                  display: 'IDLTask<mytask>',
                  args: [
                    [{ name: 'mytask', display: 'mytask', args: [], meta: {} }],
                  ],
                  meta: {},
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
