import { Assembler } from '@idl/assembler';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify type formatting uses display names`, () => {
  it(`[auto generated] matches arg definitions`, async () => {
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
      `;+`,
      `; :Arguments:`,
      `;   arg1: in, required, enviraster`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg2: in, required, idl_variable`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg3: in, required, plot`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro pro3, arg1, arg2, arg3`,
      `  compile_opt idl3`,
      ``,
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
        `;+`,
        `; :Arguments:`,
        `;   arg1: in, required, ENVIRaster`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   arg2: in, required, IDL_Variable`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   arg3: in, required, Plot`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `pro pro3, arg1, arg2, arg3`,
        `  compile_opt idl3`,
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
        info: 'Unused variable "arg1"',
        start: [10, 10, 4],
        end: [10, 10, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [10, 16, 4],
        end: [10, 16, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg3"',
        start: [10, 22, 4],
        end: [10, 22, 4],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
