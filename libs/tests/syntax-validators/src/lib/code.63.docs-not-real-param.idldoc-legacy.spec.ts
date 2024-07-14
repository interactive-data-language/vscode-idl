import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects when a documented parameter does not exist in routine definition`, () => {
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
      `;+`,
      `; My procedure`,
      `;`,
      `; @param var1 My favorite thing`,
      `;`,
      `; @keyword kw1 Super Cool Flag`,
      `;`,
      `;-`,
      `pro mypro, var1, KW1=kw1`,
      `  compile_opt idl2`,
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
        code: 104,
        info: 'Unused variable "kw1"',
        start: [8, 21, 3],
        end: [8, 21, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [8, 11, 4],
        end: [8, 11, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problem with args and keywords`, async () => {
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
      `; My procedure`,
      `;`,
      `; @param var1 My favorite thing`,
      `; @param var2 My favorite thing`,
      `;`,
      `; @keyword kw1 Super Cool Flag`,
      `; @keyword kw2 Super Cool Flag`,
      `;`,
      `;-`,
      `pro mypro, var2, KW2=kw2`,
      `  compile_opt idl2`,
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
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "var1"',
        start: [3, 0, 31],
        end: [3, 0, 31],
        canReport: true,
      },
      {
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "kw1"',
        start: [6, 0, 30],
        end: [6, 0, 30],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [10, 21, 3],
        end: [10, 21, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "var2"',
        start: [10, 11, 4],
        end: [10, 11, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
