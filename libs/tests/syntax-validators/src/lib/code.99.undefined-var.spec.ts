import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detect undefined variables`, () => {
  it(`[auto generated] in most places`, async () => {
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
      `pro undefined_without_common, a, b, c`,
      `  compile_opt idl2`,
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
        code: 99,
        info: 'Undefined variable "bad"',
        start: [14, 10, 3],
        end: [14, 10, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "wrong"',
        start: [17, 21, 5],
        end: [17, 21, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "meta"',
        start: [20, 32, 4],
        end: [20, 32, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "item"',
        start: [28, 15, 4],
        end: [28, 15, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "noBueno"',
        start: [34, 2, 7],
        end: [34, 2, 7],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [10, 30, 1],
        end: [10, 30, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [10, 33, 1],
        end: [10, 33, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [10, 36, 1],
        end: [10, 36, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "test1"',
        start: [14, 2, 5],
        end: [14, 2, 5],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "test2"',
        start: [17, 2, 5],
        end: [17, 2, 5],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "ok"',
        start: [17, 11, 2],
        end: [17, 11, 2],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "test3"',
        start: [20, 2, 5],
        end: [20, 2, 5],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] never define self`, async () => {
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
      `;-`,
      `function dataToMemoryRaster`,
      `  compile_opt idl2`,
      ``,
      `  ; should error`,
      `  self = 5`,
      ``,
      `  ; should error`,
      `  a = self`,
      ``,
      `  return, 1`,
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
        code: 99,
        info: 'Undefined variable "self"',
        start: [9, 2, 4],
        end: [9, 2, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "self"',
        start: [12, 6, 4],
        end: [12, 6, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [12, 2, 1],
        end: [12, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] define self in methods`, async () => {
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
      `;-`,
      `function myclass::mymethod`,
      `  compile_opt idl2`,
      ``,
      `  ; no error`,
      `  self = 5`,
      ``,
      `  ; no error`,
      `  a = self`,
      ``,
      `  return, 1`,
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
        info: 'Unused variable "a"',
        start: [12, 2, 1],
        end: [12, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] catc`, async () => {
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
      `filename = filepath('qb_boulder_msi', root = nv.root_dir)`,
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
        code: 99,
        info: 'Undefined variable "nv"',
        start: [1, 45, 2],
        end: [1, 45, 2],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "filename"',
        start: [1, 0, 8],
        end: [1, 0, 8],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
