import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Find unknown string literal escape characters`, () => {
  it(`[auto generated] no problems with all good`, async () => {
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
      `a = \`\\x00\``,
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
    const expected: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems with incomplete and bad ones`, async () => {
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
      `a = \`\\ \``,
      `a = \`\\a\``,
      `a = \`\\42\``,
      `a = \`\\lark \\r\\n\``,
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
        code: 71,
        info: 'Illegal/unknown template escape. Supported escape characters are "\\", "\\b", "\\f", "\\n", "\\r", "\\t", "\\v", "\\$", "\\`", and "\\xXX" for hex characters',
        start: [1, 5, 1],
        end: [1, 5, 1],
        canReport: true,
      },
      {
        code: 71,
        info: 'Illegal/unknown template escape. Supported escape characters are "\\", "\\b", "\\f", "\\n", "\\r", "\\t", "\\v", "\\$", "\\`", and "\\xXX" for hex characters',
        start: [2, 5, 1],
        end: [2, 5, 1],
        canReport: true,
      },
      {
        code: 71,
        info: 'Illegal/unknown template escape. Supported escape characters are "\\", "\\b", "\\f", "\\n", "\\r", "\\t", "\\v", "\\$", "\\`", and "\\xXX" for hex characters',
        start: [3, 5, 1],
        end: [3, 5, 1],
        canReport: true,
      },
      {
        code: 71,
        info: 'Illegal/unknown template escape. Supported escape characters are "\\", "\\b", "\\f", "\\n", "\\r", "\\t", "\\v", "\\$", "\\`", and "\\xXX" for hex characters',
        start: [4, 5, 1],
        end: [4, 5, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
