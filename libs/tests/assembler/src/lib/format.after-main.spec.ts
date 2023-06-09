import { Assembler } from '@idl/assembler';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Keep tokens after main level programs`, () => {
  it(`[auto generated] example 1`, async () => {
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
      ``,
      `a = 5`,
      `end`,
      `; comment`,
      `b = 17`,
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
        `compile_opt idl2`,
        ``,
        `a = 5`,
        `end`,
        `; comment`,
        `b = 17`,
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
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [5, 0, 1],
        end: [5, 0, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [5, 2, 1],
        end: [5, 2, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [5, 4, 2],
        end: [5, 4, 2],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [5, 6, 0],
        end: [5, 6, 0],
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [5, 0, 1],
        end: [5, 0, 1],
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
