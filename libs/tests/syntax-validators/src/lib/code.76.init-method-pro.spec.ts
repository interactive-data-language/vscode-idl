import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Check for init methods`, () => {
  it(`[auto generated] being procedures incorrectly`, async () => {
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
    const code = [`pro mypro::init`, `  compile_opt idl2`, ``, `end`];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, true);

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 76,
        info: 'The "::init" method for object classes should be a function',
        start: [0, 0, 4],
        end: [0, 15, 0],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
