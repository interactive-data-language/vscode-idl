import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects statements that don't expect a comma first`, () => {
  it(`[auto generated] verify braces are caught`, async () => {
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
    const code = [`pro mypro`, `  compile_opt idl2`, `  a = b[,]`, `end`];

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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [2, 7, 1],
        end: [2, 8, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [2, 6, 1],
        end: [2, 6, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 2, 1],
        end: [2, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify compile_opt is caught`, async () => {
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
    const code = [`pro mypro`, `  compile_opt, idl2`, `end`];

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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [1, 2, 11],
        end: [1, 13, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify common blocks are caught`, async () => {
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
    const code = [`pro mypro`, `  compile_opt idl2`, `  common, named`, `end`];

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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [2, 2, 6],
        end: [2, 8, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "named"',
        start: [2, 10, 5],
        end: [2, 10, 5],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify forward function is caught`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  forward_function, funcy`,
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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [2, 2, 16],
        end: [2, 18, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify function calls are caught`, async () => {
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
    const code = [`pro mypro`, `  compile_opt idl2`, `  a = func(,)`, `end`];

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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [2, 6, 5],
        end: [2, 11, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 2, 1],
        end: [2, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify function method calls are caught`, async () => {
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
    const code = [`pro mypro`, `  compile_opt idl2`, `  a = b.func(,)`, `end`];

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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [2, 7, 6],
        end: [2, 13, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [2, 6, 1],
        end: [2, 6, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 2, 1],
        end: [2, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify for loops are caught`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  for, i=0,100 do print, i`,
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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [2, 2, 3],
        end: [2, 5, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify foreach loops are caught`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  foreach, val, arr do print, val`,
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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [2, 2, 7],
        end: [2, 9, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "val"',
        start: [2, 11, 3],
        end: [2, 11, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "arr"',
        start: [2, 16, 3],
        end: [2, 16, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "val"',
        start: [2, 30, 3],
        end: [2, 30, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify structures are caught`, async () => {
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
    const code = [`pro mypro`, `  compile_opt idl2`, `  a = {,name}`, `end`];

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
        code: 44,
        info: 'Comma not allowed immediately after statement',
        start: [2, 6, 1],
        end: [2, 7, 1],
        canReport: true,
      },
      {
        code: 77,
        info: 'No matching structure/object/class definition for structure named "name"',
        start: [2, 8, 4],
        end: [2, 8, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 2, 1],
        end: [2, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
