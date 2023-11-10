import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Properly reports problems for docs`, () => {
  it(`[auto generated] when blocks are inside procedures`, async () => {
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
      `pro auto_doc_dont_add_above, input_raster = input_raster, output_raster_uri = output_raster_uri, third2 = third`,
      `;+`,
      `; :Keywords:`,
      `;   input_raster: in, optional, ENVIRaster`,
      `;     Thing 1`,
      `;   output_raster_uri: in, optional, String`,
      `;     Thing 2`,
      `;   third: bidirectional, optional, any`,
      `;     Thing 3`,
      `;`,
      `;-`,
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

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "third"',
        start: [7, 0, 39],
        end: [7, 0, 39],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "third2"',
        start: [0, 97, 6],
        end: [0, 97, 6],
      },
      {
        code: 104,
        info: 'Unused variable "input_raster"',
        start: [0, 44, 12],
        end: [0, 44, 12],
      },
      {
        code: 104,
        info: 'Unused variable "output_raster_uri"',
        start: [0, 78, 17],
        end: [0, 78, 17],
      },
      {
        code: 104,
        info: 'Unused variable "third"',
        start: [0, 106, 5],
        end: [0, 106, 5],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] when blocks are inside functions`, async () => {
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
      `function auto_doc_dont_add_above, input_raster = input_raster, output_raster_uri = output_raster_uri, third2 = third`,
      `;+`,
      `; :Keywords:`,
      `;   input_raster: in, optional, ENVIRaster`,
      `;     Thing 1`,
      `;   output_raster_uri: in, optional, String`,
      `;     Thing 2`,
      `;   third: bidirectional, optional, any`,
      `;     Thing 3`,
      `;`,
      `;-`,
      `compile_opt idl2`,
      ``,
      `; get the current session of ENVI`,
      `e = envi(/current)`,
      `if (e eq !null) then begin`,
      `  message, 'ENVI has not started yet, required!'`,
      `endif`,
      `idltasktest, input_raster = 5`,
      `rturn, 1`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "third"',
        start: [7, 0, 39],
        end: [7, 0, 39],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "third2"',
        start: [0, 102, 6],
        end: [0, 102, 6],
      },
      {
        code: 52,
        info: 'Expected a documentation tag for ":Returns:" since this is a function or function method',
        start: [1, 0, 2],
        end: [10, 0, 2],
      },
      {
        code: 104,
        info: 'Unused variable "input_raster"',
        start: [0, 49, 12],
        end: [0, 49, 12],
      },
      {
        code: 104,
        info: 'Unused variable "output_raster_uri"',
        start: [0, 83, 17],
        end: [0, 83, 17],
      },
      {
        code: 104,
        info: 'Unused variable "third"',
        start: [0, 111, 5],
        end: [0, 111, 5],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] when blocks are inside functions`, async () => {
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
      `; No problems for me!!! Im care free!!!`,
      `;-`,
      ``,
      ``,
      `function auto_doc_dont_add_above, input_raster = input_raster, output_raster_uri = output_raster_uri, third = third`,
      `;+`,
      `; :Keywords:`,
      `;   input_raster: in, optional, ENVIRaster`,
      `;     Thing 1`,
      `;   output_raster_uri: in, optional, String`,
      `;     Thing 2`,
      `;   third: bidirectional, optional, any`,
      `;     Thing 3`,
      `;`,
      `;-`,
      `compile_opt idl2`,
      ``,
      `; get the current session of ENVI`,
      `e = envi(/current)`,
      `if (e eq !null) then begin`,
      `  message, 'ENVI has not started yet, required!'`,
      `endif`,
      `idltasktest, input_raster = 5`,
      `rturn, 1`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 52,
        info: 'Expected a documentation tag for ":Returns:" since this is a function or function method',
        start: [6, 0, 2],
        end: [15, 0, 2],
      },
      {
        code: 104,
        info: 'Unused variable "input_raster"',
        start: [5, 49, 12],
        end: [5, 49, 12],
      },
      {
        code: 104,
        info: 'Unused variable "output_raster_uri"',
        start: [5, 83, 17],
        end: [5, 83, 17],
      },
      {
        code: 104,
        info: 'Unused variable "third"',
        start: [5, 110, 5],
        end: [5, 110, 5],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
