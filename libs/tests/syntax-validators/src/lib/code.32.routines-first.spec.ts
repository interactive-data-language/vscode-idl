import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects invalid tokens before routine definition`, () => {
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
      `@include`,
      ``,
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
        start: [9, 0, 9],
        end: [9, 0, 9],
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
      `; this is OK`,
      `this = wrong * 5`,
      ``,
      `; this is OK too`,
      `function myfunc`,
      `  compile_opt idl2`,
      `  return,1`,
      `end`,
      ``,
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
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [9, 0, 12],
        end: [9, 0, 12],
      },
      {
        code: 32,
        info: 'Only procedure or function definitions are allowed before an existing procedure or function definition. Please use a main level program instead.',
        start: [1, 5, 1],
        end: [1, 16, 0],
      },
      {
        code: 32,
        info: 'Only procedure or function definitions are allowed before an existing procedure or function definition. Please use a main level program instead.',
        start: [1, 0, 4],
        end: [1, 0, 4],
      },
      {
        code: 99,
        info: 'Undefined variable "this"',
        start: [1, 0, 4],
        end: [1, 0, 4],
      },
      {
        code: 99,
        info: 'Undefined variable "wrong"',
        start: [1, 7, 5],
        end: [1, 7, 5],
      },
      {
        code: 104,
        info: 'Unused variable "something"',
        start: [10, 0, 9],
        end: [10, 0, 9],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
