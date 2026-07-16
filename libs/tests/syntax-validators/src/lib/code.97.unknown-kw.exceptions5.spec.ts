import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Regression for IDLffShape`, () => {
  it(`[auto generated] to not throw errors`, async () => {
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
      `; main`,
      `compile_opt idl2`,
      ``,
      `; no error`,
      `shp = idlffshape()`,
      `shp.getProperty, attribute_names = attNames, n_entities = nEnts`,
      ``,
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
        code: 104,
        info: 'Unused variable "attNames"',
        start: [5, 35, 8],
        end: [5, 35, 8],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "nEnts"',
        start: [5, 58, 5],
        end: [5, 58, 5],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expected);
  });
});
