import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Logical predicate with or`, () => {
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
      `if myfunc(a or b) then print, 'WOW!'`,
      ``,
      `if (!true or !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true or !true) of`,
      `  myfunc(a or b): var = [1, 2, 3] or 5`,
      `  (!true or !true): var = [1, 2, 3] or 5`,
      `  else: var = [1, 2, 3] or 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true or !true) of`,
      `  myfunc(a or b): var = [1, 2, 3] or 5`,
      `  (!true or !true): var = [1, 2, 3] or 5`,
      `  else: var = [1, 2, 3] or 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = [1, 2, 3] or 5`,
      `endrep until a or b`,
      ``,
      `while (a or b) do begin`,
      `  var = [1, 2, 3] or 5`,
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
      `if myfunc(a or b) then print, 'WOW!'`,
      ``,
      `if (!true or !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true or !true) of`,
      `  myfunc(a or b): var = [1, 2, 3] or 5`,
      `  (!true or !true): var = [1, 2, 3] or 5`,
      `  else: var = [1, 2, 3] or 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true or !true) of`,
      `  myfunc(a or b): var = [1, 2, 3] or 5`,
      `  (!true or !true): var = [1, 2, 3] or 5`,
      `  else: var = [1, 2, 3] or 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = [1, 2, 3] or 5`,
      `endrep until a or b`,
      ``,
      `while (a or b) do begin`,
      `  var = [1, 2, 3] or 5`,
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
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [7, 10, 2],
        end: [7, 10, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 7, character: 10 },
              end: { line: 7, character: 12 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [10, 14, 2],
        end: [10, 14, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 10, character: 14 },
              end: { line: 10, character: 16 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [12, 9, 2],
        end: [12, 9, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 12, character: 9 },
              end: { line: 12, character: 11 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [17, 12, 2],
        end: [17, 12, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 17, character: 12 },
              end: { line: 17, character: 14 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [19, 9, 2],
        end: [19, 9, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 19, character: 9 },
              end: { line: 19, character: 11 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [25, 15, 2],
        end: [25, 15, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 25, character: 15 },
              end: { line: 25, character: 17 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [27, 9, 2],
        end: [27, 9, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 27, character: 9 },
              end: { line: 27, character: 11 },
            },
            newText: '||',
          },
        ],
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
      `if myfunc(a or b) then print, 'WOW!'`,
      ``,
      `if (!true or !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true or !true) of`,
      `  myfunc(a or b): var = [1, 2, 3] or 5`,
      `  (!true or !true): var = [1, 2, 3] or 5`,
      `  else: var = [1, 2, 3] or 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true or !true) of`,
      `  myfunc(a or b): var = [1, 2, 3] or 5`,
      `  (!true or !true): var = [1, 2, 3] or 5`,
      `  else: var = [1, 2, 3] or 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = [1, 2, 3] or 5`,
      `endrep until a or b`,
      ``,
      `while (a or b) do begin`,
      `  var = [1, 2, 3] or 5`,
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
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [7, 10, 2],
        end: [7, 10, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 7, character: 10 },
              end: { line: 7, character: 12 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [10, 14, 2],
        end: [10, 14, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 10, character: 14 },
              end: { line: 10, character: 16 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [12, 9, 2],
        end: [12, 9, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 12, character: 9 },
              end: { line: 12, character: 11 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [17, 12, 2],
        end: [17, 12, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 17, character: 12 },
              end: { line: 17, character: 14 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [19, 9, 2],
        end: [19, 9, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 19, character: 9 },
              end: { line: 19, character: 11 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [25, 15, 2],
        end: [25, 15, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 25, character: 15 },
              end: { line: 25, character: 17 },
            },
            newText: '||',
          },
        ],
      },
      {
        code: 111,
        info: 'Detected an "or" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `||` operator is preferred as the behavior might not match what you expect.',
        start: [27, 9, 2],
        end: [27, 9, 2],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 27, character: 9 },
              end: { line: 27, character: 11 },
            },
            newText: '||',
          },
        ],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
