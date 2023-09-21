import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify string literal escape characters`, () => {
  it(`[auto generated] only have a problem with the last one`, async () => {
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
      `compile_opt idl2`,
      `a = \`\\\`\``,
      `a = \`\\$\``,
      `a = \`\\\\\``,
      `a = \`\\b\``,
      `a = \`\\f\``,
      `a = \`\\n\``,
      `a = \`\\r\``,
      `a = \`\\t\``,
      `a = \`\\v\``,
      `a = \`\\x00 \\XaF\``,
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
        code: 70,
        info: 'Illegal formatting for hex escape character. Should be of the form "\\xXX" and must start with "\\x"',
        start: [10, 10, 4],
        end: [10, 10, 4],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
