import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Check for bad access`, () => {
  it(`[auto generated] from function calls`, async () => {
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
      `pro so_bad`,
      `  compile_opt idl2`,
      `  a = myfunc().ohNo`,
      `  a = myfunc().(42)`,
      `  myfunc().ohMeOhMy`,
      `  a = myfunc().ohNotOk()`,
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
        code: 78,
        info: 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
        start: [2, 6, 7],
        end: [2, 14, 5],
      },
      {
        code: 78,
        info: 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
        start: [3, 6, 7],
        end: [3, 18, 1],
      },
      {
        code: 78,
        info: 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
        start: [4, 2, 7],
        end: [4, 19, 0],
      },
      {
        code: 78,
        info: 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
        start: [5, 6, 7],
        end: [5, 23, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] from function method calls`, async () => {
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
      `pro so_sad`,
      `  compile_opt idl2`,
      `  a = var.myfunc().ohNo`,
      `  a = var.myfunc().(42)`,
      `  var.myfunc().ohMeOhMy`,
      `  a = var.myfunc().ohNotOk()`,
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
        code: 78,
        info: 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
        start: [2, 9, 8],
        end: [2, 18, 5],
      },
      {
        code: 78,
        info: 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
        start: [3, 9, 8],
        end: [3, 22, 1],
      },
      {
        code: 78,
        info: 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
        start: [4, 5, 8],
        end: [4, 23, 0],
      },
      {
        code: 78,
        info: 'Function and function methods need to be wrapped in parentheses to be part of a chain of commands.',
        start: [5, 9, 8],
        end: [5, 27, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [2, 6, 3],
        end: [2, 6, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [3, 6, 3],
        end: [3, 6, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [4, 2, 3],
        end: [4, 2, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [5, 6, 3],
        end: [5, 6, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
