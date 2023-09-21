import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we remove excess args`, () => {
  it(`[auto generated] for functions`, async () => {
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
      `; :Returns:`,
      `;   any`,
      `;`,
      `;-`,
      `function myname`,
      `  compile_opt idl2`,
      ``,
      `  ;comment`,
      `  ; comment`,
      `  return, !null, $`,
      `    2, myfunc()`,
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
      `;+`,
      `; :Returns:`,
      `;   any`,
      `;`,
      `;-`,
      `function myname`,
      `  compile_opt idl2`,
      ``,
      `  ; comment`,
      `  ; comment`,
      `  return, !null`,
      ``,
      `end`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 21,
        info: 'In function definitions, the "return" procedure cannot have more than one value',
        start: [10, 2, 6],
        end: [11, 15, 0],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] for function methods`, async () => {
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
      `; :Returns:`,
      `;   any`,
      `;`,
      `;-`,
      `function myclass::myname`,
      `  compile_opt idl2`,
      ``,
      `  a = 5`,
      `  return, !null, 2`,
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
      `;+`,
      `; :Returns:`,
      `;   any`,
      `;`,
      `;-`,
      `function myclass::myname`,
      `  compile_opt idl2`,
      ``,
      `  a = 5`,
      `  return, !null`,
      `end`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 21,
        info: 'In function definitions, the "return" procedure cannot have more than one value',
        start: [9, 2, 6],
        end: [9, 18, 0],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [8, 2, 1],
        end: [8, 2, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
