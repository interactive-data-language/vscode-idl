import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Disable nothing`, () => {
  it(`[auto generated] no disabling`, async () => {
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
    const code = [`; idl-disable-next     `, `a = 42`];

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
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 23],
        end: [0, 0, 23],
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

  it(`[auto generated] no disabling`, async () => {
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
    const code = [`; idl-disableanything     `, `a = 42`];

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
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 26],
        end: [0, 0, 26],
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
});
