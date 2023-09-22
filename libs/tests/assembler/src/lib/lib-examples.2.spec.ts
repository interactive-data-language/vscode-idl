import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Lib examples 2`, () => {
  it(`[auto generated] dist.pro`, async () => {
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
      `function dist,n,m  ;Return a rectangular array in which each pixel = euclidian`,
      `               ;distance from the origin.`,
      `compile_opt idl2`,
      ``,
      `on_error,2              ;Return to caller if an error occurs`,
      ``,
      `n1 = n[0]`,
      `m1 = (n_elements(m) le 0) ? n1 : m[0]`,
      `x=findgen(n1)          ;Make a row`,
      `x = (x < (n1-x)) ^ 2   ;column squares`,
      ``,
      `a = FLTARR(n1,m1,/NOZERO)      ;Make array`,
      ``,
      `for i=0L, m1/2 do begin        ;Row loop`,
      `       y = sqrt(x + i^2.) ;Euclidian distance`,
      `       a[0,i] = y      ;Insert the row`,
      `       if i ne 0 then a[0, m1-i] = y ;Symmetrical`,
      `endfor`,
      `return,a`,
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
        `function dist, n, m ; Return a rectangular array in which each pixel = euclidian`,
        `  ; distance from the origin.`,
        `  compile_opt idl2`,
        ``,
        `  on_error, 2 ; Return to caller if an error occurs`,
        ``,
        `  n1 = n[0]`,
        `  m1 = (n_elements(m) le 0) ? n1 : m[0]`,
        `  x = findgen(n1) ; Make a row`,
        `  x = (x < (n1 - x)) ^ 2 ; column squares`,
        ``,
        `  a = fltarr(n1, m1, /nozero) ; Make array`,
        ``,
        `  for i = 0l, m1 / 2 do begin ; Row loop`,
        `    y = sqrt(x + i ^ 2.) ; Euclidian distance`,
        `    a[0, i] = y ; Insert the row`,
        `    if i ne 0 then a[0, m1 - i] = y ; Symmetrical`,
        `  endfor`,
        `  return, a`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
