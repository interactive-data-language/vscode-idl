import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects when a defined parameter is missing from user docs`, () => {
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
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [8, 11, 4],
        end: [8, 11, 4],
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
      `;`,
      `; @keyword kw1 Super Cool Flag`,
      `;`,
      `;-`,
      `pro mypro, var1, var2, KW1=kw1, KW2=kw2`,
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
        code: 64,
        info: 'Parameter is missing from documentation: "var2"',
        start: [8, 17, 4],
        end: [8, 17, 4],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "kw2"',
        start: [8, 32, 3],
        end: [8, 32, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [8, 27, 3],
        end: [8, 27, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [8, 36, 3],
        end: [8, 36, 3],
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [8, 11, 4],
        end: [8, 11, 4],
      },
      {
        code: 104,
        info: 'Unused variable "var2"',
        start: [8, 17, 4],
        end: [8, 17, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
