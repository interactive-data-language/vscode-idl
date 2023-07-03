import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects empty main level programs`, () => {
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
    const code = [`; main level`, `compile_opt idl2`, `something = 42`, `end`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "something"',
        start: [2, 0, 9],
        end: [2, 0, 9],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] all the problems`, async () => {
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
    const code = [`; main level`, `end`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 12],
        end: [0, 0, 12],
      },
      {
        code: 34,
        info: 'Main level programs cannot be empty. IDL expects statements besides comments and "end".',
        start: [0, 0, 12],
        end: [1, 0, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] also problems`, async () => {
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
    const code = [``, `end`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [1, 0, 3],
        end: [1, 0, 3],
      },
      {
        code: 34,
        info: 'Main level programs cannot be empty. IDL expects statements besides comments and "end".',
        start: [1, 0, 3],
        end: [1, 0, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
