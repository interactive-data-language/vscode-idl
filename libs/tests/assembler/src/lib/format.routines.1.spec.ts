import { Assembler } from '@idl/assembler';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we format routines`, () => {
  it(`[auto generated] formats basic routine`, async () => {
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
      `KW2 = kw2, KW3 = kw3`,
      `     compile_opt idl2`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('my_file.pro', code, true);

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro mypro, arg1, arg2, arg3, kw1 = kw1, $ ; commment`,
        `  kw2 = kw2, kw3 = kw3`,
        `  compile_opt idl2`,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        true
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
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
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] formats basic method`, async () => {
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
      `function myclass::mymethod,   arg1, arg2, arg3,  KW1=kw1,$ ; commment`,
      `KW2 = kw2, KW3 = kw3`,
      `     compile_opt idl2`,
      `return,          1`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('my_file.pro', code, true);

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::mymethod, arg1, arg2, arg3, kw1 = kw1, $ ; commment`,
        `  kw2 = kw2, kw3 = kw3`,
        `  compile_opt idl2`,
        `  return, 1`,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        true
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [0, 53, 3],
        end: [0, 53, 3],
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
        start: [0, 30, 4],
        end: [0, 30, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [0, 36, 4],
        end: [0, 36, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg3"',
        start: [0, 42, 4],
        end: [0, 42, 4],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
