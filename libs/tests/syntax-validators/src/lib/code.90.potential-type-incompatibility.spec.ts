import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Potential type incompatibility in`, () => {
  it(`[auto generated] operations`, async () => {
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
      `pro incompatible_checks`,
      `compile_opt idl2`,
      ``,
      `a = 1 + ENVIRaster()`,
      ``,
      `b = 1 + plot()`,
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
        code: 90,
        info: 'Potential type incompatibility found. If non-standard IDL types have overloaded operator methods, you can ignore this warning',
        start: [3, 4, 1],
        end: [3, 19, 1],
        canReport: true,
      },
      {
        code: 90,
        info: 'Potential type incompatibility found. If non-standard IDL types have overloaded operator methods, you can ignore this warning',
        start: [5, 4, 1],
        end: [5, 13, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [3, 0, 1],
        end: [3, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [5, 0, 1],
        end: [5, 0, 1],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] no problems with array creation`, async () => {
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
      `pro incompatible_checks`,
      `compile_opt idl2`,
      ``,
      `arr1 = [ENVIRaster(), ENVIMetaspectralRaster(), ENVISubsetRaster()]`,
      `arr2 = [{}, {}]`,
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
        info: 'Unused variable "arr1"',
        start: [3, 0, 4],
        end: [3, 0, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "arr2"',
        start: [4, 0, 4],
        end: [4, 0, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });

  it(`[auto generated] problems with array creation`, async () => {
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
      `pro incompatible_checks`,
      `compile_opt idl2`,
      ``,
      `bad1 = [ENVIRaster(), {}]`,
      `bad2 = [{}, 1]`,
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
        code: 90,
        info: 'Potential type incompatibility found. If non-standard IDL types have overloaded operator methods, you can ignore this warning',
        start: [3, 7, 1],
        end: [3, 24, 1],
        canReport: true,
      },
      {
        code: 85,
        info: 'Illegal use of structures, operations like addition, subtraction, etc are not allowed.',
        start: [4, 7, 1],
        end: [4, 13, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "bad1"',
        start: [3, 0, 4],
        end: [3, 0, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "bad2"',
        start: [4, 0, 4],
        end: [4, 0, 4],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
