import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detect standalone expressions`, () => {
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
    const code = [`compile_opt idl2`, `a = 5`, `a++`, `++a`, `a++`, `end`];

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
      `compile_opt idl2`,
      `@includeme`,
      `repeat *val = 42 until *var`,
      `repeat if !true then continue until !true`,
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
        code: 99,
        info: 'Undefined variable "val"',
        start: [2, 8, 3],
        end: [2, 8, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [2, 24, 3],
        end: [2, 24, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] indexing`, async () => {
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
      `compile_opt idl2`,
      `arr = [42, 84, 126]`,
      `arr[5] = 6`,
      `arr[5] += 6`,
      `arr[5] +`,
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
        code: 68,
        info: 'Expected IDL statement or expression after, but none was found',
        start: [4, 7, 1],
        end: [4, 8, 0],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [4, 0, 3],
        end: [4, 8, 0],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems`, async () => {
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
      `compile_opt idl2`,
      `a = 5`,
      `2 + 2`,
      `(a)`,
      `plot() + 5`,
      `plot()`,
      `a->`,
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
        code: 8,
        info: 'Arrow functions must be followed by the method name or super::method name and cannot be split between lines',
        start: [6, 1, 2],
        end: [6, 1, 2],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [2, 0, 1],
        end: [2, 5, 0],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [3, 0, 1],
        end: [3, 2, 1],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [4, 0, 5],
        end: [4, 10, 0],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [5, 0, 5],
        end: [5, 5, 1],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [6, 0, 1],
        end: [6, 1, 2],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] multi-line problems`, async () => {
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
    const code = [`compile_opt idl2`, `2 + $`, `  2 + $`, `  2`, `end`];

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
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [1, 0, 1],
        end: [3, 3, 0],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
