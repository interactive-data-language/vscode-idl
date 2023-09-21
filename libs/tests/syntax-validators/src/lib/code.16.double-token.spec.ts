import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects two tokens next to each other`, () => {
  it(`[auto generated] variables`, async () => {
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
    const code = [`procedure, var1 var2`];

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
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [0, 11, 4],
        end: [0, 16, 4],
      },
      {
        code: 99,
        info: 'Undefined variable "var1"',
        start: [0, 11, 4],
        end: [0, 11, 4],
      },
      {
        code: 99,
        info: 'Undefined variable "var2"',
        start: [0, 16, 4],
        end: [0, 16, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] functions`, async () => {
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
    const code = [`func1() func2()`];

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
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [0, 0, 6],
        end: [0, 8, 6],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] operators`, async () => {
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
    const code = [`a + + b`];

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
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [0, 2, 1],
        end: [0, 4, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [0, 6, 1],
        end: [0, 6, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] commas`, async () => {
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
    const code = [`mypro,,`];

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
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [0, 5, 1],
        end: [0, 6, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] valid structures`, async () => {
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
    const code = [`a = {mystruct, {known:val}}`];

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
        code: 77,
        info: 'No matching structure/object/class definition for structure named "mystruct"',
        start: [0, 5, 8],
        end: [0, 5, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "val"',
        start: [0, 22, 3],
        end: [0, 22, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] bad structures`, async () => {
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
    const code = [`a = {{known:val}}`];

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
        code: 1,
        info: 'Unexpected closing statement',
        start: [0, 16, 1],
        end: [0, 16, 1],
      },
      {
        code: 17,
        info: 'Illegal structure declaration',
        start: [0, 5, 1],
        end: [0, 5, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "val"',
        start: [0, 12, 3],
        end: [0, 12, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] ignore comments`, async () => {
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
    const code = [`; first`, `;second`];

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

  it(`[auto generated] OK separate lines`, async () => {
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
    const code = [`pro1`, `pro2`];

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
        start: [0, 0, 4],
        end: [0, 0, 4],
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [1, 0, 1.7976931348623157e308],
        end: [1, 0, 1.7976931348623157e308],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] All of these operators can be next to each other`, async () => {
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
      `a = b && ~c && d`,
      `a = b || ~c || d`,
      `a = b not ~c not d`,
      `a = b eq ~c eq d`,
      `a = b ne ~c ne d`,
      `a = b le ~c le d`,
      `a = b lt ~c lt d`,
      `a = b ge ~c gt d`,
      `a = b gt ~c gt d`,
      `a = b and ~c and d`,
      `a = b or ~c or d`,
      `a = b xor ~c xor d`,
      `a = b.prop.prop.prop`,
      `a = 42 & b = 42 & c = 42`,
      `tol = (N_ELEMENTS(tolIn) eq 1) ? tolIn[0] : use_double ? 2d-12 : 1e-5`,
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
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [1, 4, 1],
        end: [1, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [1, 10, 1],
        end: [1, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [1, 15, 1],
        end: [1, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [2, 4, 1],
        end: [2, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [2, 10, 1],
        end: [2, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [2, 15, 1],
        end: [2, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [3, 4, 1],
        end: [3, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [3, 11, 1],
        end: [3, 11, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [3, 17, 1],
        end: [3, 17, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [4, 4, 1],
        end: [4, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [4, 10, 1],
        end: [4, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [4, 15, 1],
        end: [4, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [5, 4, 1],
        end: [5, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [5, 10, 1],
        end: [5, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [5, 15, 1],
        end: [5, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [6, 4, 1],
        end: [6, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [6, 10, 1],
        end: [6, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [6, 15, 1],
        end: [6, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [7, 4, 1],
        end: [7, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [7, 10, 1],
        end: [7, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [7, 15, 1],
        end: [7, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [8, 4, 1],
        end: [8, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [8, 10, 1],
        end: [8, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [8, 15, 1],
        end: [8, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [9, 4, 1],
        end: [9, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [9, 10, 1],
        end: [9, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [9, 15, 1],
        end: [9, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [10, 4, 1],
        end: [10, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [10, 11, 1],
        end: [10, 11, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [10, 17, 1],
        end: [10, 17, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [11, 4, 1],
        end: [11, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [11, 10, 1],
        end: [11, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [11, 15, 1],
        end: [11, 15, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [12, 4, 1],
        end: [12, 4, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "c"',
        start: [12, 11, 1],
        end: [12, 11, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [12, 17, 1],
        end: [12, 17, 1],
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [13, 4, 1],
        end: [13, 4, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "use_double"',
        start: [15, 44, 10],
        end: [15, 44, 10],
      },
      {
        code: 104,
        info: 'Unused variable "tol"',
        start: [15, 0, 3],
        end: [15, 0, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] ignore template escape characters`, async () => {
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
    const code = [`a = \`\\r\\r\\n\\n\``];

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
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] ignore nested function methods (caught elsewhere)`, async () => {
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
    const code = [`a = var.myfunc().ohNotOk()`];

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
        start: [0, 7, 8],
        end: [0, 25, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [0, 4, 3],
        end: [0, 4, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
