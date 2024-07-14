import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Pointer de-ref without pointers`, () => {
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
      `;   arg1: in, required, Pointer<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg2: in, required, Array<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg3: in, required, Array<Pointer<ENVIRaster>>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: in, required, Pointer<Number> | String`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg5: in, required, Pointer<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg6: in, required, Pointer<String> | Pointer<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro pointers, arg1, arg2, arg3, arg4, arg5, arg6`,
      `  compile_opt idl3`,
      ``,
      `  ; number`,
      `  a = *arg1`,
      ``,
      `  ; enviraster`,
      `  b = *arg3[0]`,
      ``,
      `  ; any, unable to de-reference`,
      `  d = *5`,
      ``,
      `  ; any`,
      `  f = *arg5`,
      ``,
      `  ; union of type args`,
      `  g = *arg6`,
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
        code: 94,
        info: 'Pointer de-referencing can only be used with pointer data types',
        start: [26, 6, 1],
        end: [26, 8, 0],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "arg2"',
        start: [16, 20, 4],
        end: [16, 20, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "arg4"',
        start: [16, 32, 4],
        end: [16, 32, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [20, 2, 1],
        end: [20, 2, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [23, 2, 1],
        end: [23, 2, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "d"',
        start: [26, 2, 1],
        end: [26, 2, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "f"',
        start: [29, 2, 1],
        end: [29, 2, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "g"',
        start: [32, 2, 1],
        end: [32, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
