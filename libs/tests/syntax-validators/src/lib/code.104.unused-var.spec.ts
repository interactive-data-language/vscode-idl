import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Unused variable`, () => {
  it(`[auto generated] problems with args, kws, and vars`, async () => {
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
      `function test1, a, b, kw = kw`,
      `  compile_opt idl2`,
      `  c = 5`,
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
        code: 104,
        info: 'Unused variable "kw"',
        start: [0, 27, 2],
        end: [0, 27, 2],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 16, 1],
        end: [0, 16, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [0, 19, 1],
        end: [0, 19, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [2, 2, 1],
        end: [2, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] no problems when used`, async () => {
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
      `function test1, a, b, kw = kw`,
      `  compile_opt idl2`,
      `  c = 5`,
      `  !null = a + b + c + keyword_set(kw)`,
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
    const expected: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
