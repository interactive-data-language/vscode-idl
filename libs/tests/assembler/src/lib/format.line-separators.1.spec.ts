import { Assembler } from '@idl/assembler';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Line separator formatting`, () => {
  it(`[auto generated] always remove line separators, never allow them`, async () => {
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
      ``,
      `compile_opt idl2`,
      ``,
      `if !true then begin & a = b & b = c & c = d & endif`,
      ``,
      `end`,
      ``,
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
        `if !true then begin`,
        `  a = b`,
        `  b = c`,
        `  c = d`,
        `endif`,
        ``,
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
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [4, 26, 1],
        end: [4, 26, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [4, 34, 1],
        end: [4, 34, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [4, 42, 1],
        end: [4, 42, 1],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [4, 22, 1],
        end: [4, 22, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
