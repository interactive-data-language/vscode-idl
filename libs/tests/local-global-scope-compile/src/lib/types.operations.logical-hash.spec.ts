import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] hash operations using logical operators`, async () => {
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
      `pro typetest`,
      `  compile_opt idl2`,
      ``,
      `  ; variable`,
      `  var = hash()`,
      ``,
      `  ; all cases we need to handle`,
      `  res1 = var not !null`,
      `  res2 = var eq !null`,
      `  res3 = var ne !null`,
      `  res4 = var le !null`,
      `  res5 = var lt !null`,
      `  res6 = var ge !null`,
      `  res7 = var gt !null`,
      `  res8 = var and !null`,
      `  res9 = var or !null`,
      `  res10 = var xor !null`,
      ``,
      `  ; all cases we need to handle`,
      `  bool1 = var && !null`,
      `  bool2 = var || !null`,
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
        typetest: {
          var: {
            type: 'v',
            name: 'var',
            pos: [4, 2, 3],
            meta: {
              display: 'var',
              isDefined: true,
              usage: [
                [4, 2, 3],
                [7, 9, 3],
                [8, 9, 3],
                [9, 9, 3],
                [10, 9, 3],
                [11, 9, 3],
                [12, 9, 3],
                [13, 9, 3],
                [14, 9, 3],
                [15, 9, 3],
                [16, 10, 3],
                [19, 10, 3],
                [20, 10, 3],
              ],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Hash',
                  display: 'Hash<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          res1: {
            type: 'v',
            name: 'res1',
            pos: [7, 2, 4],
            meta: {
              display: 'res1',
              isDefined: true,
              usage: [[7, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res2: {
            type: 'v',
            name: 'res2',
            pos: [8, 2, 4],
            meta: {
              display: 'res2',
              isDefined: true,
              usage: [[8, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res3: {
            type: 'v',
            name: 'res3',
            pos: [9, 2, 4],
            meta: {
              display: 'res3',
              isDefined: true,
              usage: [[9, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res4: {
            type: 'v',
            name: 'res4',
            pos: [10, 2, 4],
            meta: {
              display: 'res4',
              isDefined: true,
              usage: [[10, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res5: {
            type: 'v',
            name: 'res5',
            pos: [11, 2, 4],
            meta: {
              display: 'res5',
              isDefined: true,
              usage: [[11, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res6: {
            type: 'v',
            name: 'res6',
            pos: [12, 2, 4],
            meta: {
              display: 'res6',
              isDefined: true,
              usage: [[12, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res7: {
            type: 'v',
            name: 'res7',
            pos: [13, 2, 4],
            meta: {
              display: 'res7',
              isDefined: true,
              usage: [[13, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res8: {
            type: 'v',
            name: 'res8',
            pos: [14, 2, 4],
            meta: {
              display: 'res8',
              isDefined: true,
              usage: [[14, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res9: {
            type: 'v',
            name: 'res9',
            pos: [15, 2, 4],
            meta: {
              display: 'res9',
              isDefined: true,
              usage: [[15, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          res10: {
            type: 'v',
            name: 'res10',
            pos: [16, 2, 5],
            meta: {
              display: 'res10',
              isDefined: true,
              usage: [[16, 2, 5]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          bool1: {
            type: 'v',
            name: 'bool1',
            pos: [19, 2, 5],
            meta: {
              display: 'bool1',
              isDefined: true,
              usage: [[19, 2, 5]],
              docs: '',
              source: 'user',
              type: [
                { display: 'Boolean', name: 'Boolean', args: [], meta: {} },
              ],
            },
          },
          bool2: {
            type: 'v',
            name: 'bool2',
            pos: [20, 2, 5],
            meta: {
              display: 'bool2',
              isDefined: true,
              usage: [[20, 2, 5]],
              docs: '',
              source: 'user',
              type: [
                { display: 'Boolean', name: 'Boolean', args: [], meta: {} },
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
        name: 'typetest',
        pos: [0, 4, 8],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\ntypetest\n```\n',
          docsLookup: {},
          display: 'typetest',
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
      pro: { typetest: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
