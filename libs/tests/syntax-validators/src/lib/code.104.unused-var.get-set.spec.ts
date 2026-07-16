import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Unused variable`, () => {
  it(`[auto generated] behavior for get/set methods`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      ``,
      `shp = IDLffShape()`,
      `shp.getProperty, entity_type = foo`,
      `shp.setProperty, entity_type = bar`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true },
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 99,
        info: 'Undefined variable "bar"',
        start: [4, 31, 3],
        end: [4, 31, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "foo"',
        start: [3, 31, 3],
        end: [3, 31, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expected);
  });
});
