import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify function to array for`, () => {
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
    const code = [
      `compile_opt idl2`,
      `coefs = coefs_spc(*, 0 : junk - 1)`,
      `end`,
    ];

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
      `coefs = coefs_spc[*, 0 : junk - 1]`,
      `end`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 93,
        info: 'Found pointer de-reference, but nothing to operate on',
        start: [1, 18, 1],
        end: [1, 19, 0],
        canReport: true,
      },
      {
        code: 14,
        info: 'Colon detected in function call. If indexing array, you should be using square brackets instead of parentheses. Using parentheses for array indexing is ambiguous and problematic when there is a function with the same name as the variable you are indexing.',
        start: [1, 8, 10],
        end: [1, 33, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "junk"',
        start: [1, 25, 4],
        end: [1, 25, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "coefs"',
        start: [1, 0, 5],
        end: [1, 0, 5],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
