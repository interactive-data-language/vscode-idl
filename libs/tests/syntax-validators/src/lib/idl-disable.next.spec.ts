import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Disable problems:`, () => {
  it(`[auto generated] for next line`, async () => {
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
    const code = [`; idl-disable-next-line illegal-arrow`, `a = ->`];

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
        start: [1, 4, 2],
        end: [1, 4, 2],
        canReport: false,
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 37],
        end: [0, 0, 37],
        canReport: true,
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [1, 0, 1.7976931348623157e308],
        end: [1, 0, 1.7976931348623157e308],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [1, 0, 1],
        end: [1, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] for next line`, async () => {
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
    const code = [`;+ idl-disable-next-line illegal-arrow`, `a = ->`];

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
        start: [1, 4, 2],
        end: [1, 4, 2],
        canReport: false,
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 38],
        end: [0, 0, 38],
        canReport: true,
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [1, 0, 1.7976931348623157e308],
        end: [1, 0, 1.7976931348623157e308],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [1, 0, 1],
        end: [1, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] for next line`, async () => {
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
    const code = [`;+`, `; idl-disable-next-line illegal-arrow`, `a = ->`];

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
        start: [2, 4, 2],
        end: [2, 4, 2],
        canReport: false,
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 2],
        end: [0, 0, 2],
        canReport: true,
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [2, 0, 1.7976931348623157e308],
        end: [2, 0, 1.7976931348623157e308],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] for next line`, async () => {
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
      `; idl-disable-next-line illegal-arrow`,
      `;-`,
      `a = ->`,
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
        code: 8,
        info: 'Arrow functions must be followed by the method name or super::method name and cannot be split between lines',
        start: [3, 4, 2],
        end: [3, 4, 2],
        canReport: false,
      },
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 2],
        end: [0, 0, 2],
        canReport: true,
      },
      {
        code: 33,
        info: 'Main level program is missing an "end" statement',
        start: [3, 0, 1.7976931348623157e308],
        end: [3, 0, 1.7976931348623157e308],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [3, 0, 1],
        end: [3, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
