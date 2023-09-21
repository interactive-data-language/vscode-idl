import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify tokens after main get removed on formatting`, () => {
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
      `a = $ ; comment`,
      `  5`,
      `end`,
      ``,
      `; bad`,
      ` worse = not 42`,
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
      `a = $ ; comment`,
      `  5`,
      `end`,
      ``,
      `; bad`,
      `worse = not 42`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [6, 1, 5],
        end: [6, 1, 5],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [6, 7, 1],
        end: [6, 7, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [6, 9, 3],
        end: [6, 9, 3],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [6, 13, 2],
        end: [6, 13, 2],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [6, 15, 0],
        end: [6, 15, 0],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [6, 15, 0],
        end: [6, 15, 0],
      },
      {
        code: 99,
        info: 'Undefined variable "worse"',
        start: [6, 1, 5],
        end: [6, 1, 5],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [1, 0, 1],
        end: [1, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
