import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we style switch`, () => {
  it(`[auto generated] formats messy switch`, async () => {
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
      `SWITCH x OF`,
      `   ; something cool`,
      `1 $`,
      `  : $`,
      `   PRINT, 'one' + func()`,
      `  2 $`,
      `  : $`,
      `  PRINT, 'one' + func()`,
      `     ELSE: BEGIN`,
      `   dat = {myStruct}`,
      `   PRINT, 'Please enter a value between 1 and 4'`,
      `   END`,
      `ENDCASE`,
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
        `switch x of`,
        `  ; something cool`,
        `  1 $`,
        `  : $`,
        `    print, 'one' + func()`,
        `  2 $`,
        `  : $`,
        `    print, 'one' + func()`,
        `  else: begin`,
        `    dat = {MyStruct}`,
        `    print, 'Please enter a value between 1 and 4'`,
        `  end`,
        `endcase`,
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
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 6],
        end: [0, 0, 6],
      },
      {
        code: 77,
        info: 'No matching structure/object/class definition for structure named "myStruct"',
        start: [9, 10, 8],
        end: [9, 10, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "x"',
        start: [0, 7, 1],
        end: [0, 7, 1],
      },
      {
        code: 104,
        info: 'Unused variable "dat"',
        start: [9, 3, 3],
        end: [9, 3, 3],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] formats nested switch`, async () => {
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
      `SWITCH x OF`,
      `1: PRINT, 'one'`,
      `ELSE: BEGIN`,
      ` switch x OF`,
      `      2: PRINT, 'two'`,
      `    ELSE: BEGIN`,
      `  END`,
      `     ENDCASE`,
      `END`,
      `ENDCASE`,
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
        `switch x of`,
        `  1: print, 'one'`,
        `  else: begin`,
        `    switch x of`,
        `      2: print, 'two'`,
        `      else: begin`,
        `      end`,
        `    endcase`,
        `  end`,
        `endcase`,
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
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 6],
        end: [0, 0, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "x"',
        start: [0, 7, 1],
        end: [0, 7, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "x"',
        start: [3, 8, 1],
        end: [3, 8, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
