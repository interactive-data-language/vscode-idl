import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] System variable styling`, () => {
  it(`[auto generated] using modern format`, async () => {
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
      `compile_opt idl2, hidden`,
      ``,
      `a = !SYSTEM_variable`,
      ``,
      `b = {!CPu, hw_vector: 0l, vector_enable: 0l, hw_ncpu: 0l,$`,
      `  tpool_nthreads: 0l, tpool_min_elts: 0l, tpool_max_elts: 0l}`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      formatter: 'fiddle',
      style: { systemVariables: 'lower' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2, hidden`,
        ``,
        `a = !system_variable`,
        ``,
        `b = {!cpu, hw_vector: 0l, vector_enable: 0l, hw_ncpu: 0l, $`,
        `  tpool_nthreads: 0l, tpool_min_elts: 0l, tpool_max_elts: 0l}`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [4, 0, 1],
        end: [4, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] using dated format`, async () => {
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
      `compile_opt idl2, hidden`,
      ``,
      `a = !SYSTEM_variable`,
      ``,
      `b = {!CPu, hw_vector: 0l, vector_enable: 0l, hw_ncpu: 0l,$`,
      `  tpool_nthreads: 0l, tpool_min_elts: 0l, tpool_max_elts: 0l}`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      formatter: 'fiddle',
      style: { systemVariables: 'upper' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2, hidden`,
        ``,
        `a = !SYSTEM_VARIABLE`,
        ``,
        `b = {!CPU, hw_vector: 0l, vector_enable: 0l, hw_ncpu: 0l, $`,
        `  tpool_nthreads: 0l, tpool_min_elts: 0l, tpool_max_elts: 0l}`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [4, 0, 1],
        end: [4, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] using no format`, async () => {
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
      `compile_opt idl2, hidden`,
      ``,
      `a = !SYSTEM_variable`,
      ``,
      `b = {!CPu, hw_vector: 0l, vector_enable: 0l, hw_ncpu: 0l,$`,
      `  tpool_nthreads: 0l, tpool_min_elts: 0l, tpool_max_elts: 0l}`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      formatter: 'fiddle',
      style: { systemVariables: 'none' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2, hidden`,
        ``,
        `a = !SYSTEM_variable`,
        ``,
        `b = {!CPu, hw_vector: 0l, vector_enable: 0l, hw_ncpu: 0l, $`,
        `  tpool_nthreads: 0l, tpool_min_elts: 0l, tpool_max_elts: 0l}`,
        ``,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [4, 0, 1],
        end: [4, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
