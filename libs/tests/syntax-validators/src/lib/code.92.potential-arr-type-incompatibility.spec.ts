import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Array data type incompatibility`, () => {
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
      `;+`,
      `; :Arguments:`,
      `;   arg1: in, required, Array<Number | String>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: in, required, Array<Byte>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg5: in, required, Array<ENVIRaster>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro array_incompatibility, arg1, arg4, arg5`,
      `  compile_opt idl2`,
      ``,
      `  ; OK`,
      `  a = arg1 + arg4`,
      ``,
      `  ; bad`,
      `  b = arg1 + arg4 + arg5`,
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
        code: 92,
        info: 'Potential type incompatibility found when attempting to resolve types of merged arrays',
        start: [17, 6, 4],
        end: [17, 20, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [14, 2, 1],
        end: [14, 2, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [17, 2, 1],
        end: [17, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
