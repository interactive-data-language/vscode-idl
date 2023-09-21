import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects bad argument definitions`, () => {
  it(`[auto generated] ok args in routine`, async () => {
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
      `pro mypro, arg1, arg2, arg3, $`,
      `  arg4, arg5`,
      `  compile_opt idl2`,
      ``,
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
        info: 'Unused variable "arg1"',
        start: [0, 11, 4],
        end: [0, 11, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [0, 17, 4],
        end: [0, 17, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg3"',
        start: [0, 23, 4],
        end: [0, 23, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg4"',
        start: [1, 2, 4],
        end: [1, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg5"',
        start: [1, 8, 4],
        end: [1, 8, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] bad args in routine`, async () => {
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
      `pro mypro, arg1, arg2, arg3, $`,
      `  arg4, arg5, KW1 = kw1, $`,
      `  arg6, arg7`,
      `  compile_opt idl2`,
      ``,
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
        code: 47,
        info: 'Argument definitions should come before keyword definitions',
        start: [2, 2, 4],
        end: [2, 2, 4],
      },
      {
        code: 47,
        info: 'Argument definitions should come before keyword definitions',
        start: [2, 8, 4],
        end: [2, 8, 4],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [1, 20, 3],
        end: [1, 20, 3],
      },
      {
        code: 104,
        info: 'Unused variable "arg1"',
        start: [0, 11, 4],
        end: [0, 11, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [0, 17, 4],
        end: [0, 17, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg3"',
        start: [0, 23, 4],
        end: [0, 23, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg4"',
        start: [1, 2, 4],
        end: [1, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg5"',
        start: [1, 8, 4],
        end: [1, 8, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg6"',
        start: [2, 2, 4],
        end: [2, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg7"',
        start: [2, 8, 4],
        end: [2, 8, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] ok args in routine method`, async () => {
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
      `pro myclass::mymethod, arg1, arg2, arg3, $`,
      `  arg4, arg5`,
      `  compile_opt idl2`,
      ``,
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
        info: 'Unused variable "arg1"',
        start: [0, 23, 4],
        end: [0, 23, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [0, 29, 4],
        end: [0, 29, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg3"',
        start: [0, 35, 4],
        end: [0, 35, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg4"',
        start: [1, 2, 4],
        end: [1, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg5"',
        start: [1, 8, 4],
        end: [1, 8, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] bad args in routine method`, async () => {
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
      `pro myclass::mymethod, arg1, arg2, arg3, $`,
      `  arg4, arg5, KW1 = kw1, $`,
      `  arg6, arg7`,
      `  compile_opt idl2`,
      ``,
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
        code: 47,
        info: 'Argument definitions should come before keyword definitions',
        start: [2, 2, 4],
        end: [2, 2, 4],
      },
      {
        code: 47,
        info: 'Argument definitions should come before keyword definitions',
        start: [2, 8, 4],
        end: [2, 8, 4],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [1, 20, 3],
        end: [1, 20, 3],
      },
      {
        code: 104,
        info: 'Unused variable "arg1"',
        start: [0, 23, 4],
        end: [0, 23, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [0, 29, 4],
        end: [0, 29, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg3"',
        start: [0, 35, 4],
        end: [0, 35, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg4"',
        start: [1, 2, 4],
        end: [1, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg5"',
        start: [1, 8, 4],
        end: [1, 8, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg6"',
        start: [2, 2, 4],
        end: [2, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "arg7"',
        start: [2, 8, 4],
        end: [2, 8, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
