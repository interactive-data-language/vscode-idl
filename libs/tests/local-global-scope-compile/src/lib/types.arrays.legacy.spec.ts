import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] array creation using brackets`, async () => {
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
      `; :Arguments:`,
      `;   a: bidirectional, required, boolarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   b: bidirectional, required, bytarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   c: bidirectional, required, complexarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   d: bidirectional, required, dblarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   e: bidirectional, required, dcomplexarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   f: bidirectional, required, fltarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   g: bidirectional, required, intarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   h: bidirectional, required, lonarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   i: bidirectional, required, lon64arr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   j: bidirectional, required, strarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   k: bidirectional, required, uintarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   l: bidirectional, required, ulonarr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   m: bidirectional, required, ulon64arr`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro ArrayTypes, a, b, c, d, e, f, g, h, i, j, k, l, m`,
      `  compile_opt idl2`,
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
        arraytypes: {
          a: {
            type: 'v',
            name: 'a',
            pos: [30, 16, 1],
            meta: {
              display: 'a',
              isDefined: true,
              canReset: false,
              usage: [[30, 16, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
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
          b: {
            type: 'v',
            name: 'b',
            pos: [30, 19, 1],
            meta: {
              display: 'b',
              isDefined: true,
              canReset: false,
              usage: [[30, 19, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Byte>',
                  args: [
                    [{ name: 'Byte', display: 'Byte', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [30, 22, 1],
            meta: {
              display: 'c',
              isDefined: true,
              canReset: false,
              usage: [[30, 22, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Complex>',
                  args: [
                    [
                      {
                        name: 'Complex',
                        display: 'Complex',
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
          d: {
            type: 'v',
            name: 'd',
            pos: [30, 25, 1],
            meta: {
              display: 'd',
              isDefined: true,
              canReset: false,
              usage: [[30, 25, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  args: [
                    [{ name: 'Double', display: 'Double', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [30, 28, 1],
            meta: {
              display: 'e',
              isDefined: true,
              canReset: false,
              usage: [[30, 28, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<DoubleComplex>',
                  args: [
                    [
                      {
                        name: 'DoubleComplex',
                        display: 'DoubleComplex',
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
          f: {
            type: 'v',
            name: 'f',
            pos: [30, 31, 1],
            meta: {
              display: 'f',
              isDefined: true,
              canReset: false,
              usage: [[30, 31, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Float>',
                  args: [
                    [{ name: 'Float', display: 'Float', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          g: {
            type: 'v',
            name: 'g',
            pos: [30, 34, 1],
            meta: {
              display: 'g',
              isDefined: true,
              canReset: false,
              usage: [[30, 34, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Int>',
                  args: [[{ name: 'Int', display: 'Int', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          h: {
            type: 'v',
            name: 'h',
            pos: [30, 37, 1],
            meta: {
              display: 'h',
              isDefined: true,
              canReset: false,
              usage: [[30, 37, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Long>',
                  args: [
                    [{ name: 'Long', display: 'Long', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          i: {
            type: 'v',
            name: 'i',
            pos: [30, 40, 1],
            meta: {
              display: 'i',
              isDefined: true,
              canReset: false,
              usage: [[30, 40, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Long64>',
                  args: [
                    [{ name: 'Long64', display: 'Long64', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          j: {
            type: 'v',
            name: 'j',
            pos: [30, 43, 1],
            meta: {
              display: 'j',
              isDefined: true,
              canReset: false,
              usage: [[30, 43, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          k: {
            type: 'v',
            name: 'k',
            pos: [30, 46, 1],
            meta: {
              display: 'k',
              isDefined: true,
              canReset: false,
              usage: [[30, 46, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<UInt>',
                  args: [
                    [{ name: 'UInt', display: 'UInt', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          l: {
            type: 'v',
            name: 'l',
            pos: [30, 49, 1],
            meta: {
              display: 'l',
              isDefined: true,
              canReset: false,
              usage: [[30, 49, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ULong>',
                  args: [
                    [{ name: 'ULong', display: 'ULong', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          m: {
            type: 'v',
            name: 'm',
            pos: [30, 52, 1],
            meta: {
              display: 'm',
              isDefined: true,
              canReset: false,
              usage: [[30, 52, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ULong64>',
                  args: [
                    [
                      {
                        name: 'ULong64',
                        display: 'ULong64',
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
        name: 'arraytypes',
        pos: [30, 4, 10],
        range: { start: [30, 0, 4], end: [32, 0, 3] },
        meta: {
          source: 'user',
          args: {
            a: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
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
              private: false,
              req: true,
              display: 'a',
              code: true,
              pos: [30, 16, 1],
            },
            b: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Byte>',
                  args: [
                    [{ name: 'Byte', display: 'Byte', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'b',
              code: true,
              pos: [30, 19, 1],
            },
            c: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Complex>',
                  args: [
                    [
                      {
                        name: 'Complex',
                        display: 'Complex',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'c',
              code: true,
              pos: [30, 22, 1],
            },
            d: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Double>',
                  args: [
                    [{ name: 'Double', display: 'Double', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'd',
              code: true,
              pos: [30, 25, 1],
            },
            e: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<DoubleComplex>',
                  args: [
                    [
                      {
                        name: 'DoubleComplex',
                        display: 'DoubleComplex',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'e',
              code: true,
              pos: [30, 28, 1],
            },
            f: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Float>',
                  args: [
                    [{ name: 'Float', display: 'Float', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'f',
              code: true,
              pos: [30, 31, 1],
            },
            g: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Int>',
                  args: [[{ name: 'Int', display: 'Int', args: [], meta: {} }]],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'g',
              code: true,
              pos: [30, 34, 1],
            },
            h: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Long>',
                  args: [
                    [{ name: 'Long', display: 'Long', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'h',
              code: true,
              pos: [30, 37, 1],
            },
            i: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Long64>',
                  args: [
                    [{ name: 'Long64', display: 'Long64', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'i',
              code: true,
              pos: [30, 40, 1],
            },
            j: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'j',
              code: true,
              pos: [30, 43, 1],
            },
            k: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<UInt>',
                  args: [
                    [{ name: 'UInt', display: 'UInt', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'k',
              code: true,
              pos: [30, 46, 1],
            },
            l: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ULong>',
                  args: [
                    [{ name: 'ULong', display: 'ULong', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'l',
              code: true,
              pos: [30, 49, 1],
            },
            m: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ULong64>',
                  args: [
                    [
                      {
                        name: 'ULong64',
                        display: 'ULong64',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'm',
              code: true,
              pos: [30, 52, 1],
            },
          },
          docs: '\n```idl\nArrayTypes, a, b, c, d, e, f, g, h, i, j, k, l, m\n```\n\n\n\n\n#### Arguments\n\n- **a**: bidirectional, required, Array<Boolean>\n\n  Placeholder docs for argument, keyword, or property\n\n- **b**: bidirectional, required, Array<Byte>\n\n  Placeholder docs for argument, keyword, or property\n\n- **c**: bidirectional, required, Array<Complex>\n\n  Placeholder docs for argument, keyword, or property\n\n- **d**: bidirectional, required, Array<Double>\n\n  Placeholder docs for argument, keyword, or property\n\n- **e**: bidirectional, required, Array<DoubleComplex>\n\n  Placeholder docs for argument, keyword, or property\n\n- **f**: bidirectional, required, Array<Float>\n\n  Placeholder docs for argument, keyword, or property\n\n- **g**: bidirectional, required, Array<Int>\n\n  Placeholder docs for argument, keyword, or property\n\n- **h**: bidirectional, required, Array<Long>\n\n  Placeholder docs for argument, keyword, or property\n\n- **i**: bidirectional, required, Array<Long64>\n\n  Placeholder docs for argument, keyword, or property\n\n- **j**: bidirectional, required, Array<String>\n\n  Placeholder docs for argument, keyword, or property\n\n- **k**: bidirectional, required, Array<UInt>\n\n  Placeholder docs for argument, keyword, or property\n\n- **l**: bidirectional, required, Array<ULong>\n\n  Placeholder docs for argument, keyword, or property\n\n- **m**: bidirectional, required, Array<ULong64>\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'ArrayTypes',
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
      pro: { arraytypes: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
