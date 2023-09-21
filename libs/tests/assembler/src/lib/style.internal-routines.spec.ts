import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Style internal routines`, () => {
  it(`[auto generated] using modern format`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  Return`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `PRINT`,
      `Openr`,
      ``,
      `p = PLOT()`,
      ``,
      `r = enviraster()`,
      ``,
      `o = idlneturl()`,
      ``,
      `s = IDLFFSHAPE()`,
      ``,
      `!null = STRTOK('something')`,
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
      formatter: 'fiddle',
      style: { routines: 'match' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro mypro`,
        `  compile_opt idl2`,
        `  Return`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `print`,
        `openr`,
        ``,
        `p = plot()`,
        ``,
        `r = ENVIRaster()`,
        ``,
        `o = IDLnetURL()`,
        ``,
        `s = IDLffShape()`,
        ``,
        `!null = STRTOK('something')`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode('my_file.pro', formatted, {
        postProcess: true,
      });

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "p"',
        start: [10, 0, 1],
        end: [10, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [12, 0, 1],
        end: [12, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "o"',
        start: [14, 0, 1],
        end: [14, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "s"',
        start: [16, 0, 1],
        end: [16, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] using no format`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  Return`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `PRINT`,
      `Openr`,
      ``,
      `p = PLOT()`,
      ``,
      `r = enviraster()`,
      ``,
      `o = idlneturl()`,
      ``,
      `s = IDLFFSHAPE()`,
      ``,
      `!null = STRTOK('something')`,
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
      formatter: 'fiddle',
      style: { routines: 'none' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro mypro`,
        `  compile_opt idl2`,
        `  Return`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `PRINT`,
        `Openr`,
        ``,
        `p = PLOT()`,
        ``,
        `r = enviraster()`,
        ``,
        `o = idlneturl()`,
        ``,
        `s = IDLFFSHAPE()`,
        ``,
        `!null = STRTOK('something')`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode('my_file.pro', formatted, {
        postProcess: true,
      });

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "p"',
        start: [10, 0, 1],
        end: [10, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [12, 0, 1],
        end: [12, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "o"',
        start: [14, 0, 1],
        end: [14, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "s"',
        start: [16, 0, 1],
        end: [16, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
