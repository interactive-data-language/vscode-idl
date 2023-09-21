import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects illegal arrows`, () => {
  it(`[auto generated] missing super/method`, async () => {
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
    const code = [`compile_opt idl2`, `a  = b-> $`, `method`, `end`];

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
        code: 8,
        info: 'Arrow functions must be followed by the method name or super::method name and cannot be split between lines',
        start: [1, 6, 3],
        end: [1, 6, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [1, 5, 1],
        end: [1, 5, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "method"',
        start: [2, 0, 6],
        end: [2, 0, 6],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [1, 0, 1],
        end: [1, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] missing method with super before`, async () => {
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
      `oContainer = self->IDLitContainer:: $`,
      `method`,
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
        code: 7,
        info: 'Unknown token encountered. Verify syntax and expression is allowed.',
        start: [1, 17, 19],
        end: [1, 17, 19],
      },
      {
        code: 99,
        info: 'Undefined variable "self"',
        start: [1, 13, 4],
        end: [1, 13, 4],
      },
      {
        code: 99,
        info: 'Undefined variable "method"',
        start: [2, 0, 6],
        end: [2, 0, 6],
      },
      {
        code: 104,
        info: 'Unused variable "oContainer"',
        start: [1, 0, 10],
        end: [1, 0, 10],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
