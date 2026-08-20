import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Ambiguous KW def`, () => {
  it(`[auto generated] For main problem case`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // test code to extract tokens from
    const code = [
      `pro foo, output_parameters = output_parameters, debug = debug, output = output`,
      `  compile_opt idl2`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true },
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 114,
        info: "Ambiguous keyword detected. This keyword's name matches the start of another named keyword",
        start: [0, 63, 6],
        end: [0, 63, 6],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "output_parameters"',
        start: [0, 29, 17],
        end: [0, 29, 17],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "debug"',
        start: [0, 56, 5],
        end: [0, 56, 5],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "output"',
        start: [0, 72, 6],
        end: [0, 72, 6],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expected);
  });
});
