import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detect undefined variables`, () => {
  it(`[auto generated] when we have a common block present`, async () => {
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
      `;   a: in, required, ENVIRaster`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   b: out, required, Long`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   c: out, required, ENVIRaster`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro undefined_with_common, a, b, c`,
      `  compile_opt idl2`,
      `  common`,
      ``,
      `  ; direct vars`,
      `  test1 = bad`,
      ``,
      `  ; within child branches`,
      `  test2 = (ok = 5) + wrong`,
      ``,
      `  ; as keyword`,
      `  test3 = ENVIRaster(metadata = meta) ; formatting matches docs`,
      ``,
      `  ; OK`,
      `  for i = 0, 100 do begin`,
      `    !null = i`,
      `  endfor`,
      ``,
      `  ; item is bad`,
      `  foreach val, item, key do begin`,
      `    !null = val`,
      `    !null = key`,
      `  endforeach`,
      ``,
      `  ; noBueno is bad`,
      `  noBueno->method`,
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
        code: 100,
        info: 'Potentially undefined variable "bad"',
        start: [15, 10, 3],
        end: [15, 10, 3],
      },
      {
        code: 100,
        info: 'Potentially undefined variable "wrong"',
        start: [18, 21, 5],
        end: [18, 21, 5],
      },
      {
        code: 100,
        info: 'Potentially undefined variable "meta"',
        start: [21, 32, 4],
        end: [21, 32, 4],
      },
      {
        code: 100,
        info: 'Potentially undefined variable "item"',
        start: [29, 15, 4],
        end: [29, 15, 4],
      },
      {
        code: 100,
        info: 'Potentially undefined variable "noBueno"',
        start: [35, 2, 7],
        end: [35, 2, 7],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [10, 27, 1],
        end: [10, 27, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [10, 30, 1],
        end: [10, 30, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [10, 33, 1],
        end: [10, 33, 1],
      },
      {
        code: 104,
        info: 'Unused variable "test1"',
        start: [15, 2, 5],
        end: [15, 2, 5],
      },
      {
        code: 104,
        info: 'Unused variable "test2"',
        start: [18, 2, 5],
        end: [18, 2, 5],
      },
      {
        code: 104,
        info: 'Unused variable "ok"',
        start: [18, 11, 2],
        end: [18, 11, 2],
      },
      {
        code: 104,
        info: 'Unused variable "test3"',
        start: [21, 2, 5],
        end: [21, 2, 5],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] dont add a var for the first child of a common block`, async () => {
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
      `pro color_edit_back`,
      `compile_opt idl2`,
      ``,
      `common color_edit, wxsize, wysize, r0`,
      ``,
      `for i = wysize - 60, wysize - 30 do tv, ramp, wxsize / 2 - 256, i`,
      ``,
      `cx = wxsize / 4.`,
      `cy = wysize - 90. - r0`,
      ``,
      `a = color_edit`,
      ``,
      `return`,
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
        code: 100,
        info: 'Potentially undefined variable "color_edit"',
        start: [10, 4, 10],
        end: [10, 4, 10],
      },
      {
        code: 104,
        info: 'Unused variable "ramp"',
        start: [5, 40, 4],
        end: [5, 40, 4],
      },
      {
        code: 104,
        info: 'Unused variable "cx"',
        start: [7, 0, 2],
        end: [7, 0, 2],
      },
      {
        code: 104,
        info: 'Unused variable "cy"',
        start: [8, 0, 2],
        end: [8, 0, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [10, 0, 1],
        end: [10, 0, 1],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
