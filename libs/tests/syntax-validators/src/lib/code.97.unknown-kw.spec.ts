import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Check for known keywords`, () => {
  it(`[auto generated] and report errors if we dont have "_extra" or "_ref_extra"`, async () => {
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
      `; :Description:`,
      `;   Constructor`,
      `;`,
      `; :Returns:`,
      `;   myclass`,
      `;`,
      `;-`,
      `function myclass::Init`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Returns:`,
      `;   any`,
      `;`,
      `; :Keywords:`,
      `;   kw: out, optional, Array<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function myclass::method, kw = kw, _ref_extra = _extra`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Keywords:`,
      `;   kw: out, optional, ENVIRaster`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro myclass::method, kw = kw, _extra = _extra`,
      `  compile_opt idl2`,
      `end`,
      ``,
      `;+`,
      `; :Description:`,
      `;   Class definition procedure`,
      `;`,
      `;-`,
      `pro myclass__define`,
      `  compile_opt idl2`,
      ``,
      `  struct = {myclass}`,
      `end`,
      ``,
      `;+`,
      `; :Returns:`,
      `;   any`,
      `;`,
      `; :Keywords:`,
      `;   kw: out, optional, Long`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function myfunc, kw = kw`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Keywords:`,
      `;   kw: out, optional, Byte`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro mypro, kw = kw`,
      `  compile_opt idl2`,
      ``,
      `end`,
      ``,
      `; main level program`,
      `compile_opt idl2`,
      ``,
      `; procedures`,
      `mypro, kw = a, /kw2, kw3 = 3`,
      ``,
      `; functions`,
      `!null = myfunc(kw = b, /kw2, kw3 = 3)`,
      ``,
      `; make class for methods`,
      `var = myclass()`,
      ``,
      `; procedure methods`,
      `var.method, kw = c, /kw2, kw3 = 3`,
      ``,
      `; function methods`,
      `!null = var.method(kw = d, /kw2, kw3 = 3)`,
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
        code: 79,
        info: 'Structure definition is missing from docs: "myclass"',
        start: [46, 12, 7],
        end: [46, 12, 7],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "_extra"',
        start: [34, 30, 6],
        end: [34, 30, 6],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "_ref_extra"',
        start: [23, 35, 10],
        end: [23, 35, 10],
      },
      {
        code: 97,
        info: 'Unknown keyword "kw2"',
        start: [78, 15, 4],
        end: [78, 15, 4],
      },
      {
        code: 97,
        info: 'Unknown keyword "kw3"',
        start: [78, 21, 3],
        end: [78, 21, 3],
      },
      {
        code: 97,
        info: 'Unknown keyword "kw2"',
        start: [81, 23, 4],
        end: [81, 23, 4],
      },
      {
        code: 97,
        info: 'Unknown keyword "kw3"',
        start: [81, 29, 3],
        end: [81, 29, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [78, 12, 1],
        end: [78, 12, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [81, 20, 1],
        end: [81, 20, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [87, 17, 1],
        end: [87, 17, 1],
      },
      {
        code: 104,
        info: 'Unused variable "d"',
        start: [90, 24, 1],
        end: [90, 24, 1],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [69, 16, 2],
        end: [69, 16, 2],
      },
      {
        code: 104,
        info: 'Unused variable "struct"',
        start: [46, 2, 6],
        end: [46, 2, 6],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [34, 26, 2],
        end: [34, 26, 2],
      },
      {
        code: 104,
        info: 'Unused variable "_extra"',
        start: [34, 39, 6],
        end: [34, 39, 6],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [58, 22, 2],
        end: [58, 22, 2],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [23, 31, 2],
        end: [23, 31, 2],
      },
      {
        code: 104,
        info: 'Unused variable "_extra"',
        start: [23, 48, 6],
        end: [23, 48, 6],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
