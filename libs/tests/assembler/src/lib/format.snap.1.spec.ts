import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify snapping branches to remove leading and trailing spaces`, () => {
  it(`[auto generated] all snap cases`, async () => {
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
      `function test, a, $`,
      `  b`,
      ``,
      `  compile_opt idl2`,
      ``,
      `  wait, 0.5`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `function test::class, a, $`,
      `  b`,
      ``,
      `  compile_opt idl2`,
      ``,
      `  wait, 0.5`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `pro test::class, a, $`,
      `  b`,
      ``,
      `  compile_opt idl2`,
      ``,
      `  wait, 0.5`,
      ``,
      `end`,
      ``,
      `pro test, a, $`,
      `  b`,
      ``,
      `  compile_opt idl2`,
      ``,
      `  wait, 0.5`,
      ``,
      `  if !true then begin`,
      ``,
      `    print, 5`,
      ``,
      `    print, 6`,
      ` `,
      `  endif`,
      ``,
      `  switch (!true) of`,
      ``,
      `    (42 eq 42): begin`,
      ``,
      `    end`,
      ``,
      `    else: begin`,
      ``,
      `      ; do nothing`,
      ``,
      `    end`,
      ``,
      `  endswitch`,
      ``,
      `end`,
      ``,
      ``,
      `compile_opt idl2`,
      ``,
      `print, 5`,
      ``,
      `wait, 2`,
      ``,
      `test`,
      ``,
      `print, 'Finished'`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function test, a, $`,
        `  b`,
        `  compile_opt idl2`,
        ``,
        `  wait, 0.5`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `function test::class, a, $`,
        `  b`,
        `  compile_opt idl2`,
        ``,
        `  wait, 0.5`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro test::class, a, $`,
        `  b`,
        `  compile_opt idl2`,
        ``,
        `  wait, 0.5`,
        `end`,
        ``,
        `pro test, a, $`,
        `  b`,
        `  compile_opt idl2`,
        ``,
        `  wait, 0.5`,
        ``,
        `  if !true then begin`,
        `    print, 5`,
        ``,
        `    print, 6`,
        `  endif`,
        ``,
        `  switch (!true) of`,
        `    (42 eq 42): begin`,
        ``,
        `    end`,
        ``,
        `    else: begin`,
        `      ; do nothing`,
        `    end`,
        `  endswitch`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `print, 5`,
        ``,
        `wait, 2`,
        ``,
        `test`,
        ``,
        `print, 'Finished'`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [25, 10, 1],
        end: [25, 10, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [26, 2, 1],
        end: [26, 2, 1],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [18, 17, 1],
        end: [18, 17, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [19, 2, 1],
        end: [19, 2, 1],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [9, 22, 1],
        end: [9, 22, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [10, 2, 1],
        end: [10, 2, 1],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 15, 1],
        end: [0, 15, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [1, 2, 1],
        end: [1, 2, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
