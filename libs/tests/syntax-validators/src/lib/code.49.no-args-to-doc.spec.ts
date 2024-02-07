import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects documented args when there are no args`, () => {
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
      `;`,
      `; :Params:`,
      `;   var1: in, optional, type=boolean`,
      `;     My favorite argument`,
      `;`,
      `;-`,
      `pro myclass::mymethod, var1`,
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
        info: 'Unused variable "var1"',
        start: [7, 23, 4],
        end: [7, 23, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problem`, async () => {
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
      `;`,
      `; :Params:`,
      `;   var1: in, optional, type=boolean`,
      `;     My favorite argument`,
      `;`,
      `;-`,
      `pro myclass::mymethod`,
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
        start: [3, 0, 36],
        end: [3, 0, 36],
        canReport: true,
      },
      {
        code: 49,
        info: 'Documentation includes arguments, but none are present in routine definition',
        start: [2, 2, 9],
        end: [5, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
