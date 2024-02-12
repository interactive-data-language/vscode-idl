import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects when a documented parameter does not exist in routine definition`, () => {
  it(`[auto generated] no problems`, async () => {
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
      `; My procedure`,
      `;`,
      `; :Args:`,
      `;  var1: in, required, any`,
      `;    My favorite thing`,
      `;`,
      `; :Keywords:`,
      `;  kw1: in, optional, type=boolean`,
      `;    Super Cool flag`,
      `;`,
      `;-`,
      `pro mypro, var1, KW1=kw1`,
      `  compile_opt idl2`,
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
        info: 'Unused variable "kw1"',
        start: [12, 21, 3],
        end: [12, 21, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [12, 11, 4],
        end: [12, 11, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problem with args and keywords`, async () => {
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
      `; My procedure`,
      `;`,
      `; :Args:`,
      `;  var1: in, required, any`,
      `;    My favorite thing`,
      `;`,
      `; :Keywords:`,
      `;  kw1: in, optional, type=boolean`,
      `;    Super Cool flag`,
      `;`,
      `;-`,
      `pro mypro, var2, KW2=kw2`,
      `  compile_opt idl2`,
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
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "var1"',
        start: [4, 0, 26],
        end: [4, 0, 26],
        canReport: true,
      },
      {
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "kw1"',
        start: [8, 0, 34],
        end: [8, 0, 34],
        canReport: true,
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "var2"',
        start: [12, 11, 4],
        end: [12, 11, 4],
        canReport: true,
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "kw2"',
        start: [12, 17, 3],
        end: [12, 17, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [12, 21, 3],
        end: [12, 21, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "var2"',
        start: [12, 11, 4],
        end: [12, 11, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] do not mistake colons in the description as parameters`, async () => {
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
      `; My procedure`,
      `;`,
      `; :Args:`,
      `;  var1: in, required, any`,
      `;    My favorite thing: something else`,
      `;`,
      `; :Keywords:`,
      `;  kw1: in, optional, type=boolean`,
      `;    Super Cool flag: something else`,
      `;`,
      `;-`,
      `pro mypro, var1, KW1=kw1`,
      `  compile_opt idl2`,
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
        info: 'Unused variable "kw1"',
        start: [12, 21, 3],
        end: [12, 21, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [12, 11, 4],
        end: [12, 11, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] detect in structures`, async () => {
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
      `; :MyStruct:`,
      `;   prop: any`,
      `;     Placeholder docs for argument or keyword`,
      `;   prop3: any`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro pro4__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1}`,
      ``,
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
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "prop3"',
        start: [4, 0, 14],
        end: [4, 0, 14],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
