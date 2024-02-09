import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify doc formatting`, () => {
  it(`[auto generated] for non IDL Doc styled docs`, async () => {
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
      `; NAME:`,
      `;  DIST`,
      `;`,
      `; PURPOSE:`,
      `;  Create a rectangular array in which each element is proportional`,
      `;  to its frequency.  This array may be used for a variety`,
      `;  of purposes, including frequency-domain filtering and`,
      `;  making pretty pictures.`,
      `;`,
      `; CATEGORY:`,
      `;  Signal Processing.`,
      `;`,
      `; CALLING SEQUENCE:`,
      `;  Result = DIST(N [, M])`,
      `;`,
      `; INPUTS:`,
      `;  N = number of columns in result.`,
      `;  M = number of rows in result.  If omitted, N is used to return`,
      `;    a square array.`,
      `;`,
      `; OUTPUTS:`,
      `;  Returns an (N,M) floating array in which:`,
      `;`,
      `;  R(i,j) = SQRT(F(i)^2 + G(j)^2)   where:`,
      `;     F(i) = i  IF 0 <= i <= n/2`,
      `;          = n-i  IF i > n/2`,
      `;     G(i) = i  IF 0 <= i <= m/2`,
      `;          = m-i  IF i > m/2`,
      `;`,
      `; SIDE EFFECTS:`,
      `;  None.`,
      `;`,
      `; RESTRICTIONS:`,
      `;  None.`,
      `;`,
      `; PROCEDURE:`,
      `;  Straightforward.  The computation is done a row at a time.`,
      `;`,
      `; MODIFICATION HISTORY:`,
      `;  Very Old.`,
      `;   SMR, March 27, 1991 - Added the NOZERO keyword to increase efficiency.`,
      `;        (Recomended by Wayne Landsman)`,
      `;  DMS, July, 1992.  - Added M parameter to make non-square arrays.`,
      `;   CT, RSI, March 2000: Changed i^2 to i^2. to avoid overflow.`,
      `;-`,
      `function dist,n,m  ;Return a rectangular array in which each pixel = euclidian`,
      `    ;distance from the origin.`,
      `compile_opt idl2`,
      ``,
      `on_error,2              ;Return to caller if an error occurs`,
      ``,
      `n1 = n[0]`,
      `m1 = (n_elements(m) le 0) ? n1 : m[0]`,
      `x=findgen(n1)    ;Make a row`,
      `x = (x < (n1-x)) ^ 2  ;column squares`,
      ``,
      `a = FLTARR(n1,m1,/NOZERO)  ;Make array`,
      ``,
      `for i=0L, m1/2 do begin  ;Row loop`,
      `  y = sqrt(x + i^2.) ;Euclidian distance`,
      `  a[0,i] = y  ;Insert the row`,
      `  if i ne 0 then a[0, m1-i] = y ;Symmetrical`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Description:`,
        `;   NAME:`,
        `;    DIST`,
        `;`,
        `;   PURPOSE:`,
        `;    Create a rectangular array in which each element is proportional`,
        `;    to its frequency.  This array may be used for a variety`,
        `;    of purposes, including frequency-domain filtering and`,
        `;    making pretty pictures.`,
        `;`,
        `;   CATEGORY:`,
        `;    Signal Processing.`,
        `;`,
        `;   CALLING SEQUENCE:`,
        `;    Result = DIST(N [, M])`,
        `;`,
        `;   INPUTS:`,
        `;    N = number of columns in result.`,
        `;    M = number of rows in result.  If omitted, N is used to return`,
        `;      a square array.`,
        `;`,
        `;   OUTPUTS:`,
        `;    Returns an (N,M) floating array in which:`,
        `;`,
        `;    R(i,j) = SQRT(F(i)^2 + G(j)^2)   where:`,
        `;       F(i) = i  IF 0 <= i <= n/2`,
        `;            = n-i  IF i > n/2`,
        `;       G(i) = i  IF 0 <= i <= m/2`,
        `;            = m-i  IF i > m/2`,
        `;`,
        `;   SIDE EFFECTS:`,
        `;    None.`,
        `;`,
        `;   RESTRICTIONS:`,
        `;    None.`,
        `;`,
        `;   PROCEDURE:`,
        `;    Straightforward.  The computation is done a row at a time.`,
        `;`,
        `;   MODIFICATION HISTORY:`,
        `;    Very Old.`,
        `;     SMR, March 27, 1991 - Added the NOZERO keyword to increase efficiency.`,
        `;          (Recomended by Wayne Landsman)`,
        `;    DMS, July, 1992.  - Added M parameter to make non-square arrays.`,
        `;     CT, RSI, March 2000: Changed i^2 to i^2. to avoid overflow.`,
        `;`,
        `; :Returns: any`,
        `;`,
        `; :Arguments:`,
        `;   n: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   m: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 64,
        info: 'Parameter is missing from documentation: "n"',
        start: [56, 14, 1],
        end: [56, 14, 1],
        canReport: true,
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "m"',
        start: [56, 16, 1],
        end: [56, 16, 1],
        canReport: true,
      },
      {
        code: 52,
        info: 'Expected a documentation tag for ":Returns:" since this is a function or function method',
        start: [0, 0, 2],
        end: [45, 0, 2],
        canReport: true,
      },
      {
        code: 48,
        info: 'Argument(s) are missing from the documentation for the routine',
        start: [0, 0, 2],
        end: [45, 0, 2],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
