import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects multiple compile_opt statements`, () => {
  it(`[auto generated] bad function`, async () => {
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
      `function myfunc`,
      `  compile_opt idl2`,
      `  compile_opt idl2`,
      `  return,1`,
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
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [1, 2, 11],
        end: [1, 18, 0],
      },
      {
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [2, 2, 11],
        end: [2, 18, 0],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] bad procedure`, async () => {
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
      `pro mypro`,
      `  compile_opt idl2`,
      `  compile_opt idl2`,
      `  return`,
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
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [1, 2, 11],
        end: [1, 18, 0],
      },
      {
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [2, 2, 11],
        end: [2, 18, 0],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] bad main`, async () => {
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
    const code = [`  compile_opt idl2`, `  compile_opt idl2`, `end`];

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
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [0, 2, 11],
        end: [0, 18, 0],
      },
      {
        code: 45,
        info: 'There should be only one compile_opt statement per routine or main level program. While not a syntax error, this helps ensure consistency in your code.',
        start: [1, 2, 11],
        end: [1, 18, 0],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
