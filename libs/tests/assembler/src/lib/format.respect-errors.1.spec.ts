import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we do not format when we have bad syntax errors`, () => {
  it(`[auto generated] unclosed tokens are ignored`, async () => {
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
      `pro mypro,   arg1, arg2, arg3,  KW1=kw1,$ ; commment`,
      `KW2 = kw2, KW3 = kw3     `,
      `     compile_opt idl2    `,
      `        `,
      `  a = myfunc(`,
      `end     `,
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

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 0,
        info: 'Statement is not closed as expected',
        start: [4, 6, 7],
        end: [4, 6, 7],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [0, 36, 3],
        end: [0, 36, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [1, 6, 3],
        end: [1, 6, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw3"',
        start: [1, 17, 3],
        end: [1, 17, 3],
      },
      {
        code: 104,
        info: 'Unused variable "arg1"',
        start: [0, 13, 4],
        end: [0, 13, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [0, 19, 4],
        end: [0, 19, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg3"',
        start: [0, 25, 4],
        end: [0, 25, 4],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [4, 2, 1],
        end: [4, 2, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] unclosed main level is ignored`, async () => {
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
    const code = [`     compile_opt idl2    `, `        `, `a = 5     `];

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
      const expectedFormatting: string[] = [`compile_opt idl2`, ``, `a = 5`];

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
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [2, 0, 1.7976931348623157e308],
        end: [2, 0, 1.7976931348623157e308],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
