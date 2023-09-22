import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Not enough parameters for properties`, () => {
  it(`[auto generated] without anything`, async () => {
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
      `; :NYStruct0:`,
      `;   prop1:`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `; :NYStruct:`,
      `;   prop2:  `,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro pro3__define`,
      `  compile_opt idl3`,
      ``,
      `  !null = {NYStruct0, prop1: 5}`,
      ``,
      `  !null = {NYStruct, inherits NYStruct0, prop2: 6}`,
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
        code: 82,
        info: 'Not enough documentation arguments for property. Expected the pattern "propertyName: dataType"',
        start: [2, 0, 10],
        end: [2, 0, 10],
      },
      {
        code: 82,
        info: 'Not enough documentation arguments for property. Expected the pattern "propertyName: dataType"',
        start: [6, 0, 12],
        end: [6, 0, 12],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

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
      `; :NYStruct0:`,
      `;   prop1: any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `; :NYStruct:`,
      `;   prop2: String | number`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro pro3__define`,
      `  compile_opt idl3`,
      ``,
      `  !null = {NYStruct0, prop1: 5}`,
      ``,
      `  !null = {NYStruct, inherits NYStruct0, prop2: 6}`,
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
});
