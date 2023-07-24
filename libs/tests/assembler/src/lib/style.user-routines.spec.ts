import { Assembler } from '@idl/assembler';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Style user routines`, () => {
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
      `pro test_things`,
      `  compile_opt idl2`,
      `end`,
      ``,
      `function test_THINGS`,
      `  compile_opt idl2`,
      `  return, 42`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `TEST_THINGS`,
      `!null = test_things()`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('my_file.pro', code, {
      postProcess: true,
    });

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, {
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
        `pro test_things`,
        `  compile_opt idl2`,
        `end`,
        ``,
        `function test_THINGS`,
        `  compile_opt idl2`,
        `  return, 42`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `test_things`,
        `!null = test_THINGS()`,
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
    const expectedProblems: SyntaxProblems = [];

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
      `pro test_things`,
      `  compile_opt idl2`,
      `end`,
      ``,
      `function test_THINGS`,
      `  compile_opt idl2`,
      `  return, 42`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `TEST_THINGS`,
      `!null = test_things()`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('my_file.pro', code, {
      postProcess: true,
    });

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, {
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
        `pro test_things`,
        `  compile_opt idl2`,
        `end`,
        ``,
        `function test_THINGS`,
        `  compile_opt idl2`,
        `  return, 42`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `TEST_THINGS`,
        `!null = test_things()`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
