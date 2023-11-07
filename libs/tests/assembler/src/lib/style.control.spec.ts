import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Control statement styling`, () => {
  it(`[auto generated] using modern format`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  continue`,
      `  break`,
      `  forward_function`,
      `  common block, var1, var2, etc`,
      `  goto, myjump`,
      `  myjump:`,
      `end`,
      ``,
      `function myfuncfunc`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `; for loop`,
      `for i=0,100,3 do begin`,
      ``,
      `endfor`,
      ``,
      `; foreach loop`,
      `foreach val, var, key, do begin`,
      ``,
      `endforeach`,
      ``,
      `; while loop`,
      `while !true do begin`,
      ``,
      `endwhile`,
      ``,
      `; repeat loop`,
      `repeat print, !true until !false`,
      ``,
      `; switch statement`,
      `switch !true of`,
      `  else: ; something`,
      `endswitch`,
      ``,
      `; case statement`,
      `case !true of`,
      `  else: ; something`,
      `endcase`,
      ``,
      `; if statement`,
      `if !true then begin`,
      ``,
      `endif else begin`,
      ``,
      `endelse`,
      ``,
      `; structure inheritance`,
      `mystruct = {myname,  INHerits   plot}`,
      ``,
      `; executive command`,
      `.reset`,
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
      formatter: 'fiddle',
      style: { control: 'lower' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro mypro`,
        `  compile_opt idl2`,
        `  continue`,
        `  break`,
        `  forward_function`,
        `  common block, var1, var2, etc`,
        `  goto, myjump`,
        `  myjump:`,
        `end`,
        ``,
        `function myfuncfunc`,
        `  compile_opt idl2`,
        `  return, 1`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `; for loop`,
        `for i = 0, 100, 3 do begin`,
        ``,
        `endfor`,
        ``,
        `; foreach loop`,
        `foreach val, var, key, do begin`,
        ``,
        `endforeach`,
        ``,
        `; while loop`,
        `while !true do begin`,
        ``,
        `endwhile`,
        ``,
        `; repeat loop`,
        `repeat print, !true until !false`,
        ``,
        `; switch statement`,
        `switch !true of`,
        `  else: ; something`,
        `endswitch`,
        ``,
        `; case statement`,
        `case !true of`,
        `  else: ; something`,
        `endcase`,
        ``,
        `; if statement`,
        `if !true then begin`,
        ``,
        `endif else begin`,
        ``,
        `endelse`,
        ``,
        `; structure inheritance`,
        `mystruct = {Myname, inherits   Plot}`,
        ``,
        `; executive command`,
        `.reset`,
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
        code: 66,
        info: '"continue" statements can only exist within a loop',
        start: [2, 2, 8],
        end: [2, 2, 8],
      },
      {
        code: 67,
        info: '"break" statements can only exist within a loop, case, or switch',
        start: [3, 2, 5],
        end: [3, 2, 5],
      },
      {
        code: 77,
        info: 'No matching structure/object/class definition for structure named "myname"',
        start: [53, 12, 6],
        end: [53, 12, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [23, 13, 3],
        end: [23, 13, 3],
      },
      {
        code: 104,
        info: 'Unused variable "i"',
        start: [18, 4, 1],
        end: [18, 4, 1],
      },
      {
        code: 104,
        info: 'Unused variable "val"',
        start: [23, 8, 3],
        end: [23, 8, 3],
      },
      {
        code: 104,
        info: 'Unused variable "key"',
        start: [23, 18, 3],
        end: [23, 18, 3],
      },
      {
        code: 104,
        info: 'Unused variable "mystruct"',
        start: [53, 0, 8],
        end: [53, 0, 8],
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [5, 16, 4],
        end: [5, 16, 4],
      },
      {
        code: 104,
        info: 'Unused variable "var2"',
        start: [5, 22, 4],
        end: [5, 22, 4],
      },
      {
        code: 104,
        info: 'Unused variable "etc"',
        start: [5, 28, 3],
        end: [5, 28, 3],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] using dated format`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  continue`,
      `  break`,
      `  forward_function`,
      `  common block, var1, var2, etc`,
      `  goto, myjump`,
      `  myjump:`,
      `end`,
      ``,
      `function myfuncfunc`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `; for loop`,
      `for i=0,100,3 do begin`,
      ``,
      `endfor`,
      ``,
      `; foreach loop`,
      `foreach val, var, key, do begin`,
      ``,
      `endforeach`,
      ``,
      `; while loop`,
      `while !true do begin`,
      ``,
      `endwhile`,
      ``,
      `; repeat loop`,
      `repeat print, !true until !false`,
      ``,
      `; switch statement`,
      `switch !true of`,
      `  else: ; something`,
      `endswitch`,
      ``,
      `; case statement`,
      `case !true of`,
      `  else: ; something`,
      `endcase`,
      ``,
      `; if statement`,
      `if !true then begin`,
      ``,
      `endif else begin`,
      ``,
      `endelse`,
      ``,
      `; structure inheritance`,
      `mystruct = {myname,  INHerits   plot}`,
      ``,
      `; executive command`,
      `.reset`,
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
      formatter: 'fiddle',
      style: { control: 'upper' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `PRO mypro`,
        `  COMPILE_OPT IDL2`,
        `  CONTINUE`,
        `  BREAK`,
        `  FORWARD_FUNCTION`,
        `  COMMON block, var1, var2, etc`,
        `  GOTO, MYJUMP`,
        `  MYJUMP:`,
        `END`,
        ``,
        `FUNCTION myfuncfunc`,
        `  COMPILE_OPT IDL2`,
        `  return, 1`,
        `END`,
        ``,
        `COMPILE_OPT IDL2`,
        ``,
        `; for loop`,
        `FOR i = 0, 100, 3 DO BEGIN`,
        ``,
        `ENDFOR`,
        ``,
        `; foreach loop`,
        `FOREACH val, var, key, DO BEGIN`,
        ``,
        `ENDFOREACH`,
        ``,
        `; while loop`,
        `WHILE !true DO BEGIN`,
        ``,
        `ENDWHILE`,
        ``,
        `; repeat loop`,
        `REPEAT print, !true UNTIL !false`,
        ``,
        `; switch statement`,
        `SWITCH !true OF`,
        `  ELSE: ; something`,
        `ENDSWITCH`,
        ``,
        `; case statement`,
        `CASE !true OF`,
        `  ELSE: ; something`,
        `ENDCASE`,
        ``,
        `; if statement`,
        `IF !true THEN BEGIN`,
        ``,
        `ENDIF ELSE BEGIN`,
        ``,
        `ENDELSE`,
        ``,
        `; structure inheritance`,
        `mystruct = {Myname, INHERITS   Plot}`,
        ``,
        `; executive command`,
        `.RESET`,
        ``,
        `END`,
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
        code: 66,
        info: '"continue" statements can only exist within a loop',
        start: [2, 2, 8],
        end: [2, 2, 8],
      },
      {
        code: 67,
        info: '"break" statements can only exist within a loop, case, or switch',
        start: [3, 2, 5],
        end: [3, 2, 5],
      },
      {
        code: 77,
        info: 'No matching structure/object/class definition for structure named "myname"',
        start: [53, 12, 6],
        end: [53, 12, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [23, 13, 3],
        end: [23, 13, 3],
      },
      {
        code: 104,
        info: 'Unused variable "i"',
        start: [18, 4, 1],
        end: [18, 4, 1],
      },
      {
        code: 104,
        info: 'Unused variable "val"',
        start: [23, 8, 3],
        end: [23, 8, 3],
      },
      {
        code: 104,
        info: 'Unused variable "key"',
        start: [23, 18, 3],
        end: [23, 18, 3],
      },
      {
        code: 104,
        info: 'Unused variable "mystruct"',
        start: [53, 0, 8],
        end: [53, 0, 8],
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [5, 16, 4],
        end: [5, 16, 4],
      },
      {
        code: 104,
        info: 'Unused variable "var2"',
        start: [5, 22, 4],
        end: [5, 22, 4],
      },
      {
        code: 104,
        info: 'Unused variable "etc"',
        start: [5, 28, 3],
        end: [5, 28, 3],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] using no format`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  continue`,
      `  break`,
      `  forward_function`,
      `  common block, var1, var2, etc`,
      `  goto, myjump`,
      `  myjump:`,
      `end`,
      ``,
      `function myfuncfunc`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `; for loop`,
      `for i=0,100,3 do begin`,
      ``,
      `endfor`,
      ``,
      `; foreach loop`,
      `foreach val, var, key, do begin`,
      ``,
      `endforeach`,
      ``,
      `; while loop`,
      `while !true do begin`,
      ``,
      `endwhile`,
      ``,
      `; repeat loop`,
      `repeat print, !true until !false`,
      ``,
      `; switch statement`,
      `switch !true of`,
      `  else: ; something`,
      `endswitch`,
      ``,
      `; case statement`,
      `case !true of`,
      `  else: ; something`,
      `endcase`,
      ``,
      `; if statement`,
      `if !true then begin`,
      ``,
      `endif else begin`,
      ``,
      `endelse`,
      ``,
      `; structure inheritance`,
      `mystruct = {myname,  INHerits   plot}`,
      ``,
      `; executive command`,
      `.reset`,
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
      formatter: 'fiddle',
      style: { control: 'none' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro mypro`,
        `  compile_opt idl2`,
        `  continue`,
        `  break`,
        `  forward_function`,
        `  common block, var1, var2, etc`,
        `  goto, myjump`,
        `  myjump:`,
        `end`,
        ``,
        `function myfuncfunc`,
        `  compile_opt idl2`,
        `  return, 1`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `; for loop`,
        `for i = 0, 100, 3 do begin`,
        ``,
        `endfor`,
        ``,
        `; foreach loop`,
        `foreach val, var, key, do begin`,
        ``,
        `endforeach`,
        ``,
        `; while loop`,
        `while !true do begin`,
        ``,
        `endwhile`,
        ``,
        `; repeat loop`,
        `repeat print, !true until !false`,
        ``,
        `; switch statement`,
        `switch !true of`,
        `  else: ; something`,
        `endswitch`,
        ``,
        `; case statement`,
        `case !true of`,
        `  else: ; something`,
        `endcase`,
        ``,
        `; if statement`,
        `if !true then begin`,
        ``,
        `endif else begin`,
        ``,
        `endelse`,
        ``,
        `; structure inheritance`,
        `mystruct = {Myname, INHerits   Plot}`,
        ``,
        `; executive command`,
        `.reset`,
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
        code: 66,
        info: '"continue" statements can only exist within a loop',
        start: [2, 2, 8],
        end: [2, 2, 8],
      },
      {
        code: 67,
        info: '"break" statements can only exist within a loop, case, or switch',
        start: [3, 2, 5],
        end: [3, 2, 5],
      },
      {
        code: 77,
        info: 'No matching structure/object/class definition for structure named "myname"',
        start: [53, 12, 6],
        end: [53, 12, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [23, 13, 3],
        end: [23, 13, 3],
      },
      {
        code: 104,
        info: 'Unused variable "i"',
        start: [18, 4, 1],
        end: [18, 4, 1],
      },
      {
        code: 104,
        info: 'Unused variable "val"',
        start: [23, 8, 3],
        end: [23, 8, 3],
      },
      {
        code: 104,
        info: 'Unused variable "key"',
        start: [23, 18, 3],
        end: [23, 18, 3],
      },
      {
        code: 104,
        info: 'Unused variable "mystruct"',
        start: [53, 0, 8],
        end: [53, 0, 8],
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [5, 16, 4],
        end: [5, 16, 4],
      },
      {
        code: 104,
        info: 'Unused variable "var2"',
        start: [5, 22, 4],
        end: [5, 22, 4],
      },
      {
        code: 104,
        info: 'Unused variable "etc"',
        start: [5, 28, 3],
        end: [5, 28, 3],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
