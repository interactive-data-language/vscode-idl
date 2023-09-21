import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Find duplicate keyword definitions`, () => {
  it(`[auto generated] no problems when OK`, async () => {
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
      `pro mypro, AKW = akw, BKW = bkw`,
      `  compile_opt idl2`,
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
        info: 'Unused variable "akw"',
        start: [0, 17, 3],
        end: [0, 17, 3],
      },
      {
        code: 104,
        info: 'Unused variable "bkw"',
        start: [0, 28, 3],
        end: [0, 28, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems in procedures`, async () => {
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
      `pro mypro, AKW = akw, AKW = bkw`,
      `  compile_opt idl2`,
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
        code: 73,
        info: 'More than one keyword has the same name',
        start: [0, 11, 3],
        end: [0, 11, 3],
      },
      {
        code: 73,
        info: 'More than one keyword has the same name',
        start: [0, 22, 3],
        end: [0, 22, 3],
      },
      {
        code: 104,
        info: 'Unused variable "akw"',
        start: [0, 17, 3],
        end: [0, 17, 3],
      },
      {
        code: 104,
        info: 'Unused variable "bkw"',
        start: [0, 28, 3],
        end: [0, 28, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems in procedure methods`, async () => {
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
      `pro myclass::mypro, AKW = akw, AKW = bkw`,
      `  compile_opt idl2`,
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
        code: 73,
        info: 'More than one keyword has the same name',
        start: [0, 20, 3],
        end: [0, 20, 3],
      },
      {
        code: 73,
        info: 'More than one keyword has the same name',
        start: [0, 31, 3],
        end: [0, 31, 3],
      },
      {
        code: 104,
        info: 'Unused variable "akw"',
        start: [0, 26, 3],
        end: [0, 26, 3],
      },
      {
        code: 104,
        info: 'Unused variable "bkw"',
        start: [0, 37, 3],
        end: [0, 37, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems in functions`, async () => {
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
      `function myfunc, AKW = akw, AKW = bkw`,
      `  compile_opt idl2`,
      `  return, 1`,
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
        code: 73,
        info: 'More than one keyword has the same name',
        start: [0, 17, 3],
        end: [0, 17, 3],
      },
      {
        code: 73,
        info: 'More than one keyword has the same name',
        start: [0, 28, 3],
        end: [0, 28, 3],
      },
      {
        code: 104,
        info: 'Unused variable "akw"',
        start: [0, 23, 3],
        end: [0, 23, 3],
      },
      {
        code: 104,
        info: 'Unused variable "bkw"',
        start: [0, 34, 3],
        end: [0, 34, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems in function methods`, async () => {
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
      `function myfunc::mymethod, AKW = akw, AKW = bkw`,
      `  compile_opt idl2`,
      `  return, 1`,
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
        code: 73,
        info: 'More than one keyword has the same name',
        start: [0, 27, 3],
        end: [0, 27, 3],
      },
      {
        code: 73,
        info: 'More than one keyword has the same name',
        start: [0, 38, 3],
        end: [0, 38, 3],
      },
      {
        code: 104,
        info: 'Unused variable "akw"',
        start: [0, 33, 3],
        end: [0, 33, 3],
      },
      {
        code: 104,
        info: 'Unused variable "bkw"',
        start: [0, 44, 3],
        end: [0, 44, 3],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
