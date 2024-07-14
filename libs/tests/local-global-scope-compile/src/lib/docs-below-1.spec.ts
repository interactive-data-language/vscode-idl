import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Extract docs below routines`, () => {
  it(`[auto generated] for procedure`, async () => {
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
      `pro parse_docs_below, input_raster = input_raster, output_raster_uri = output_raster_uri, third2 = third`,
      `;+`,
      `; :Keywords:`,
      `;   input_raster: in, optional, ENVIRaster`,
      `;     Thing 1`,
      `;   output_raster_uri: in, optional, String`,
      `;     Thing 2`,
      `;   third: bidirectional, optional, any`,
      `;     Thing 3`,
      `;`,
      `;-  `,
      `compile_opt idl2`,
      ``,
      `; get the current session of ENVI`,
      `e = envi(/current)`,
      `if (e eq !null) then begin`,
      `  message, 'ENVI has not started yet, required!'`,
      `endif`,
      `idltasktest, input_raster = 5`,
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
        parse_docs_below: {
          input_raster: {
            type: 'v',
            name: 'input_raster',
            pos: [0, 37, 12],
            meta: {
              display: 'input_raster',
              isDefined: true,
              usage: [[0, 37, 12]],
              docs: 'Thing 1',
              source: 'user',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          output_raster_uri: {
            type: 'v',
            name: 'output_raster_uri',
            pos: [0, 71, 17],
            meta: {
              display: 'output_raster_uri',
              isDefined: true,
              usage: [[0, 71, 17]],
              docs: 'Thing 2',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          third: {
            type: 'v',
            name: 'third',
            pos: [0, 99, 5],
            meta: {
              display: 'third',
              isDefined: true,
              usage: [[0, 99, 5]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [14, 0, 1],
            meta: {
              display: 'e',
              isDefined: true,
              usage: [
                [14, 0, 1],
                [15, 4, 1],
              ],
              docs: '',
              source: 'user',
              type: [{ name: 'ENVI', display: 'ENVI', args: [], meta: {} }],
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
        name: 'parse_docs_below',
        pos: [0, 4, 16],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nparse_docs_below, $\n  input_raster = value, $\n  output_raster_uri = value, $\n, $\n  third2 = value\n```\n\n\n\n\n#### Keywords\n\n- **input_raster**: in, optional, ENVIRaster\n\n    Thing 1\n\n- **output_raster_uri**: in, optional, String\n\n    Thing 2\n\n- **third2**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: { default: '' },
          display: 'parse_docs_below',
          kws: {
            input_raster: {
              docs: 'Thing 1',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: false,
              display: 'input_raster',
              code: true,
              pos: [0, 22, 12],
            },
            output_raster_uri: {
              docs: 'Thing 2',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'output_raster_uri',
              code: true,
              pos: [0, 51, 17],
            },
            third: {
              docs: 'Thing 3',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'third',
              code: false,
              pos: [7, 0, 39],
            },
            third2: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'third2',
              code: true,
              pos: [0, 90, 6],
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
      pro: { parse_docs_below: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] for function`, async () => {
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
      `function parse_docs_below, input_raster = input_raster, output_raster_uri = output_raster_uri, third2 = third`,
      `;+`,
      `; :Keywords:`,
      `;   input_raster: in, optional, ENVIRaster`,
      `;     Thing 1`,
      `;   output_raster_uri: in, optional, String`,
      `;     Thing 2`,
      `;   third: bidirectional, optional, any`,
      `;     Thing 3`,
      `;`,
      `;-  `,
      `compile_opt idl2`,
      ``,
      `; get the current session of ENVI`,
      `e = envi(/current)`,
      `if (e eq !null) then begin`,
      `  message, 'ENVI has not started yet, required!'`,
      `endif`,
      `idltasktest, input_raster = 5`,
      `return, 1`,
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
      func: {
        parse_docs_below: {
          input_raster: {
            type: 'v',
            name: 'input_raster',
            pos: [0, 42, 12],
            meta: {
              display: 'input_raster',
              isDefined: true,
              usage: [[0, 42, 12]],
              docs: 'Thing 1',
              source: 'user',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          output_raster_uri: {
            type: 'v',
            name: 'output_raster_uri',
            pos: [0, 76, 17],
            meta: {
              display: 'output_raster_uri',
              isDefined: true,
              usage: [[0, 76, 17]],
              docs: 'Thing 2',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          third: {
            type: 'v',
            name: 'third',
            pos: [0, 104, 5],
            meta: {
              display: 'third',
              isDefined: true,
              usage: [[0, 104, 5]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [14, 0, 1],
            meta: {
              display: 'e',
              isDefined: true,
              usage: [
                [14, 0, 1],
                [15, 4, 1],
              ],
              docs: '',
              source: 'user',
              type: [{ name: 'ENVI', display: 'ENVI', args: [], meta: {} }],
            },
          },
        },
      },
      pro: {},
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'f',
        name: 'parse_docs_below',
        pos: [0, 9, 16],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = parse_docs_below( $\n  input_raster = value $\n  output_raster_uri = value $\n $\n  third2 = value)\n```\n\n\n\n\n#### Keywords\n\n- **input_raster**: in, optional, ENVIRaster\n\n    Thing 1\n\n- **output_raster_uri**: in, optional, String\n\n    Thing 2\n\n- **third2**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: { default: '' },
          display: 'parse_docs_below',
          kws: {
            input_raster: {
              docs: 'Thing 1',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: false,
              display: 'input_raster',
              code: true,
              pos: [0, 27, 12],
            },
            output_raster_uri: {
              docs: 'Thing 2',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'output_raster_uri',
              code: true,
              pos: [0, 56, 17],
            },
            third: {
              docs: 'Thing 3',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'third',
              code: false,
              pos: [7, 0, 39],
            },
            third2: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'third2',
              code: true,
              pos: [0, 95, 6],
            },
          },
          private: false,
          returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { parse_docs_below: ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
