import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify single quote parsing`, () => {
  it(`[auto generated] convert single to double quote`, async () => {
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
      `  compile_opt idl2`,
      ``,
      `  ; single quote`,
      `  a = 'something'`,
      ``,
      `  ; double quote with single quote`,
      `  a = '"'`,
      ``,
      `  ; escaped single quote`,
      `  a = 'escaped''formatting'`,
      ``,
      `  ; number strings`,
      `  a = '010101'b`,
      `  a = "010101"b`,
      ``,
      `  ; special escaped double quote`,
      `  a = """string"""`,
      ``,
      `  ; special escaped single quote`,
      `  a = '''string'''`,
      ``,
      `  ; special double quote with singles`,
      `  a = "'string'"`,
      ``,
      `  ; special single quote with doubles`,
      `  a = '"string"'`,
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
      style: { quotes: 'double' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        ``,
        `; single quote`,
        `a = "something"`,
        ``,
        `; double quote with single quote`,
        `a = """"`,
        ``,
        `; escaped single quote`,
        `a = "escaped'formatting"`,
        ``,
        `; number strings`,
        `a = "010101"b`,
        `a = "010101"b`,
        ``,
        `; special escaped double quote`,
        `a = """string"""`,
        ``,
        `; special escaped single quote`,
        `a = "'string'"`,
        ``,
        `; special double quote with singles`,
        `a = "'string'"`,
        ``,
        `; special single quote with doubles`,
        `a = """string"""`,
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

  it(`[auto generated] keep formatting when single quotes is preference`, async () => {
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
      `  compile_opt idl2`,
      ``,
      `  ; single quote`,
      `  a = 'something'`,
      ``,
      `  ; double quote with single quote`,
      `  a = "'"`,
      ``,
      `  ; escaped single quote`,
      `  a = 'escaped''formatting'`,
      ``,
      `  ; number strings`,
      `  a = '010101'b`,
      `  a = "010101"b`,
      ``,
      `  ; special escaped double quote`,
      `  a = """string"""`,
      ``,
      `  ; special escaped single quote`,
      `  a = '''string'''`,
      ``,
      `  ; special double quote with singles`,
      `  a = "'string'"`,
      ``,
      `  ; special single quote with doubles`,
      `  a = '"string"'`,
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
      style: { quotes: 'single' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        ``,
        `; single quote`,
        `a = 'something'`,
        ``,
        `; double quote with single quote`,
        `a = ''''`,
        ``,
        `; escaped single quote`,
        `a = 'escaped''formatting'`,
        ``,
        `; number strings`,
        `a = '010101'b`,
        `a = '010101'b`,
        ``,
        `; special escaped double quote`,
        `a = '"string"'`,
        ``,
        `; special escaped single quote`,
        `a = '''string'''`,
        ``,
        `; special double quote with singles`,
        `a = '''string'''`,
        ``,
        `; special single quote with doubles`,
        `a = '"string"'`,
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
});
