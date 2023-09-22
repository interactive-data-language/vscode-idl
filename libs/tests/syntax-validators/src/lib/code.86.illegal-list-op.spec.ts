import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Illegal list`, () => {
  it(`[auto generated] operations`, async () => {
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
      `pro list_checks`,
      `compile_opt idl2`,
      ``,
      `a = 1 + list()`,
      ``,
      `b = list() + list()`,
      ``,
      `c = list() + hash()`,
      ``,
      `d = list() + orderedhash()`,
      ``,
      `e = list() + dictionary()`,
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
        code: 86,
        info: 'Illegal use of lists. When using operators with lists, all types must be list',
        start: [3, 4, 1],
        end: [3, 13, 1],
      },
      {
        code: 86,
        info: 'Illegal use of lists. When using operators with lists, all types must be list',
        start: [7, 4, 5],
        end: [7, 18, 1],
      },
      {
        code: 86,
        info: 'Illegal use of lists. When using operators with lists, all types must be list',
        start: [9, 4, 5],
        end: [9, 25, 1],
      },
      {
        code: 86,
        info: 'Illegal use of lists. When using operators with lists, all types must be list',
        start: [11, 4, 5],
        end: [11, 24, 1],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [3, 0, 1],
        end: [3, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [5, 0, 1],
        end: [5, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [7, 0, 1],
        end: [7, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "d"',
        start: [9, 0, 1],
        end: [9, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "e"',
        start: [11, 0, 1],
        end: [11, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
