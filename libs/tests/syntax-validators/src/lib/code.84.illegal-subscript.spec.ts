import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Illegal subscript`, () => {
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
      `;   arg2: in, required, List<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg3: in, required, Hash<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: in, required, OrderedHash<Byte>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg5: in, required, Dictionary<ENVIRaster>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro index_problems, arg1, arg2, arg3, arg4, arg5`,
      `  compile_opt idl3`,
      ``,
      `  ; for arrays`,
      `  a1 = arg1[*]`,
      `  a2 = arg1[0, 1, *]`,
      `  a3 = arg1[0, 1, 2]`,
      `  a4 = arg1[0 : -1 : 1]`,
      `  a5 = arg1[0, 1, *]`,
      ``,
      `  ; for lists`,
      `  l1 = arg2[*]`,
      `  l2 = arg2[0, 1, *]`,
      `  l3 = arg2[0, 1, 2]`,
      `  l4 = arg2[0 : -1 : 1]`,
      `  l5 = arg2[0, 1, *]`,
      ``,
      `  ; for hashes`,
      `  h1 = arg3[*]`,
      `  h2 = arg3[0, 1, *]`,
      `  h3 = arg3[0, 1, 2]`,
      `  h4 = arg3[0 : -1 : 1]`,
      `  h5 = arg3[0, 1, *]`,
      ``,
      `  ; for ordered hashes`,
      `  oh1 = arg4[*]`,
      `  oh2 = arg4[0, 1, *]`,
      `  oh3 = arg4[0, 1, 2]`,
      `  oh4 = arg4[0 : -1 : 1]`,
      `  oh5 = arg4[0, 1, *]`,
      ``,
      `  ; for dictionaries`,
      `  d1 = arg5[*]`,
      `  d2 = arg5[0, 1, *]`,
      `  d3 = arg5[0, 1, 2]`,
      `  d3 = arg5[0 : -1 : 1]`,
      `  d5 = arg5[0, 1, *]`,
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
        code: 84,
        info: 'Illegal subscript use. Subscripting using `:` is only valid for lists and arrays',
        start: [35, 11, 1],
        end: [35, 22, 1],
      },
      {
        code: 84,
        info: 'Illegal subscript use. Subscripting using `:` is only valid for lists and arrays',
        start: [42, 12, 1],
        end: [42, 23, 1],
      },
      {
        code: 84,
        info: 'Illegal subscript use. Subscripting using `:` is only valid for lists and arrays',
        start: [49, 11, 1],
        end: [49, 22, 1],
      },
      {
        code: 104,
        info: 'Unused variable "a1"',
        start: [18, 2, 2],
        end: [18, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a2"',
        start: [19, 2, 2],
        end: [19, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a3"',
        start: [20, 2, 2],
        end: [20, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a4"',
        start: [21, 2, 2],
        end: [21, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a5"',
        start: [22, 2, 2],
        end: [22, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "l1"',
        start: [25, 2, 2],
        end: [25, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "l2"',
        start: [26, 2, 2],
        end: [26, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "l3"',
        start: [27, 2, 2],
        end: [27, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "l4"',
        start: [28, 2, 2],
        end: [28, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "l5"',
        start: [29, 2, 2],
        end: [29, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "h1"',
        start: [32, 2, 2],
        end: [32, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "h2"',
        start: [33, 2, 2],
        end: [33, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "h3"',
        start: [34, 2, 2],
        end: [34, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "h4"',
        start: [35, 2, 2],
        end: [35, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "h5"',
        start: [36, 2, 2],
        end: [36, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "oh1"',
        start: [39, 2, 3],
        end: [39, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "oh2"',
        start: [40, 2, 3],
        end: [40, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "oh3"',
        start: [41, 2, 3],
        end: [41, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "oh4"',
        start: [42, 2, 3],
        end: [42, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "oh5"',
        start: [43, 2, 3],
        end: [43, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "d1"',
        start: [46, 2, 2],
        end: [46, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "d2"',
        start: [47, 2, 2],
        end: [47, 2, 2],
      },
      {
        code: 104,
        info: 'Unused variable "d5"',
        start: [50, 2, 2],
        end: [50, 2, 2],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
