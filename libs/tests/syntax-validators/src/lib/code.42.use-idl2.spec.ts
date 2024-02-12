import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects compile opt without options`, () => {
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
      `  compile_opt defint32, strictarr`,
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
        code: 42,
        info: 'Use the "idl2" compile option instead. It is shorthand for "compile_opt defint32, strictarr".',
        start: [1, 14, 8],
        end: [1, 14, 8],
        canReport: true,
      },
      {
        code: 42,
        info: 'Use the "idl2" compile option instead. It is shorthand for "compile_opt defint32, strictarr".',
        start: [1, 24, 9],
        end: [1, 24, 9],
        canReport: true,
      },
      {
        code: 39,
        info: '"idl2" was not found as a compile option and should always be one',
        start: [1, 2, 11],
        end: [1, 33, 0],
        canReport: true,
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
      `  compile_opt defint32, strictarr`,
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
        code: 42,
        info: 'Use the "idl2" compile option instead. It is shorthand for "compile_opt defint32, strictarr".',
        start: [1, 14, 8],
        end: [1, 14, 8],
        canReport: true,
      },
      {
        code: 42,
        info: 'Use the "idl2" compile option instead. It is shorthand for "compile_opt defint32, strictarr".',
        start: [1, 24, 9],
        end: [1, 24, 9],
        canReport: true,
      },
      {
        code: 39,
        info: '"idl2" was not found as a compile option and should always be one',
        start: [1, 2, 11],
        end: [1, 33, 0],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
