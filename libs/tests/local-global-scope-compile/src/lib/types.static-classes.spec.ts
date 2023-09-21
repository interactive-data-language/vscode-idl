import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] named static classes methods/properties`, async () => {
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
      `  a = IDL_Number.ndim`,
      `  b = envi.openRaster()`,
      `  any1 = image ; nothing`,
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
              type: [{ display: 'Int', name: 'Int', args: [], meta: {} }],
            },
          },
          idl_number: {
            type: 'v',
            name: 'idl_number',
            pos: [3, 6, 10],
            meta: {
              display: 'IDL_Number',
              isDefined: true,
              usage: [[3, 6, 10]],
              docs: 'A static reference to the class "IDL_Number"',
              source: 'user',
              type: [
                {
                  name: 'IDL_Number',
                  display: 'IDL_Number',
                  args: [],
                  meta: {},
                },
              ],
              isStaticClass: true,
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [4, 2, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[4, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
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
          envi: {
            type: 'v',
            name: 'envi',
            pos: [4, 6, 4],
            meta: {
              display: 'envi',
              isDefined: true,
              usage: [[4, 6, 4]],
              docs: 'A static reference to the class "ENVI"',
              source: 'user',
              type: [{ name: 'ENVI', display: 'ENVI', args: [], meta: {} }],
              isStaticClass: true,
            },
          },
          any1: {
            type: 'v',
            name: 'any1',
            pos: [5, 2, 4],
            meta: {
              display: 'any1',
              isDefined: true,
              usage: [[5, 2, 4]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          image: {
            type: 'v',
            name: 'image',
            pos: [5, 9, 5],
            meta: {
              display: 'image',
              isDefined: false,
              usage: [[5, 9, 5]],
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
