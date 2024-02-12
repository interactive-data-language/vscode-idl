import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Don't check unknown keywords`, () => {
  it(`[auto generated] in in methods that we dont know`, async () => {
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
      `  compile_opt idl2`,
      `l = luna(/in_package)`,
      `(l.expects(routine)).toRunFunction, raster, _output = output`,
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
        info: 'Unused variable "routine"',
        start: [2, 11, 7],
        end: [2, 11, 7],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "raster"',
        start: [2, 36, 6],
        end: [2, 36, 6],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "output"',
        start: [2, 54, 6],
        end: [2, 54, 6],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] verify we process parents before children`, async () => {
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
      `  compile_opt idl2`,
      `  item = list()`,
      `  ; item is bad`,
      `  foreach val, item, key do begin`,
      `    val = 5`,
      `  endforeach`,
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
        info: 'Unused variable "key"',
        start: [3, 21, 3],
        end: [3, 21, 3],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
