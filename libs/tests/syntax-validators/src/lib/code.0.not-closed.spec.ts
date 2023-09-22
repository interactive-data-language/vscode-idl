import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects problems with statements not being closed`, () => {
  it(`[auto generated] parentheses`, async () => {
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
    const code = [`(`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
      {
        code: 68,
        info: 'Expected IDL statement or expression after, but none was found',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] brackets`, async () => {
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
    const code = [`[`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] structures`, async () => {
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
    const code = [`{`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 1],
        end: [0, 0, 1],
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
    const code = [`myfunc(`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 7],
        end: [0, 0, 7],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] blocks`, async () => {
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
    const code = [`begin`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 5],
        end: [0, 0, 5],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] switch`, async () => {
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
    const code = [`switch`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 6],
        end: [0, 0, 6],
      },
      {
        code: 68,
        info: 'Expected IDL statement or expression after, but none was found',
        start: [0, 0, 6],
        end: [0, 0, 6],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] case`, async () => {
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
    const code = [`case`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 4],
        end: [0, 0, 4],
      },
      {
        code: 68,
        info: 'Expected IDL statement or expression after, but none was found',
        start: [0, 0, 4],
        end: [0, 0, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] procedures`, async () => {
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
    const code = [`pro mypro`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 4],
        end: [0, 0, 4],
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 4],
        end: [0, 9, 0],
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
    const code = [`function myfunc`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 9],
        end: [0, 0, 9],
      },
      {
        code: 31,
        info: 'In function definitions, the "return" procedure must be present and have one value that it returns',
        start: [0, 0, 9],
        end: [0, 15, 0],
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 9],
        end: [0, 15, 0],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] across line boundaries`, async () => {
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
    const code = [`( $`, ` ;something`];

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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] only report last instance of unclosed in main`, async () => {
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
      `p = plot(var var, $`,
      `  plot(var var`,
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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [2, 2, 5],
        end: [2, 2, 5],
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [1, 9, 3],
        end: [1, 13, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [1, 9, 3],
        end: [1, 9, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [1, 13, 3],
        end: [1, 13, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [2, 7, 3],
        end: [2, 7, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [2, 11, 3],
        end: [2, 11, 3],
      },
      {
        code: 104,
        info: 'Unused variable "p"',
        start: [1, 0, 1],
        end: [1, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] only report last instance of unclosed in routine`, async () => {
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
      `pro myAwesomePro`,
      `compile_opt idl2`,
      `p = plot(var var, $`,
      `  plot(var var`,
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
        code: 0,
        info: 'Statement is not closed as expected',
        start: [3, 2, 5],
        end: [3, 2, 5],
      },
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [2, 9, 3],
        end: [2, 13, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [2, 9, 3],
        end: [2, 9, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [2, 13, 3],
        end: [2, 13, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [3, 7, 3],
        end: [3, 7, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "var"',
        start: [3, 11, 3],
        end: [3, 11, 3],
      },
      {
        code: 104,
        info: 'Unused variable "p"',
        start: [2, 0, 1],
        end: [2, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
