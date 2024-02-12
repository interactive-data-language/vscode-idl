import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] All the places we want to make sure we test for`, () => {
  it(`[auto generated] type validation`, async () => {
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
      `;   arg3: in, required, Hash<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: in, required, OrderedHash<Byte>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro validate_problems, arg3, arg4`,
      `  compile_opt idl3`,
      ``,
      `  ; validation edge cases`,
      `  ; same variables should always have validation applied, but not always saved`,
      `  dup1 = arg3[arg4]`,
      `  dup1 = arg3[arg4]`,
      ``,
      `  ; anything with assignment before should validate`,
      `  !x.charsize = arg3[arg4]`,
      `  !null = arg3[arg4]`,
      ``,
      `  ; arguments and keywords`,
      `  a = polot1(arg3[arg4], $`,
      `    arg3[arg4], $`,
      `    thing = arg3[arg4], $`,
      `    thang = arg3[arg4])`,
      ``,
      `  ; left-side of the equation`,
      `  arg3[arg4] = 5`,
      `  (arg3[arg4]) = 5`,
      `  (myfunc(arg3[arg4])) = 5`,
      `  !null = (myfunc2(arg3[arg4]))`,
      `  !null = (myfunc3(arg3[arg4])) + 1`,
      ``,
      `  ; arguments`,
      `  a = polot2(arg3[arg4], arg3[arg4])`,
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
        start: [13, 13, 1],
        end: [13, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [14, 13, 1],
        end: [14, 18, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [18, 14, 1],
        end: [18, 19, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [23, 16, 1],
        end: [23, 21, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [24, 16, 1],
        end: [24, 21, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [17, 20, 1],
        end: [17, 25, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [21, 17, 1],
        end: [21, 22, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [22, 8, 1],
        end: [22, 13, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [27, 6, 1],
        end: [27, 11, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [28, 7, 1],
        end: [28, 12, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [29, 14, 1],
        end: [29, 19, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [30, 23, 1],
        end: [30, 28, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [31, 23, 1],
        end: [31, 28, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [34, 17, 1],
        end: [34, 22, 1],
        canReport: true,
      },
      {
        code: 91,
        info: 'Illegal index type. Data types allowed for indexing are numbers (non-complex, non-bigint), strings, and arrays',
        start: [34, 29, 1],
        end: [34, 34, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
