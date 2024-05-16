import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Extracts semantic tokens`, () => {
  it(`[auto generated] for notebook cells`, async () => {
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
    const code = [`compile_opt idl2`, `arr = [1,2,3,4]`, `arr`, `end`];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true, isNotebook: true }
    );

    // define expected tokens
    const expected = [2, 0, 3, 1, 1];

    // verify results
    expect(tokenized.semantic.built.data).toEqual(expected);
  });
});
