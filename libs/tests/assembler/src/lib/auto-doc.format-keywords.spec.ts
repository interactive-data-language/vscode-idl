import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Apply keyword formatting`, () => {
  it(`[auto generated] so docs match code style`, async () => {
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
      `; :Description:`,
      `;   My sample procedure with default "modern" formatting`,
      `;`,
      `; :Arguments:`,
      `;   arg1: in, required, Boolean`,
      `;     My favorite argument`,
      `;   arg2: in, optional, Boolean`,
      `;     My second favorite argument`,
      `;`,
      `; :Keywords:`,
      `;   KW1: in, required, Boolean`,
      `;     My favorite keyword`,
      `;   KW2: in, optional, Boolean`,
      `;     My second favorite keyword`,
      `;`,
      `;-`,
      `pro mypro_modern, arg1, arg2, kw1 = kw1, kw2 = kw2`,
      `  compile_opt idl2, hidden`,
      ``,
      `  ;+ reference to our super cool and awesome plot`,
      `  a = plot(/test)`,
      ``,
      `  ; sample if statement`,
      `  if !true then begin`,
      `    print, 42`,
      `  endif else begin`,
      `    print, 84`,
      `  endelse`,
      ``,
      `  ; sample for loop`,
      `  foreach val, var, key do begin`,
      ``,
      `  endforeach`,
      ``,
      `  ; sample ENVI routine`,
      `  e = envi()`,
      `  r = ENVIRaster(metadata = meta) ; formatting matches docs`,
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
      style: { keywords: 'lower' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Description:`,
        `;   My sample procedure with default "modern" formatting`,
        `;`,
        `; :Arguments:`,
        `;   arg1: in, required, Boolean`,
        `;     My favorite argument`,
        `;   arg2: in, optional, Boolean`,
        `;     My second favorite argument`,
        `;`,
        `; :Keywords:`,
        `;   kw1: in, required, Boolean`,
        `;     My favorite keyword`,
        `;   kw2: in, optional, Boolean`,
        `;     My second favorite keyword`,
        `;`,
        `;-`,
        `pro mypro_modern, arg1, arg2, kw1 = kw1, kw2 = kw2`,
        `  compile_opt idl2, hidden`,
        ``,
        `  ;+ reference to our super cool and awesome plot`,
        `  a = plot(/test)`,
        ``,
        `  ; sample if statement`,
        `  if !true then begin`,
        `    print, 42`,
        `  endif else begin`,
        `    print, 84`,
        `  endelse`,
        ``,
        `  ; sample for loop`,
        `  foreach val, var, key do begin`,
        ``,
        `  endforeach`,
        ``,
        `  ; sample ENVI routine`,
        `  e = envi()`,
        `  r = ENVIRaster(metadata = meta) ; formatting matches docs`,
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
        code: 99,
        info: 'Undefined variable "var"',
        start: [31, 15, 3],
        end: [31, 15, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "meta"',
        start: [37, 28, 4],
        end: [37, 28, 4],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [17, 36, 3],
        end: [17, 36, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [17, 47, 3],
        end: [17, 47, 3],
      },
      {
        code: 104,
        info: 'Unused variable "arg1"',
        start: [17, 18, 4],
        end: [17, 18, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [17, 24, 4],
        end: [17, 24, 4],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [21, 2, 1],
        end: [21, 2, 1],
      },
      {
        code: 104,
        info: 'Unused variable "val"',
        start: [31, 10, 3],
        end: [31, 10, 3],
      },
      {
        code: 104,
        info: 'Unused variable "key"',
        start: [31, 20, 3],
        end: [31, 20, 3],
      },
      {
        code: 104,
        info: 'Unused variable "e"',
        start: [36, 2, 1],
        end: [36, 2, 1],
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [37, 2, 1],
        end: [37, 2, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
