import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Logical predicate with and`, () => {
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
      `if myfunc(a and b) then print, 'WOW!'`,
      ``,
      `if (!true and !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true and !true) of`,
      `  myfunc(a and b): var = [1, 2, 3] and 5`,
      `  (!true and !true): var = [1, 2, 3] and 5`,
      `  else: var = [1, 2, 3] and 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true and !true) of`,
      `  myfunc(a and b): var = [1, 2, 3] and 5`,
      `  (!true and !true): var = [1, 2, 3] and 5`,
      `  else: var = [1, 2, 3] and 5`,
      `endcase`,
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
      `if myfunc(a and b) then print, 'WOW!'`,
      ``,
      `if (!true and !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true and !true) of`,
      `  myfunc(a and b): var = [1, 2, 3] and 5`,
      `  (!true and !true): var = [1, 2, 3] and 5`,
      `  else: var = [1, 2, 3] and 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true and !true) of`,
      `  myfunc(a and b): var = [1, 2, 3] and 5`,
      `  (!true and !true): var = [1, 2, 3] and 5`,
      `  else: var = [1, 2, 3] and 5`,
      `endcase`,
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
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [7, 10, 3],
        end: [7, 10, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 7, character: 10 },
              end: { line: 7, character: 13 },
            },
            newText: '&&',
          },
        ],
      },
      {
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [10, 14, 3],
        end: [10, 14, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 10, character: 14 },
              end: { line: 10, character: 17 },
            },
            newText: '&&',
          },
        ],
      },
      {
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [12, 9, 3],
        end: [12, 9, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 12, character: 9 },
              end: { line: 12, character: 12 },
            },
            newText: '&&',
          },
        ],
      },
      {
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [17, 12, 3],
        end: [17, 12, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 17, character: 12 },
              end: { line: 17, character: 15 },
            },
            newText: '&&',
          },
        ],
      },
      {
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [19, 9, 3],
        end: [19, 9, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 19, character: 9 },
              end: { line: 19, character: 12 },
            },
            newText: '&&',
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
      `if myfunc(a and b) then print, 'WOW!'`,
      ``,
      `if (!true and !false) then print, 'WOW!'`,
      ``,
      `; handle switch`,
      `switch (!true and !true) of`,
      `  myfunc(a and b): var = [1, 2, 3] and 5`,
      `  (!true and !true): var = [1, 2, 3] and 5`,
      `  else: var = [1, 2, 3] and 5`,
      `endswitch`,
      ``,
      `; handle case`,
      `case (!true and !true) of`,
      `  myfunc(a and b): var = [1, 2, 3] and 5`,
      `  (!true and !true): var = [1, 2, 3] and 5`,
      `  else: var = [1, 2, 3] and 5`,
      `endcase`,
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
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [7, 10, 3],
        end: [7, 10, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 7, character: 10 },
              end: { line: 7, character: 13 },
            },
            newText: '&&',
          },
        ],
      },
      {
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [10, 14, 3],
        end: [10, 14, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 10, character: 14 },
              end: { line: 10, character: 17 },
            },
            newText: '&&',
          },
        ],
      },
      {
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [12, 9, 3],
        end: [12, 9, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 12, character: 9 },
              end: { line: 12, character: 12 },
            },
            newText: '&&',
          },
        ],
      },
      {
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [17, 12, 3],
        end: [17, 12, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 17, character: 12 },
              end: { line: 17, character: 15 },
            },
            newText: '&&',
          },
        ],
      },
      {
        code: 110,
        info: 'Detected an "and" statement in logical expression when `idl2`, `idl3`, or `logical_predicate` compile option is set. The `&&` operator is preferred as the behavior might not match what you expect.',
        start: [19, 9, 3],
        end: [19, 9, 3],
        canReport: true,
        edits: [
          {
            range: {
              start: { line: 19, character: 9 },
              end: { line: 19, character: 12 },
            },
            newText: '&&',
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
