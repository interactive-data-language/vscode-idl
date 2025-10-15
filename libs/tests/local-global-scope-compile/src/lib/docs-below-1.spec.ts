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
              canReset: false,
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
              canReset: false,
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
              canReset: false,
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
              canReset: true,
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
        range: { start: [0, 0, 4], end: [19, 0, 3] },
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
              canReset: false,
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
              canReset: false,
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
              canReset: false,
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
              canReset: true,
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
        range: { start: [0, 0, 9], end: [20, 0, 3] },
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

  it(`[auto generated] honor docs before`, async () => {
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
      `;   arg1: bidirectional, required, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg2: bidirectional, required, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg3: bidirectional, required, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: bidirectional, required, ENVIRaster`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `; :Keywords:`,
      `;   KW1: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   KW2: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
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
            pos: [18, 42, 12],
            meta: {
              display: 'input_raster',
              isDefined: true,
              canReset: false,
              usage: [[18, 42, 12]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          output_raster_uri: {
            type: 'v',
            name: 'output_raster_uri',
            pos: [18, 76, 17],
            meta: {
              display: 'output_raster_uri',
              isDefined: true,
              canReset: false,
              usage: [[18, 76, 17]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          third: {
            type: 'v',
            name: 'third',
            pos: [18, 104, 5],
            meta: {
              display: 'third',
              isDefined: true,
              canReset: false,
              usage: [[18, 104, 5]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [32, 0, 1],
            meta: {
              display: 'e',
              isDefined: true,
              canReset: true,
              usage: [
                [32, 0, 1],
                [33, 4, 1],
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
        pos: [18, 9, 16],
        range: { start: [18, 0, 9], end: [38, 0, 3] },
        meta: {
          source: 'user',
          args: {
            arg1: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'arg1',
              code: false,
              pos: [2, 0, 38],
            },
            arg2: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'arg2',
              code: false,
              pos: [4, 0, 38],
            },
            arg3: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'arg3',
              code: false,
              pos: [6, 0, 38],
            },
            arg4: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
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
              req: true,
              display: 'arg4',
              code: false,
              pos: [8, 0, 45],
            },
          },
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = parse_docs_below(, , , , $\n, $\n, $\n  input_raster = value, $\n  output_raster_uri = value, $\n  third2 = value)\n```\n\n\n\n\n#### Arguments\n\n\n\n#### Keywords\n\n- **input_raster**: bidirectional, optional, any\n\n    \n\n- **output_raster_uri**: bidirectional, optional, any\n\n    \n\n- **third2**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: { default: '' },
          display: 'parse_docs_below',
          kws: {
            kw1: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'KW1',
              code: false,
              pos: [12, 0, 37],
            },
            kw2: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'KW2',
              code: false,
              pos: [14, 0, 37],
            },
            input_raster: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'input_raster',
              code: true,
              pos: [18, 27, 12],
            },
            output_raster_uri: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'output_raster_uri',
              code: true,
              pos: [18, 56, 17],
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
              pos: [18, 95, 6],
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

  it(`[auto generated] ignore docs that are not immediately on the next line`, async () => {
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
      ``,
      `PRO mypro_dated, arg1, arg2, arg3, arg4, KW1 = kw1, KW2 = kw2`,
      ``,
      `  ;+ reference to our super cool and awesome plot`,
      `  a = plot(/TEST)`,
      ``,
      `END`,
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
        mypro_dated: {
          kw1: {
            type: 'v',
            name: 'kw1',
            pos: [1, 47, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              canReset: false,
              usage: [[1, 47, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          kw2: {
            type: 'v',
            name: 'kw2',
            pos: [1, 58, 3],
            meta: {
              display: 'kw2',
              isDefined: true,
              canReset: false,
              usage: [[1, 58, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg1: {
            type: 'v',
            name: 'arg1',
            pos: [1, 17, 4],
            meta: {
              display: 'arg1',
              isDefined: true,
              canReset: false,
              usage: [[1, 17, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg2: {
            type: 'v',
            name: 'arg2',
            pos: [1, 23, 4],
            meta: {
              display: 'arg2',
              isDefined: true,
              canReset: false,
              usage: [[1, 23, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg3: {
            type: 'v',
            name: 'arg3',
            pos: [1, 29, 4],
            meta: {
              display: 'arg3',
              isDefined: true,
              canReset: false,
              usage: [[1, 29, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg4: {
            type: 'v',
            name: 'arg4',
            pos: [1, 35, 4],
            meta: {
              display: 'arg4',
              isDefined: true,
              canReset: false,
              usage: [[1, 35, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [4, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              canReset: true,
              usage: [[4, 2, 1]],
              docs: 'reference to our super cool and awesome plot',
              source: 'user',
              type: [{ name: 'Plot', display: 'Plot', args: [], meta: {} }],
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
        name: 'mypro_dated',
        pos: [1, 4, 11],
        range: { start: [1, 0, 4], end: [6, 0, 3] },
        meta: {
          source: 'user',
          args: {
            arg1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg1',
              code: true,
              pos: [1, 17, 4],
            },
            arg2: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg2',
              code: true,
              pos: [1, 23, 4],
            },
            arg3: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg3',
              code: true,
              pos: [1, 29, 4],
            },
            arg4: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg4',
              code: true,
              pos: [1, 35, 4],
            },
          },
          docs: '\n```idl\nmypro_dated, arg1, arg2, arg3, arg4, $\n  KW1 = value, $\n  KW2 = value\n```\n\n\n#### Arguments\n\n- **arg1**: bidirectional, required, any\n\n  \n\n- **arg2**: bidirectional, required, any\n\n  \n\n- **arg3**: bidirectional, required, any\n\n  \n\n- **arg4**: bidirectional, required, any\n\n  \n\n\n\n#### Keywords\n\n- **KW1**: bidirectional, optional, any\n\n    \n\n- **KW2**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: {},
          display: 'mypro_dated',
          kws: {
            kw1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'KW1',
              code: true,
              pos: [1, 41, 3],
            },
            kw2: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'KW2',
              code: true,
              pos: [1, 52, 3],
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
      pro: { mypro_dated: [] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
