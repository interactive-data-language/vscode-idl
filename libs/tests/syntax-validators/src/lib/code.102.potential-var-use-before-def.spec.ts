import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Use variable before it is defined`, () => {
  it(`[auto generated] when we dont have a common-block present`, async () => {
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
      `pro before_defined_common`,
      `compile_opt idl2`,
      `common`,
      ``,
      `; problemo`,
      `a = b`,
      ``,
      `; define`,
      `b = 5`,
      ``,
      `; complex problem0`,
      `c = d + (d = 5)`,
      ``,
      `; no problemo`,
      `f = (g = 6) + g`,
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
        code: 102,
        info: 'Variable is potentially used before definition "b"',
        start: [5, 4, 1],
        end: [5, 4, 1],
        canReport: true,
      },
      {
        code: 102,
        info: 'Variable is potentially used before definition "d"',
        start: [11, 4, 1],
        end: [11, 4, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [5, 0, 1],
        end: [5, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [11, 0, 1],
        end: [11, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "f"',
        start: [14, 0, 1],
        end: [14, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
