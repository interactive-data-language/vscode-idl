import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we do not format when we have bad syntax errors`, () => {
  it(`[auto generated] like reserved variables for procedure defs`, async () => {
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
      `function test`,
      `  compile_opt idl2`,
      `  foreach a, [1, 2, 3] do begin`,
      `    print, a`,
      `  end`,
      ``,
      ``,
      `  pro test`,
      `  compile_opt idl2`,
      `  test`,
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
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 12,
        info: '"pro" is a reserved name used for control statements. If you see this, make sure you don\'t have a syntax error in your code.',
        start: [8, 2, 3],
        end: [8, 2, 3],
        canReport: true,
      },
      {
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [2, 2, 11],
        end: [2, 18, 0],
        canReport: true,
      },
      {
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [9, 2, 11],
        end: [9, 18, 0],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [8, 2, 3],
        end: [8, 2, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "pro"',
        start: [8, 2, 3],
        end: [8, 2, 3],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] like reserved variables for function defs`, async () => {
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
      `function test`,
      `  compile_opt idl2`,
      `  foreach a, [1, 2, 3] do begin`,
      `    print, a`,
      `  end`,
      ``,
      ``,
      `  function test`,
      `  compile_opt idl2`,
      `  test`,
      `  return, 1`,
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
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 12,
        info: '"function" is a reserved name used for control statements. If you see this, make sure you don\'t have a syntax error in your code.',
        start: [8, 2, 8],
        end: [8, 2, 8],
        canReport: true,
      },
      {
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [2, 2, 11],
        end: [2, 18, 0],
        canReport: true,
      },
      {
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [9, 2, 11],
        end: [9, 18, 0],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [8, 2, 8],
        end: [8, 2, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "function"',
        start: [8, 2, 8],
        end: [8, 2, 8],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
