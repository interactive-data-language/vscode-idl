import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Find keyword usage and detect problems in`, () => {
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
    const code = [
      `; main level program`,
      `compile_opt idl2`,
      `plot, kw1=5, KW1=5, kw1=5, /KW1`,
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
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 6, 3],
        end: [2, 6, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 13, 3],
        end: [2, 13, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 20, 3],
        end: [2, 20, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 27, 4],
        end: [2, 27, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] procedure methods`, async () => {
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
      `; main level program`,
      `compile_opt idl2`,
      `a.plot, kw1=5, KW1=5, kw1=5, /KW1`,
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
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 8, 3],
        end: [2, 8, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 15, 3],
        end: [2, 15, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 22, 3],
        end: [2, 22, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 29, 4],
        end: [2, 29, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
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
    const code = [
      `; main level program`,
      `compile_opt idl2`,
      `a = plot(kw1=5, KW1=5, kw1=5, /KW1)`,
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
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 9, 3],
        end: [2, 9, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 16, 3],
        end: [2, 16, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 23, 3],
        end: [2, 23, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 30, 4],
        end: [2, 30, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] function methods`, async () => {
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
      `; main level program`,
      `compile_opt idl2`,
      `a = b.plot(kw1=5, KW1=5, kw1=5, /KW1)`,
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
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 11, 3],
        end: [2, 11, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 18, 3],
        end: [2, 18, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 25, 3],
        end: [2, 25, 3],
        canReport: true,
      },
      {
        code: 75,
        info: 'Keywords can only be used once in routine or method calls',
        start: [2, 32, 4],
        end: [2, 32, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [2, 4, 1],
        end: [2, 4, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
