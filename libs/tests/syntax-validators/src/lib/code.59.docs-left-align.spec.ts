import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Detects when docs are not left-aligned as expected`, () => {
  it(`[auto generated] no problems in params/keywords`, async () => {
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
      `; :Params:`,
      `;   var1: in, optional, boolean`,
      `;     My favorite argument`,
      `;     And another line`,
      `;-`,
      `pro myclass::mymethod, var1`,
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
        info: 'Unused variable "var1"',
        start: [6, 23, 4],
        end: [6, 23, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems in params/keywords`, async () => {
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
      `; :Params:`,
      `;   var1: in, optional, boolean`,
      `;     My favorite argument`,
      `;    And another line`,
      `;-`,
      `pro myclass::mymethod, var1`,
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
        code: 59,
        info: 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
        start: [4, 0, 21],
        end: [4, 0, 21],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [6, 23, 4],
        end: [6, 23, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems in other blocks`, async () => {
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
      `;    First line is great`,
      `;   THEN CHAOS ENSUES`,
      `;`,
      `; :Params:`,
      `;   var1: in, optional, boolean`,
      `;     My favorite argument`,
      `;-`,
      `pro myclass::mymethod, var1`,
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
        code: 59,
        info: 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
        start: [2, 0, 21],
        end: [2, 0, 21],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [8, 23, 4],
        end: [8, 23, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] no problems in variables`, async () => {
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
      `pro myclass::mymethod, var1`,
      `  compile_opt idl2`,
      `  ;+`,
      `  ; Some things are really awesome`,
      `  ; and need a big description`,
      `  ;-`,
      `  a = 42`,
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
        info: 'Unused variable "var1"',
        start: [0, 23, 4],
        end: [0, 23, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [6, 2, 1],
        end: [6, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems in variables`, async () => {
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
      `pro myclass::mymethod, var1`,
      `  compile_opt idl2`,
      `  ;+`,
      `  ; Some things are really awesome`,
      `  ;and need a big description`,
      `  ;-`,
      `  a = 42`,
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
        code: 59,
        info: 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
        start: [4, 2, 27],
        end: [4, 2, 27],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [0, 23, 4],
        end: [0, 23, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [6, 2, 1],
        end: [6, 2, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
