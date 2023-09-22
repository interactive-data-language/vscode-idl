import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify variable styling`, () => {
  it(`[auto generated] in procedures with modern formatting`, async () => {
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
      `pro test_things, a, someTHING, c, KW1 = kw11`,
      `  compile_opt idl2`,
      `  A = something + C + keyword_set(KW11)`,
      `  taSK = ENVITask('Something')`,
      `  TASK = !null`,
      `  !null = enVi.openRaster()`,
      `  !null = enviTask.parameter()`,
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
      style: { localVariables: 'match' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro test_things, a, someTHING, c, kw1 = kw11`,
        `  compile_opt idl2`,
        `  a = someTHING + c + keyword_set(kw11)`,
        `  taSK = ENVITask('Something')`,
        `  taSK = !null`,
        `  !null = ENVI.openRaster()`,
        `  !null = ENVITask.parameter()`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] in procedures with no formatting`, async () => {
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
      `pro test_things, a, someTHING, c, KW1 = kw11`,
      `  compile_opt idl2`,
      `  A = something + C + keyword_set(KW11)`,
      `  taSK = ENVITask('Something')`,
      `  TASK = !null`,
      `  !null = enVi.openRaster()`,
      `  !null = enviTask.parameter()`,
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
      style: { localVariables: 'none' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro test_things, a, someTHING, c, kw1 = kw11`,
        `  compile_opt idl2`,
        `  A = something + C + keyword_set(KW11)`,
        `  taSK = ENVITask('Something')`,
        `  TASK = !null`,
        `  !null = enVi.openRaster()`,
        `  !null = enviTask.parameter()`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] in functions with modern formatting`, async () => {
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
      `function test_things, a, someTHING, c, KW1 = kw11`,
      `  compile_opt idl2`,
      `  A = something + C + keyword_set(KW11)`,
      `  taSK = ENVITask('Something')`,
      `  TASK = !null`,
      `  !null = enVi.openRaster()`,
      `  !null = enviTask.parameter()`,
      `  return, task`,
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
      style: { localVariables: 'match' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function test_things, a, someTHING, c, kw1 = kw11`,
        `  compile_opt idl2`,
        `  a = someTHING + c + keyword_set(kw11)`,
        `  taSK = ENVITask('Something')`,
        `  taSK = !null`,
        `  !null = ENVI.openRaster()`,
        `  !null = ENVITask.parameter()`,
        `  return, taSK`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] in functions with no formatting`, async () => {
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
      `function test_things, a, someTHING, c, KW1 = kw11`,
      `  compile_opt idl2`,
      `  A = something + C + keyword_set(KW11)`,
      `  taSK = ENVITask('Something')`,
      `  TASK = !null`,
      `  !null = enVi.openRaster()`,
      `  !null = enviTask.parameter()`,
      `  return, task`,
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
      style: { localVariables: 'none' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function test_things, a, someTHING, c, kw1 = kw11`,
        `  compile_opt idl2`,
        `  A = something + C + keyword_set(KW11)`,
        `  taSK = ENVITask('Something')`,
        `  TASK = !null`,
        `  !null = enVi.openRaster()`,
        `  !null = enviTask.parameter()`,
        `  return, task`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] in main level with modern formatting`, async () => {
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
      `compile_opt idl2`,
      `A = something + C + keyword_set(KW11)`,
      `taSK = ENVITask('Something')`,
      `TASK = !null`,
      `!null = enVi.openRaster()`,
      `!null = enviTask.parameter()`,
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
      style: { localVariables: 'match' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `A = something + C + keyword_set(KW11)`,
        `taSK = ENVITask('Something')`,
        `taSK = !null`,
        `!null = ENVI.openRaster()`,
        `!null = ENVITask.parameter()`,
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
        info: 'Undefined variable "something"',
        start: [1, 4, 9],
        end: [1, 4, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "C"',
        start: [1, 16, 1],
        end: [1, 16, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "KW11"',
        start: [1, 32, 4],
        end: [1, 32, 4],
      },
      {
        code: 104,
        info: 'Unused variable "A"',
        start: [1, 0, 1],
        end: [1, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] in main level with no formatting`, async () => {
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
      `compile_opt idl2`,
      `A = something + C + keyword_set(KW11)`,
      `taSK = ENVITask('Something')`,
      `TASK = !null`,
      `!null = enVi.openRaster()`,
      `!null = enviTask.parameter()`,
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
      style: { localVariables: 'none' },
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `A = something + C + keyword_set(KW11)`,
        `taSK = ENVITask('Something')`,
        `TASK = !null`,
        `!null = enVi.openRaster()`,
        `!null = enviTask.parameter()`,
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
        info: 'Undefined variable "something"',
        start: [1, 4, 9],
        end: [1, 4, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "C"',
        start: [1, 16, 1],
        end: [1, 16, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "KW11"',
        start: [1, 32, 4],
        end: [1, 32, 4],
      },
      {
        code: 104,
        info: 'Unused variable "A"',
        start: [1, 0, 1],
        end: [1, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
