import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Logical predicate with xor`, () => {
  it(`[auto generated] no problems`, async () => {
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
      ``,
      `a = [1, 2, 4]`,
      `b = [1, 2, 4]`,
      ``,
      `if myfunc(a xor b) then print, 'WOW!'`,
      ``,
      `if (!true xor !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true xor !true) of`,
      `  myfunc(a xor b): var = [1, 2, 3] xor 5`,
      `  (!true xor !true): var = [1, 2, 3] xor 5`,
      `  else: var = [1, 2, 3] xor 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true xor !true) of`,
      `  myfunc(a xor b): var = [1, 2, 3] xor 5`,
      `  (!true xor !true): var = [1, 2, 3] xor 5`,
      `  else: var = [1, 2, 3] xor 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = [1, 2, 3] xor 5`,
      `endrep until a xor b`,
      ``,
      `while (a xor b) do begin`,
      `  var = [1, 2, 3] xor 5`,
      `endwhile`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems`, async () => {
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
      `compile_opt idl2, logical_predicate`,
      ``,
      `a = [1, 2, 4]`,
      `b = [1, 2, 4]`,
      ``,
      `if myfunc(a xor b) then print, 'WOW!'`,
      ``,
      `if (!true xor !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true xor !true) of`,
      `  myfunc(a xor b): var = [1, 2, 3] xor 5`,
      `  (!true xor !true): var = [1, 2, 3] xor 5`,
      `  else: var = [1, 2, 3] xor 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true xor !true) of`,
      `  myfunc(a xor b): var = [1, 2, 3] xor 5`,
      `  (!true xor !true): var = [1, 2, 3] xor 5`,
      `  else: var = [1, 2, 3] xor 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = [1, 2, 3] xor 5`,
      `endrep until a xor b`,
      ``,
      `while (a xor b) do begin`,
      `  var = [1, 2, 3] xor 5`,
      `endwhile`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [7, 10, 3],
        end: [7, 10, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [10, 14, 3],
        end: [10, 14, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [12, 9, 3],
        end: [12, 9, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [17, 12, 3],
        end: [17, 12, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [19, 9, 3],
        end: [19, 9, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [25, 15, 3],
        end: [25, 15, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [27, 9, 3],
        end: [27, 9, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems`, async () => {
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
      `compile_opt idl3`,
      ``,
      `a = [1, 2, 4]`,
      `b = [1, 2, 4]`,
      ``,
      `if myfunc(a xor b) then print, 'WOW!'`,
      ``,
      `if (!true xor !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true xor !true) of`,
      `  myfunc(a xor b): var = [1, 2, 3] xor 5`,
      `  (!true xor !true): var = [1, 2, 3] xor 5`,
      `  else: var = [1, 2, 3] xor 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true xor !true) of`,
      `  myfunc(a xor b): var = [1, 2, 3] xor 5`,
      `  (!true xor !true): var = [1, 2, 3] xor 5`,
      `  else: var = [1, 2, 3] xor 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = [1, 2, 3] xor 5`,
      `endrep until a xor b`,
      ``,
      `while (a xor b) do begin`,
      `  var = [1, 2, 3] xor 5`,
      `endwhile`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [7, 10, 3],
        end: [7, 10, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [10, 14, 3],
        end: [10, 14, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [12, 9, 3],
        end: [12, 9, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [17, 12, 3],
        end: [17, 12, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [19, 9, 3],
        end: [19, 9, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [25, 15, 3],
        end: [25, 15, 3],
        canReport: true,
      },
      {
        code: 113,
        info: 'Detected an "xor" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The behavior might not match what you expect.',
        start: [27, 9, 3],
        end: [27, 9, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
