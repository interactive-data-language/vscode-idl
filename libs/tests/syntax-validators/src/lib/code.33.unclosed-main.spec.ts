import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects missing end to main level program`, () => {
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
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
      `compile_opt idl2`,
      `; main level`,
      `something = 42`,
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
        info: 'Unused variable "something"',
        start: [7, 0, 9],
        end: [7, 0, 9],
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
    const code = [
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
      `compile_opt idl2`,
      `; main level`,
      `something = 42`,
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
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [7, 0, 1.7976931348623157e308],
        end: [7, 0, 1.7976931348623157e308],
      },
      {
        code: 104,
        info: 'Unused variable "something"',
        start: [7, 0, 9],
        end: [7, 0, 9],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems after end`, async () => {
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
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
      `compile_opt idl2`,
      `; main level`,
      `something = 42`,
      `end`,
      `a = 17`,
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
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [9, 0, 1],
        end: [9, 0, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [9, 2, 1],
        end: [9, 2, 1],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [9, 4, 2],
        end: [9, 4, 2],
      },
      {
        code: 3,
        info: 'Token found after main level program. If this is incorrect, check your closing statements using "end"',
        start: [9, 6, 0],
        end: [9, 6, 0],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [9, 0, 1],
        end: [9, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "something"',
        start: [7, 0, 9],
        end: [7, 0, 9],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] not problem`, async () => {
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
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end ; -----------`,
      ``,
      `; main level`,
      `; another comment`,
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
