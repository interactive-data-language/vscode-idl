import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects when the returns tag has too much information`, () => {
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
      `; :Params:`,
      `;   var1: in, optional, boolean, public`,
      `;     My favorite argument`,
      `; :Returns: number`,
      `;-`,
      `function myfunc, var1`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [6, 17, 4],
        end: [6, 17, 4],
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
      `; :Params:`,
      `;   var1: in, optional, boolean, public`,
      `;     My favorite argument`,
      `; :Returns: number`,
      `;   Fun fact about zach`,
      `;   he is a vegetarian`,
      `;-`,
      `function myfunc, var1`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 61,
        info: 'The returns documentation should only contain the data type that is returned. For example: ":Returns: float"',
        start: [4, 3, 9],
        end: [6, 0, 22],
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [8, 17, 4],
        end: [8, 17, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] no problem with extra spaces`, async () => {
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
      `; :Params:`,
      `;   var1: in, optional, boolean, public`,
      `;     My favorite argument`,
      `; :Returns: number`,
      `;`,
      `;`,
      `;`,
      `;-`,
      `function myfunc, var1`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [9, 17, 4],
        end: [9, 17, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
