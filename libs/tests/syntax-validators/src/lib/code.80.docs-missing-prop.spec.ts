import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Check for missing properties`, () => {
  it(`[auto generated] in our docs`, async () => {
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
      `;+`,
      `; :MyStruct:`,
      `;   prop: any`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro pro4__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1, prop2: 4}`,
      ``,
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
        code: 80,
        info: 'Property is missing from documentation: "prop2"',
        start: [9, 51, 6],
        end: [9, 51, 6],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
