import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify auto-doc when below`, () => {
  it(`[auto generated] does not add docs above`, async () => {
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
      `pro auto_doc_dont_add_above, input_raster = input_raster, output_raster_uri = output_raster_uri, third = third`,
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
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro auto_doc_dont_add_above, input_raster = input_raster, output_raster_uri = output_raster_uri, third = third`,
        `  ;+`,
        `  ; :Keywords:`,
        `  ;   input_raster: in, optional, ENVIRaster`,
        `  ;     Thing 1`,
        `  ;   output_raster_uri: in, optional, String`,
        `  ;     Thing 2`,
        `  ;   third: bidirectional, optional, any`,
        `  ;     Thing 3`,
        `  ;`,
        `  ;-`,
        `  compile_opt idl2`,
        ``,
        `  ; get the current session of ENVI`,
        `  e = envi(/current)`,
        `  if (e eq !null) then begin`,
        `    message, 'ENVI has not started yet, required!'`,
        `  endif`,
        `  idltasktest, input_raster = 5`,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
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
        start: [0, 105, 5],
        end: [0, 105, 5],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] updates comment blocks right`, async () => {
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
      ``,
      `; main level program`,
      `compile_opt idl2`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro auto_doc_dont_add_above, input_raster = input_raster, output_raster_uri = output_raster_uri, third2 = third`,
        `  ;+`,
        `  ; :Keywords:`,
        `  ;   input_raster: in, optional, ENVIRaster`,
        `  ;     Thing 1`,
        `  ;   output_raster_uri: in, optional, String`,
        `  ;     Thing 2`,
        `  ;   third2: bidirectional, optional, any`,
        `  ;     Placeholder docs for argument, keyword, or property`,
        `  ;   third: bidirectional, optional, any`,
        `  ;     Thing 3`,
        `  ;`,
        `  ;-`,
        `  compile_opt idl2`,
        ``,
        `  ; get the current session of ENVI`,
        `  e = envi(/current)`,
        `  if (e eq !null) then begin`,
        `    message, 'ENVI has not started yet, required!'`,
        `  endif`,
        `  idltasktest, input_raster = 5`,
        `end`,
        ``,
        `; main level program`,
        `compile_opt idl2`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
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

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
