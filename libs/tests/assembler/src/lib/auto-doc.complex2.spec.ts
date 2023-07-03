import { Assembler } from '@idl/assembler';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify complex formatting`, () => {
  it(`[auto generated] moves things correctly`, async () => {
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
      `; TODO: something`,
      `pro test_things, a, b, c`,
      `  compile_opt idl2`,
      `end`,
      ``,
      `;+`,
      `;-`,
      `pro test_things2`,
      `  compile_opt idl2`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('my_file.pro', code, true);

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, {
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `; TODO: something`,
        `;+`,
        `; :Arguments:`,
        `;   a: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   b: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   c: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `pro test_things, a, b, c`,
        `  compile_opt idl2`,
        `end`,
        ``,
        `;+`,
        `;-`,
        `pro test_things2`,
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
      { code: 6, info: 'TODO: something', start: [0, 0, 17], end: [0, 0, 17] },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [11, 17, 1],
        end: [11, 17, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [11, 20, 1],
        end: [11, 20, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [11, 23, 1],
        end: [11, 23, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
