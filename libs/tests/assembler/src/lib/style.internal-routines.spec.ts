import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Style internal routines`, () => {
  it(`[auto generated] match`, async () => {
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
        info: 'Unused variable "p"',
        start: [10, 0, 1],
        end: [10, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [12, 0, 1],
        end: [12, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "o"',
        start: [14, 0, 1],
        end: [14, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "s"',
        start: [16, 0, 1],
        end: [16, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] pascal`, async () => {
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
      style: { routines: 'pascal' },
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
        `Print`,
        `Openr`,
        ``,
        `p = Plot()`,
        ``,
        `r = ENVIRaster()`,
        ``,
        `o = IDLnetUrl()`,
        ``,
        `s = IDLffShape()`,
        ``,
        `!null = Strtok('something')`,
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
        code: 104,
        info: 'Unused variable "p"',
        start: [10, 0, 1],
        end: [10, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [12, 0, 1],
        end: [12, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "o"',
        start: [14, 0, 1],
        end: [14, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "s"',
        start: [16, 0, 1],
        end: [16, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] camel`, async () => {
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
      style: { routines: 'camel' },
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
        `  return`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `print`,
        `openr`,
        ``,
        `p = plot()`,
        ``,
        `r = enviRaster()`,
        ``,
        `o = idlNetUrl()`,
        ``,
        `s = idlFfShape()`,
        ``,
        `!null = strtok('something')`,
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
        code: 104,
        info: 'Unused variable "p"',
        start: [10, 0, 1],
        end: [10, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [12, 0, 1],
        end: [12, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "o"',
        start: [14, 0, 1],
        end: [14, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "s"',
        start: [16, 0, 1],
        end: [16, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] upper`, async () => {
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
      style: { routines: 'upper' },
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
        `  RETURN`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `PRINT`,
        `OPENR`,
        ``,
        `p = PLOT()`,
        ``,
        `r = ENVIRASTER()`,
        ``,
        `o = IDLNETURL()`,
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
        info: 'Unused variable "p"',
        start: [10, 0, 1],
        end: [10, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [12, 0, 1],
        end: [12, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "o"',
        start: [14, 0, 1],
        end: [14, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "s"',
        start: [16, 0, 1],
        end: [16, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] lower`, async () => {
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
      style: { routines: 'lower' },
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
        `  return`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `print`,
        `openr`,
        ``,
        `p = plot()`,
        ``,
        `r = enviraster()`,
        ``,
        `o = idlneturl()`,
        ``,
        `s = idlffshape()`,
        ``,
        `!null = strtok('something')`,
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
        code: 104,
        info: 'Unused variable "p"',
        start: [10, 0, 1],
        end: [10, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [12, 0, 1],
        end: [12, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "o"',
        start: [14, 0, 1],
        end: [14, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "s"',
        start: [16, 0, 1],
        end: [16, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] none`, async () => {
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
        info: 'Unused variable "p"',
        start: [10, 0, 1],
        end: [10, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "r"',
        start: [12, 0, 1],
        end: [12, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "o"',
        start: [14, 0, 1],
        end: [14, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "s"',
        start: [16, 0, 1],
        end: [16, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
