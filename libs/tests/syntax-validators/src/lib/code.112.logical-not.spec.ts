import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Logical predicate with not`, () => {
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
      `if myfunc(not a) then print, 'WOW!'`,
      ``,
      `if (not !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (not !true) of`,
      `  myfunc(not b): var = not 5`,
      `  (not !true): var = not 5`,
      `  else: var = not 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (not !true) of`,
      `  myfunc(not b): var = not 5`,
      `  (not !true): var = not 5`,
      `  else: var = not 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = not 5`,
      `endrep until not b`,
      ``,
      `while (not b) do begin`,
      `  var = not 5`,
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
      `if myfunc(not a) then print, 'WOW!'`,
      ``,
      `if (not !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (not !true) of`,
      `  myfunc(not b): var = not 5`,
      `  (not !true): var = not 5`,
      `  else: var = not 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (not !true) of`,
      `  myfunc(not b): var = not 5`,
      `  (not !true): var = not 5`,
      `  else: var = not 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = not 5`,
      `endrep until not b`,
      ``,
      `while (not b) do begin`,
      `  var = not 5`,
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
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [7, 4, 3],
        end: [7, 4, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 7, character: 4 },
              end: { line: 7, character: 7 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [10, 8, 3],
        end: [10, 8, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 10, character: 8 },
              end: { line: 10, character: 11 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [12, 3, 3],
        end: [12, 3, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 12, character: 3 },
              end: { line: 12, character: 6 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [17, 6, 3],
        end: [17, 6, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 17, character: 6 },
              end: { line: 17, character: 9 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [19, 3, 3],
        end: [19, 3, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 19, character: 3 },
              end: { line: 19, character: 6 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [25, 13, 3],
        end: [25, 13, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 25, character: 13 },
              end: { line: 25, character: 16 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [27, 7, 3],
        end: [27, 7, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 27, character: 7 },
              end: { line: 27, character: 10 },
            },
            newText: '~',
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
      `if myfunc(not a) then print, 'WOW!'`,
      ``,
      `if (not !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (not !true) of`,
      `  myfunc(not b): var = not 5`,
      `  (not !true): var = not 5`,
      `  else: var = not 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (not !true) of`,
      `  myfunc(not b): var = not 5`,
      `  (not !true): var = not 5`,
      `  else: var = not 5`,
      `endcase`,
      ``,
      `repeat begin`,
      `  var = not 5`,
      `endrep until not b`,
      ``,
      `while (not b) do begin`,
      `  var = not 5`,
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
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [7, 4, 3],
        end: [7, 4, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 7, character: 4 },
              end: { line: 7, character: 7 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [10, 8, 3],
        end: [10, 8, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 10, character: 8 },
              end: { line: 10, character: 11 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [12, 3, 3],
        end: [12, 3, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 12, character: 3 },
              end: { line: 12, character: 6 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [17, 6, 3],
        end: [17, 6, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 17, character: 6 },
              end: { line: 17, character: 9 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [19, 3, 3],
        end: [19, 3, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 19, character: 3 },
              end: { line: 19, character: 6 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [25, 13, 3],
        end: [25, 13, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 25, character: 13 },
              end: { line: 25, character: 16 },
            },
            newText: '~',
          },
        ],
      },
      {
        code: 112,
        info: 'Detected a "not" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `~` operator is preferred as the behavior might not match what you expect.',
        start: [27, 7, 3],
        end: [27, 7, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 27, character: 7 },
              end: { line: 27, character: 10 },
            },
            newText: '~',
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
