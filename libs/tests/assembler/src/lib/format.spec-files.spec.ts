import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import type { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify spec file indentation`, () => {
  it(`[auto generated] indents suites and tests`, async () => {
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
      `; main level program`,
      `l = luna(/PROFILE)`,
      ``,
      `;create a test suite`,
      `s = l.suite('Sample test suite')`,
      ``,
      `;create a test for our suite`,
      `it = s.test('a test with expectations that pass')`,
      ``,
      `;make sure we have a null value`,
      `(it.expects(!NULL)).toBeNull`,
      ``,
      `;match a substring`,
      `(it.expects('string')).toContainString, 'ing'`,
      ``,
      `;create another test`,
      `it = s.test('a test with expectations that fail')`,
      ``,
      `(it.expects(42)).toBeNull`,
      ``,
      `; summarize our tests`,
      `l.generateTestSummary`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true },
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      isSpec: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `; main level program`,
        `l = luna(/profile)`,
        ``,
        `  ; create a test suite`,
        `  s = l.suite('Sample test suite')`,
        ``,
        `    ; create a test for our suite`,
        `    it = s.test('a test with expectations that pass')`,
        ``,
        `      ; make sure we have a null value`,
        `      (it.expects(!null)).toBeNull`,
        ``,
        `      ; match a substring`,
        `      (it.expects('string')).toContainString, 'ing'`,
        ``,
        `    ; create another test`,
        `    it = s.test('a test with expectations that fail')`,
        ``,
        `      (it.expects(42)).toBeNull`,
        ``,
        `; summarize our tests`,
        `l.generateTestSummary`,
        `end`,
        ``,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true },
      );

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 20],
        end: [0, 0, 20],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] multiple suites, renamed variables, and line continuations`, async () => {
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
      `compile_opt idl2`,
      `runner = luna()`,
      `suite1 = runner.suite('first')`,
      `t1 = suite1.test('a')`,
      `(t1.expects(1)).toEqual, $`,
      `  1`,
      `t2 = suite1.test('b')`,
      `(t2.expects(2)).toEqual, 2`,
      `suite2 = runner.suite('second')`,
      `t3 = suite2.test('c')`,
      `(t3.expects(3)).toEqual, 3`,
      `runner.generateTestSummary`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true },
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      isSpec: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        `runner = luna()`,
        `  suite1 = runner.suite('first')`,
        `    t1 = suite1.test('a')`,
        `      (t1.expects(1)).toEqual, $`,
        `        1`,
        `    t2 = suite1.test('b')`,
        `      (t2.expects(2)).toEqual, 2`,
        `  suite2 = runner.suite('second')`,
        `    t3 = suite2.test('c')`,
        `      (t3.expects(3)).toEqual, 3`,
        `runner.generateTestSummary`,
        `end`,
        ``,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true },
      );

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] does not indent routines`, async () => {
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
      `pro helper`,
      `  compile_opt idl2`,
      `  print, 1`,
      `end`,
      ``,
      `l = luna()`,
      `s = l.suite('first')`,
      `it = s.test('a')`,
      `helper`,
      `l.generateTestSummary`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true },
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      isSpec: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `pro helper`,
        `  compile_opt idl2`,
        `  print, 1`,
        `end`,
        ``,
        `l = luna()`,
        `  s = l.suite('first')`,
        `    it = s.test('a')`,
        `      helper`,
        `l.generateTestSummary`,
        `end`,
        ``,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true },
      );

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [5, 0, 1],
        end: [5, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "it"',
        start: [7, 0, 2],
        end: [7, 0, 2],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] does not indent when not a spec file`, async () => {
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
      `l = luna()`,
      `s = l.suite('first')`,
      `it = s.test('a')`,
      `l.generateTestSummary`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true },
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      isSpec: false,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `l = luna()`,
        `s = l.suite('first')`,
        `it = s.test('a')`,
        `l.generateTestSummary`,
        `end`,
        ``,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true },
      );

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 1],
        end: [0, 0, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "it"',
        start: [2, 0, 2],
        end: [2, 0, 2],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expectedProblems);
  });
});
