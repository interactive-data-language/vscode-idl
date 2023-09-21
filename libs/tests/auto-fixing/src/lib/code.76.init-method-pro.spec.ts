import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we change procedure init methods to function methods`, () => {
  it(`[auto generated] without return statements`, async () => {
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
      `PRO myclass2::init`,
      `  compile_opt idl2`,
      ``,
      `end`,
      ``,
      ``,
      `pro myclass::init`,
      `  compile_opt idl2`,
      ``,
      `  ; comment`,
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
      `function myclass2::init`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `function myclass::init`,
      `  compile_opt idl2`,
      ``,
      `  ; comment`,
      `  return, 1`,
      `end`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 76,
        info: 'The "::init" method for object classes should be a function',
        start: [0, 0, 4],
        end: [0, 18, 0],
      },
      {
        code: 76,
        info: 'The "::init" method for object classes should be a function',
        start: [7, 0, 4],
        end: [7, 17, 0],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] with return statements`, async () => {
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
      `pro myclass::init`,
      `  compile_opt idl2`,
      ``,
      `  ; comment`,
      `  return, !null`,
      `end`,
      ``,
      `PRO myclass2::init`,
      `  compile_opt idl2`,
      `  return`,
      `end`,
      ``,
      ``,
      `pro myclass::init`,
      `  compile_opt idl2`,
      `  return`,
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
      `function myclass::init`,
      `  compile_opt idl2`,
      ``,
      `  ; comment`,
      `  return, 1`,
      `end`,
      ``,
      `function myclass2::init`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `function myclass::init`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
    ];

    // verify formatting
    expect(formatted !== undefined ? formatted.split(`\n`) : formatted).toEqual(
      expectedFormatting
    );

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 76,
        info: 'The "::init" method for object classes should be a function',
        start: [0, 0, 4],
        end: [0, 17, 0],
      },
      {
        code: 20,
        info: 'In procedures and main level programs, the "return" procedure cannot have values',
        start: [4, 2, 6],
        end: [4, 15, 0],
      },
      {
        code: 76,
        info: 'The "::init" method for object classes should be a function',
        start: [7, 0, 4],
        end: [7, 18, 0],
      },
      {
        code: 76,
        info: 'The "::init" method for object classes should be a function',
        start: [13, 0, 4],
        end: [13, 17, 0],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
