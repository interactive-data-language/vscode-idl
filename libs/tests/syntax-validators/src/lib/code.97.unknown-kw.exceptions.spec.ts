import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Check for known keywords`, () => {
  it(`[auto generated] and exclude these cases`, async () => {
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
      `; main level program`,
      `compile_opt idl2`,
      ``,
      `; procedures`,
      `p = plot(/tes)`,
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
        code: 104,
        info: 'Unused variable "p"',
        start: [4, 0, 1],
        end: [4, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] unless we have extra or ref extra (only one at a time)`, async () => {
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
      `; :Keywords:`,
      `;   _ref_extra: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro auto_doc_example2, _ref_extra = ex`,
      `  compile_opt idl2`,
      ``,
      `end`,
      ``,
      `;+`,
      `; :Keywords:`,
      `;   _extra: bidirectional, optional, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro auto_doc_example, _extra = ex`,
      `  compile_opt idl2`,
      ``,
      `end`,
      ``,
      `; main`,
      `compile_opt idl2`,
      ``,
      `; OK with only extra`,
      `auto_doc_example, /anything_i_want`,
      ``,
      `; OK with only ref extra`,
      `auto_doc_example2, /anything_i_want`,
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
        code: 104,
        info: 'Unused variable "ex"',
        start: [17, 31, 2],
        end: [17, 31, 2],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "ex"',
        start: [6, 36, 2],
        end: [6, 36, 2],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
