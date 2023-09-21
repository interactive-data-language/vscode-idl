import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects invalid text after line continuations`, () => {
  it(`[auto generated] no problems with nothing after continuation`, async () => {
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
    const code = [`compile_opt idl2`, `something = $`, `  5`, `end`];

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
        start: [1, 0, 9],
        end: [1, 0, 9],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] no problems with comment`, async () => {
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
    const code = [`compile_opt idl2`, `something = $ ; ok`, `  5`, `end`];

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
        start: [1, 0, 9],
        end: [1, 0, 9],
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
    const code = [`compile_opt idl2`, `something = $ bad`, `  5`, `end`];

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
        code: 7,
        info: 'Unknown token encountered. Verify syntax and expression is allowed.',
        start: [1, 14, 3],
        end: [1, 14, 3],
      },
      {
        code: 35,
        info: 'Only comments are allowed after line continuations. This helps prevent accidental bugs.',
        start: [1, 12, 1],
        end: [1, 14, 3],
      },
      {
        code: 104,
        info: 'Unused variable "something"',
        start: [1, 0, 9],
        end: [1, 0, 9],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems, same location as previous test`, async () => {
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
    const code = [`compile_opt idl2`, `something = $ bad ; ok`, `  5`, `end`];

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
        code: 7,
        info: 'Unknown token encountered. Verify syntax and expression is allowed.',
        start: [1, 14, 4],
        end: [1, 14, 4],
      },
      {
        code: 35,
        info: 'Only comments are allowed after line continuations. This helps prevent accidental bugs.',
        start: [1, 12, 1],
        end: [1, 14, 4],
      },
      {
        code: 104,
        info: 'Unused variable "something"',
        start: [1, 0, 9],
        end: [1, 0, 9],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
