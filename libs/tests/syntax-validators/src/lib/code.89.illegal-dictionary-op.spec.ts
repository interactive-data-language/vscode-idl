import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Illegal dictionary`, () => {
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
      `pro dictionary_checks`,
      `compile_opt idl2`,
      ``,
      `a = 1 + dictionary()`,
      ``,
      `b = dictionary() + list()`,
      ``,
      `c = dictionary() + hash()`,
      ``,
      `d = dictionary() + orderedhash()`,
      ``,
      `e = dictionary() + dictionary()`,
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
        code: 89,
        info: 'Illegal use of dictionaries. When using operators with dictionaries, all other arguments must be of type hash, ordered hash, or dictionaries',
        start: [3, 4, 1],
        end: [3, 19, 1],
      },
      {
        code: 89,
        info: 'Illegal use of dictionaries. When using operators with dictionaries, all other arguments must be of type hash, ordered hash, or dictionaries',
        start: [5, 4, 11],
        end: [5, 24, 1],
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
