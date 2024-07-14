import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Check for args and keywords in procedure class definitions`, () => {
  it(`[auto generated] with arg`, async () => {
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
    const code = [`pro pro4__define, a`, `  compile_opt idl2`, ``, `end`];

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
        code: 81,
        info: 'Class definitions should not have any arguments or keywords',
        start: [0, 4, 12],
        end: [0, 19, 0],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 18, 1],
        end: [0, 18, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] with kw`, async () => {
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
    const code = [`pro pro4__define, KW = kw`, `  compile_opt idl2`, ``, `end`];

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
        code: 81,
        info: 'Class definitions should not have any arguments or keywords',
        start: [0, 4, 12],
        end: [0, 25, 0],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [0, 23, 2],
        end: [0, 23, 2],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] with both`, async () => {
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
      `pro pro4__define, arg, KW = kw`,
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
        code: 81,
        info: 'Class definitions should not have any arguments or keywords',
        start: [0, 4, 12],
        end: [0, 30, 0],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [0, 28, 2],
        end: [0, 28, 2],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "arg"',
        start: [0, 18, 3],
        end: [0, 18, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] ok with neither`, async () => {
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
    const code = [`pro pro4__define`, `  compile_opt idl2`, ``, `end`];

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
});
