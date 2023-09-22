import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] De-referencing noting`, () => {
  it(`[auto generated] with asterisks`, async () => {
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
      `  compile_opt idl2`,
      ``,
      `  ; yikes`,
      `  a = *`,
      ``,
      `  ; bad`,
      `  b = (*)`,
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
        code: 93,
        info: 'Found pointer de-reference, but nothing to operate on',
        start: [4, 6, 1],
        end: [4, 7, 0],
      },
      {
        code: 93,
        info: 'Found pointer de-reference, but nothing to operate on',
        start: [7, 7, 1],
        end: [7, 8, 0],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [4, 2, 1],
        end: [4, 2, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [7, 2, 1],
        end: [7, 2, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
