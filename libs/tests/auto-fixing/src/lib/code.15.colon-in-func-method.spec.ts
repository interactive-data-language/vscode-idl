import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify function method to array for`, () => {
  it(`[auto generated] basic case`, async () => {
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
    const code = [`compile_opt idl2`, `a = objOrStruct.var(0 : -1)`, `end`];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: true,
      formatter: 'fiddle',
    });

    // define expected problems
    const expectedFormatting: string[] = [
      `compile_opt idl2`,
      `a = objOrStruct.var[0 : -1]`,
      `end`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 15,
        info: 'Colon detected in function method call. If indexing array, you should be using square brackets instead of parentheses. Using parentheses for array indexing is ambiguous and problematic when there is a function with the same name as the variable you are indexing.',
        start: [1, 15, 5],
        end: [1, 26, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "objOrStruct"',
        start: [1, 4, 11],
        end: [1, 4, 11],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [1, 0, 1],
        end: [1, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
