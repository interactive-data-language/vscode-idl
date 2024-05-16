import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Extracts semantic tokens`, () => {
  it(`[auto generated] for basic case`, async () => {
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
      `compile_opt idl2`,
      `a = envi.api_version`,
      `!null = envi.openRaster('somefile.dat')`,
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
    const expected = [1, 4, 4, 0, 0, 1, 8, 4, 0, 0];

    // verify results
    expect(tokenized.semantic.built.data).toEqual(expected);
  });
});
