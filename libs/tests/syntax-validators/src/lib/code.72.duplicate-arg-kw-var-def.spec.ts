import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Find duplicate arg and keyword variables and detect`, () => {
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
      `pro mypro, a, b, AKW = akw, BKW = bkw`,
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
        start: [0, 23, 3],
        end: [0, 23, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "bkw"',
        start: [0, 34, 3],
        end: [0, 34, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 11, 1],
        end: [0, 11, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [0, 14, 1],
        end: [0, 14, 1],
        canReport: true,
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
      `pro mypro, a, a, b, B = b, C = b`,
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
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 11, 1],
        end: [0, 11, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 14, 1],
        end: [0, 14, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 17, 1],
        end: [0, 17, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 24, 1],
        end: [0, 24, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 31, 1],
        end: [0, 31, 1],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [0, 24, 1],
        end: [0, 24, 1],
        canReport: true,
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
      `pro myclass::mymethod, a, a, b, B = b, C = b`,
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
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 23, 1],
        end: [0, 23, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 26, 1],
        end: [0, 26, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 29, 1],
        end: [0, 29, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 36, 1],
        end: [0, 36, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 43, 1],
        end: [0, 43, 1],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [0, 36, 1],
        end: [0, 36, 1],
        canReport: true,
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
      `function myfunc, a, a, b, B = b, C = b`,
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
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 17, 1],
        end: [0, 17, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 20, 1],
        end: [0, 20, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 23, 1],
        end: [0, 23, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 30, 1],
        end: [0, 30, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 37, 1],
        end: [0, 37, 1],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [0, 30, 1],
        end: [0, 30, 1],
        canReport: true,
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
      `function myclass::mymethod, a, a, b, B = b, C = b`,
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
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 28, 1],
        end: [0, 28, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 31, 1],
        end: [0, 31, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 34, 1],
        end: [0, 34, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 41, 1],
        end: [0, 41, 1],
        canReport: true,
      },
      {
        code: 72,
        info: 'More than one argument or keyword variable has the same name',
        start: [0, 48, 1],
        end: [0, 48, 1],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "b"',
        start: [0, 41, 1],
        end: [0, 41, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
