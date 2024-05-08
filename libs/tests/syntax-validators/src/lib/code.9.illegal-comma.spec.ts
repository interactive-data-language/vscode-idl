import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects illegal commas`, () => {
  it(`[auto generated] after assignment`, async () => {
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
    const code = [`a = ,`];

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
        start: [0, 2, 1],
        end: [0, 4, 0],
        canReport: true,
      },
      {
        code: 9,
        info: 'Illegal comma',
        start: [0, 4, 1],
        end: [0, 4, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] standalone`, async () => {
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
    const code = [`,`];

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
        code: 9,
        info: 'Illegal comma',
        start: [0, 0, 1],
        end: [0, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] in right place`, async () => {
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
    const code = [`a = something()`, `,`];

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
        code: 9,
        info: 'Illegal comma',
        start: [1, 0, 1],
        end: [1, 0, 1],
        canReport: true,
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 1],
        end: [0, 0, 1],
        canReport: true,
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [1, 0, 1.7976931348623157e308],
        end: [1, 0, 1.7976931348623157e308],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] in parentheses`, async () => {
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
    const code = [`a = (,)`];

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
        code: 9,
        info: 'Illegal comma',
        start: [0, 5, 1],
        end: [0, 5, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] in switch`, async () => {
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
      `switch a, of`,
      ` , !true: , `,
      `endswitch`,
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
        code: 9,
        info: 'Illegal comma',
        start: [1, 8, 2],
        end: [1, 8, 2],
        canReport: true,
      },
      {
        code: 9,
        info: 'Illegal comma',
        start: [2, 1, 2],
        end: [2, 1, 2],
        canReport: true,
      },
      {
        code: 9,
        info: 'Illegal comma',
        start: [2, 10, 2],
        end: [2, 10, 2],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [1, 7, 1],
        end: [1, 7, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] in case`, async () => {
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
      `case a, of`,
      ` , !true: , `,
      `endcase`,
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
        code: 9,
        info: 'Illegal comma',
        start: [1, 6, 2],
        end: [1, 6, 2],
        canReport: true,
      },
      {
        code: 9,
        info: 'Illegal comma',
        start: [2, 1, 2],
        end: [2, 1, 2],
        canReport: true,
      },
      {
        code: 9,
        info: 'Illegal comma',
        start: [2, 10, 2],
        end: [2, 10, 2],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [1, 5, 1],
        end: [1, 5, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] in ternary`, async () => {
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
    const code = [`a = !true ? ,'bad' : ,'still bad'`];

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
        start: [0, 10, 1],
        end: [0, 12, 0],
        canReport: true,
      },
      {
        code: 9,
        info: 'Illegal comma',
        start: [0, 12, 1],
        end: [0, 12, 1],
        canReport: true,
      },
      {
        code: 7,
        info: 'Unknown token encountered. Verify syntax and expression is allowed.',
        start: [0, 19, 3],
        end: [0, 19, 3],
        canReport: true,
      },
      {
        code: 108,
        info: 'Standalone expression detected. One or more statements need to be assigned to a variable or have a value assigned to them.',
        start: [0, 13, 5],
        end: [0, 22, 11],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
