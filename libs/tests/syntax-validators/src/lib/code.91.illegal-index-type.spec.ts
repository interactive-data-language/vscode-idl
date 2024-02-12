import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Illegal index checks for`, () => {
  it(`[auto generated] all types`, async () => {
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
      `  !null = arg1[plot()]`,
      `  !null = arg1[1j]`,
      `  !null = arg1[1i]`,
      `  !null = arg1[1di]`,
      `  !null = arg1[1dj]`,
      ``,
      `  ; for lists`,
      `  !null = arg2[plot()]`,
      `  !null = arg2[1j]`,
      `  !null = arg2[1i]`,
      `  !null = arg2[1di]`,
      `  !null = arg2[1dj]`,
      ``,
      `  ; for hashes`,
      `  !null = arg3[plot()]`,
      `  !null = arg3[1j]`,
      `  !null = arg3[1i]`,
      `  !null = arg3[1di]`,
      `  !null = arg3[1dj]`,
      ``,
      `  ; for ordered hashes`,
      `  !null = arg4[plot()]`,
      `  !null = arg4[1j]`,
      `  !null = arg4[1i]`,
      `  !null = arg4[1di]`,
      `  !null = arg4[1dj]`,
      ``,
      `  ; for dictionaries`,
      `  !null = arg5[plot()]`,
      `  !null = arg5[1j]`,
      `  !null = arg5[1i]`,
      `  !null = arg5[1di]`,
      `  !null = arg5[1dj]`,
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
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [18, 14, 1],
        end: [18, 21, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [19, 14, 1],
        end: [19, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [20, 14, 1],
        end: [20, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [21, 14, 1],
        end: [21, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [22, 14, 1],
        end: [22, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [25, 14, 1],
        end: [25, 21, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [26, 14, 1],
        end: [26, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [27, 14, 1],
        end: [27, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [28, 14, 1],
        end: [28, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [29, 14, 1],
        end: [29, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [32, 14, 1],
        end: [32, 21, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [33, 14, 1],
        end: [33, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [34, 14, 1],
        end: [34, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [35, 14, 1],
        end: [35, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [36, 14, 1],
        end: [36, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [39, 14, 1],
        end: [39, 21, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [40, 14, 1],
        end: [40, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [41, 14, 1],
        end: [41, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [42, 14, 1],
        end: [42, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [43, 14, 1],
        end: [43, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [46, 14, 1],
        end: [46, 21, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [47, 14, 1],
        end: [47, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [48, 14, 1],
        end: [48, 17, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [49, 14, 1],
        end: [49, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [50, 14, 1],
        end: [50, 18, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] allow boolean since it is really a number`, async () => {
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
      `pro index_problems`,
      `  compile_opt idl2`,
      ``,
      `  ; for arrays`,
      `  display = strarr(c)`,
      `  i = keyword_set(!null)`,
      `  !null = display[i]`,
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
        code: 99,
        info: 'Undefined variable "c"',
        start: [4, 19, 1],
        end: [4, 19, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
