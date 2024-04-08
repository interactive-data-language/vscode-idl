import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify fast parsing handles comments and line continuations`, () => {
  it(`[auto generated] to fix problem`, async () => {
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
      `; :MyStruct:`,
      `;   prop: Long`,
      `;     Placeholder docs for argument or keyword`,
      `;   prop2: ENVIRaster`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro atVectorizeDifferenceImage, $`,
      `  difference_raster = difference_raster, $`,
      `  decrease_vector = decrease_vector, $ ; hack around ENVI not handling optional vectors and paired parameters the way we need`,
      `  output_decrease_vector_uri = output_decrease_vector_uri, $`,
      `  increase_vector = increase_vector, $ ; hack around ENVI not handling optional vectors and paired parameters the way we need`,
      `  output_increase_vector_uri = output_increase_vector_uri`,
      `  compile_opt idl2`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true, full: false }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: {
        atvectorizedifferenceimage: {
          difference_raster: {
            type: 'v',
            name: 'difference_raster',
            pos: [9, 22, 17],
            meta: {
              display: 'difference_raster',
              isDefined: true,
              usage: [[9, 22, 17]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          decrease_vector: {
            type: 'v',
            name: 'decrease_vector',
            pos: [10, 20, 15],
            meta: {
              display: 'decrease_vector',
              isDefined: true,
              usage: [[10, 20, 15]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          output_decrease_vector_uri: {
            type: 'v',
            name: 'output_decrease_vector_uri',
            pos: [11, 31, 26],
            meta: {
              display: 'output_decrease_vector_uri',
              isDefined: true,
              usage: [[11, 31, 26]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          increase_vector: {
            type: 'v',
            name: 'increase_vector',
            pos: [12, 20, 15],
            meta: {
              display: 'increase_vector',
              isDefined: true,
              usage: [[12, 20, 15]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          output_increase_vector_uri: {
            type: 'v',
            name: 'output_increase_vector_uri',
            pos: [13, 31, 26],
            meta: {
              display: 'output_increase_vector_uri',
              isDefined: true,
              usage: [[13, 31, 26]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
        name: 'atvectorizedifferenceimage',
        pos: [8, 4, 26],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\natVectorizeDifferenceImage, $\n  difference_raster = value, $\n  decrease_vector = value, $\n  output_decrease_vector_uri = value, $\n  increase_vector = value, $\n  output_increase_vector_uri = value\n```\n\n\n\n\n#### Keywords\n\n- **difference_raster**: bidirectional, optional, any\n\n    \n\n- **decrease_vector**: bidirectional, optional, any\n\n    \n\n- **output_decrease_vector_uri**: bidirectional, optional, any\n\n    \n\n- **increase_vector**: bidirectional, optional, any\n\n    \n\n- **output_increase_vector_uri**: bidirectional, optional, any\n\n    \n\n\n\n### Mystruct\n\nprop: Long\n  Placeholder docs for argument or keyword\nprop2: ENVIRaster\n  Placeholder docs for argument or keyword',
          docsLookup: {
            default: '',
            mystruct:
              'prop: Long\n  Placeholder docs for argument or keyword\nprop2: ENVIRaster\n  Placeholder docs for argument or keyword',
          },
          display: 'atVectorizeDifferenceImage',
          kws: {
            difference_raster: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'difference_raster',
              code: true,
              pos: [9, 2, 17],
            },
            decrease_vector: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'decrease_vector',
              code: true,
              pos: [10, 2, 15],
            },
            output_decrease_vector_uri: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'output_decrease_vector_uri',
              code: true,
              pos: [11, 2, 26],
            },
            increase_vector: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'increase_vector',
              code: true,
              pos: [12, 2, 15],
            },
            output_increase_vector_uri: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'output_increase_vector_uri',
              code: true,
              pos: [13, 2, 26],
            },
          },
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
      pro: { atvectorizedifferenceimage: [] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
