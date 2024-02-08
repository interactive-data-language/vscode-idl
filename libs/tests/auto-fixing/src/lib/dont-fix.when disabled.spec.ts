import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we remove excess args`, () => {
  it(`[auto generated] for procedures`, async () => {
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
      `; idl-disable`,
      `;-`,
      `pro myname`,
      `  compile_opt idl2`,
      ``,
      `  ; comment`,
      `  return, 42`,
      ``,
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
      `; idl-disable`,
      `;-`,
      `pro myname`,
      `  compile_opt idl2`,
      ``,
      `  ; comment`,
      `  return, 42`,
      `end`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 20,
        info: 'In procedures and main level programs, the "return" procedure cannot have values',
        start: [7, 2, 6],
        end: [7, 12, 0],
        canReport: false,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] for procedure methods`, async () => {
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
      `; idl-disable`,
      `;-`,
      `pro myclass::myname`,
      `  compile_opt idl2`,
      ``,
      `  a = 5`,
      `  return, 42`,
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
      `; idl-disable`,
      `;-`,
      `pro myclass::myname`,
      `  compile_opt idl2`,
      ``,
      `  a = 5`,
      `  return, 42`,
      `end`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 20,
        info: 'In procedures and main level programs, the "return" procedure cannot have values',
        start: [7, 2, 6],
        end: [7, 12, 0],
        canReport: false,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [6, 2, 1],
        end: [6, 2, 1],
        canReport: false,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] for main level programs`, async () => {
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
      `; idl-disable`,
      `; main`,
      `compile_opt idl2`,
      ``,
      `return, 42`,
      ``,
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
      `; idl-disable`,
      `; main`,
      `compile_opt idl2`,
      ``,
      `return, 42`,
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
        code: 20,
        info: 'In procedures and main level programs, the "return" procedure cannot have values',
        start: [4, 0, 6],
        end: [4, 10, 0],
        canReport: false,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
