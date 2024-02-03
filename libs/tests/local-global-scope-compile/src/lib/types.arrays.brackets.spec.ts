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
      `pro array_creation`,
      `  compile_opt idl2`,
      ``,
      `  ; long`,
      `  a = [1, 2, 3, 4]`,
      ``,
      `  ; float`,
      `  b = [1, 2, 3, 4.]`,
      ``,
      `  ; double`,
      `  c = [1, 2, 3, 4d]`,
      ``,
      `  ; complex double`,
      `  d = [1, 2, 3, 4di]`,
      ``,
      `  ; invalid`,
      `  e = [1, 2, 3, plot()]`,
      ``,
      `  ; ignore if element has Null`,
      `  f = [1, 2, 3, !null, 4, 5]`,
      ``,
      `  ; no nested arrays, just promoted`,
      `  g = [1, 2, 3, [1, 2, 3, 4d], 4, 5]`,
      ``,
      `  ; array of lists`,
      `  h = [list(), list()]`,
      ``,
      `  ; array of ENVIRasters`,
      `  i = [ENVIRaster(), ENVIRaster()]`,
      ``,
      `  ; array of any`,
      `  j = [ENVIRaster(), plot()]`,
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
        array_creation: {
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
              type: [
                {
                  name: 'Array',
                  display: 'Array<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
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
          g: {
            type: 'v',
            name: 'g',
            pos: [22, 2, 1],
            meta: {
              display: 'g',
              isDefined: true,
              usage: [[22, 2, 1]],
              docs: '',
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
          h: {
            type: 'v',
            name: 'h',
            pos: [25, 2, 1],
            meta: {
              display: 'h',
              isDefined: true,
              usage: [[25, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<List<any>>',
                  args: [
                    [
                      {
                        name: 'List',
                        display: 'List<any>',
                        args: [
                          [{ name: 'any', display: 'any', args: [], meta: {} }],
                        ],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          i: {
            type: 'v',
            name: 'i',
            pos: [28, 2, 1],
            meta: {
              display: 'i',
              isDefined: true,
              usage: [[28, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ENVIRaster>',
                  args: [
                    [
                      {
                        name: 'ENVIRaster',
                        display: 'ENVIRaster',
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
          j: {
            type: 'v',
            name: 'j',
            pos: [31, 2, 1],
            meta: {
              display: 'j',
              isDefined: true,
              usage: [[31, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ENVIRaster | Plot>',
                  args: [
                    [
                      {
                        name: 'ENVIRaster',
                        display: 'ENVIRaster',
                        args: [],
                        meta: {},
                      },
                      { name: 'Plot', display: 'Plot', args: [], meta: {} },
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
        name: 'array_creation',
        pos: [0, 4, 14],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\narray_creation\n```\n',
          docsLookup: {},
          display: 'array_creation',
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
      pro: { array_creation: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
