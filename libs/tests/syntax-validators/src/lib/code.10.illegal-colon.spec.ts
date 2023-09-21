import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects illegal colon`, () => {
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
    const code = [`:`];

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
        code: 10,
        info: 'Illegal colon. Colons are only allowed in braces for indexing and structures for property creation/setting',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] with reserved word in jump statement`, async () => {
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
    const code = [`break:`];

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
        code: 67,
        info: '"break" statements can only exist within a loop, case, or switch',
        start: [0, 0, 5],
        end: [0, 0, 5],
      },
      {
        code: 10,
        info: 'Illegal colon. Colons are only allowed in braces for indexing and structures for property creation/setting',
        start: [0, 5, 1],
        end: [0, 5, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] function call`, async () => {
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
    const code = [`myfunc(a:b)`];

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
        code: 14,
        info: 'Colon detected in function call. If indexing array, you should be using square brackets instead of parentheses. Using parentheses for array indexing is ambiguous and problematic when there is a function with the same name as the variable you are indexing.',
        start: [0, 0, 7],
        end: [0, 10, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [0, 7, 1],
        end: [0, 7, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [0, 9, 1],
        end: [0, 9, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] bad array syntax`, async () => {
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
    const code = [`myarr(a:b)`];

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
        code: 14,
        info: 'Colon detected in function call. If indexing array, you should be using square brackets instead of parentheses. Using parentheses for array indexing is ambiguous and problematic when there is a function with the same name as the variable you are indexing.',
        start: [0, 0, 6],
        end: [0, 9, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [0, 6, 1],
        end: [0, 6, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [0, 8, 1],
        end: [0, 8, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] ignore lambda functions`, async () => {
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
    const code = [`a = lambda(x:x+2)`];

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
});
