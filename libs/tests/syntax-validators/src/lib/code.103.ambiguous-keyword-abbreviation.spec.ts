import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Keywords that are abbreviated but`, () => {
  it(`[auto generated] have multiple for auto complete`, async () => {
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
      `; :Returns:`,
      `;   any`,
      `;`,
      `; :Keywords:`,
      `;   kw1: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   kw2: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function myclass::mymethod, kw1 = kw1, kw2 = kw2`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Keywords:`,
      `;   kw1: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   kw2: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro myclass::mymethod, kw1 = kw1, kw2 = kw2`,
      `  compile_opt idl2`,
      ``,
      `end`,
      ``,
      `;+`,
      `; :myclass:`,
      `;-`,
      `pro myclass__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {myclass}`,
      ``,
      `end`,
      ``,
      `;+`,
      `; :Returns:`,
      `;   any`,
      `;`,
      `; :Keywords:`,
      `;   kw1: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   kw2: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function auto_doc_example, kw1 = kw1, kw2 = kw2`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Keywords:`,
      `;   kw1: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   kw2: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro auto_doc_example, kw1 = kw1, kw2 = kw2`,
      `  compile_opt idl2`,
      ``,
      `end`,
      ``,
      `; main leve program`,
      `compile_opt idl2`,
      ``,
      `; problem 1`,
      `auto_doc_example, /kw`,
      ``,
      `; problem 2`,
      `!null = auto_doc_example(kw = 5)`,
      ``,
      `a = {myclass}`,
      ``,
      `; problem 3`,
      `a.mymethod, kw = 5`,
      ``,
      `; problem 4`,
      `!null = a.mymethod(/kw)`,
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
        code: 103,
        info: 'Ambiguous keyword usage. One or more keywords starts with "kw"',
        start: [74, 18, 3],
        end: [74, 18, 3],
        canReport: true,
      },
      {
        code: 103,
        info: 'Ambiguous keyword usage. One or more keywords starts with "kw"',
        start: [77, 25, 2],
        end: [77, 25, 2],
        canReport: true,
      },
      {
        code: 103,
        info: 'Ambiguous keyword usage. One or more keywords starts with "kw"',
        start: [82, 12, 2],
        end: [82, 12, 2],
        canReport: true,
      },
      {
        code: 103,
        info: 'Ambiguous keyword usage. One or more keywords starts with "kw"',
        start: [85, 19, 3],
        end: [85, 19, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [65, 28, 3],
        end: [65, 28, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [65, 39, 3],
        end: [65, 39, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [25, 29, 3],
        end: [25, 29, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [25, 40, 3],
        end: [25, 40, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [51, 33, 3],
        end: [51, 33, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [51, 44, 3],
        end: [51, 44, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [11, 34, 3],
        end: [11, 34, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [11, 45, 3],
        end: [11, 45, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
