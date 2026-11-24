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

  it(`[auto generated] indents reused expectations and control statements`, async () => {
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
      `compile_opt idl2, hidden`,
      `l = luna(/in_package)`,
      `suite = l.suite('suite')`,
      `it = suite.test('first')`,
      `; create an expectation`,
      `e = it.expects(findgen(5))`,
      ``,
      `; check that we are valid`,
      `e.toFindInArray, 1.0`,
      `e._not_.toFindInArray, 5.0`,
      ``,
      `catch, err`,
      `if (err ne 0) then begin`,
      `catch, /cancel`,
      `endif else begin`,
      `; cant find array in array`,
      `e.toFindInArray, fltarr(2)`,
      `endelse`,
      ``,
      `it = suite.test('second')`,
      `e = it.expects(list(0, 1))`,
      `e.toContain, 1`,
      ``,
      `; generate a summary`,
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
        `compile_opt idl2, hidden`,
        `l = luna(/in_package)`,
        `  suite = l.suite('suite')`,
        `    it = suite.test('first')`,
        `      ; create an expectation`,
        `      e = it.expects(findgen(5))`,
        ``,
        `        ; check that we are valid`,
        `        e.toFindInArray, 1.0`,
        `        e._not_.toFindInArray, 5.0`,
        ``,
        `        catch, err`,
        `        if (err ne 0) then begin`,
        `          catch, /cancel`,
        `        endif else begin`,
        `          ; cant find array in array`,
        `          e.toFindInArray, fltarr(2)`,
        `        endelse`,
        ``,
        `    it = suite.test('second')`,
        `      e = it.expects(list(0, 1))`,
        `        e.toContain, 1`,
        ``,
        `; generate a summary`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] matches sol and luna scalar spec file`, async () => {
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
      `; h+`,
      `; Copyright (c) 2018 Harris Geospatial Solutions, Inc.`,
      `;`,
      `; Licensed under MIT. See LICENSE.txt for additional details and information.`,
      `; h-`,
      ``,
      `compile_opt idl2, hidden`,
      ``,
      `; lets test this!`,
      `l = luna(/in_package)`,
      ``,
      `  ; create a new suite of tests`,
      `  suite = l.suite('Test suite for the Luna tester')`,
      ``,
      `    ; create a new test for our suite`,
      `    it = suite.test('makes sure tests for null are valid')`,
      ``,
      `      ; run a sample test that passes`,
      `      (it.expects()).toBeNull`,
      ``,
      `      ; run a sample test that fails`,
      `      (it.expects(5)).toBeNull, /_expect_failure`,
      ``,
      `      ; run a sample test that fails`,
      `      (it.expects())._not_.toBeNull, /_expect_failure`,
      ``,
      `      ; run a sample test that passes`,
      `      (it.expects(5))._not_.toBeNull`,
      ``,
      `    ; create a new test for our suite`,
      `    it = suite.test('makes sure tests for equating values are valid')`,
      ``,
      `      ; create an expectation`,
      `      e = it.expects(5)`,
      ``,
      `        ; make sure we match and dont match`,
      `        e.toEqual, 5`,
      `        e.toEqual, 4, /_expect_failure`,
      ``,
      `        ; make sure we fail when we don't match`,
      `        e._not_.toEqual, 4`,
      `        e._not_.toEqual, 5, /_expect_failure`,
      ``,
      `      ; verify our other data types`,
      `      (it.expects(hash('fortyTwo', 42))).toEqual, hash('fortyTwo', 42)`,
      `      (it.expects(orderedhash('fortyTwo', 42))).toEqual, orderedhash('fortyTwo', 42)`,
      `      (it.expects(dictionary('fortyTwo', 42))).toEqual, dictionary('fortyTwo', 42)`,
      `      (it.expects(list('fortyTwo', 42))).toEqual, list('fortyTwo', 42)`,
      `      (it.expects(['fortyTwo', '42'])).toEqual, ['fortyTwo', '42']`,
      `      (it.expects(list('fortyTwo', '42'))).toEqual, ['fortyTwo', '42']`,
      `      (it.expects(['fortyTwo', '42'])).toEqual, list('fortyTwo', '42')`,
      ``,
      `    ; create a new test for our suite`,
      `    it = suite.test('makes sure tests for types are valid')`,
      ``,
      `      ; create an expectation`,
      `      e = it.expects(5b)`,
      ``,
      `        ; make sure we match and dont match`,
      `        e.toBeTypename, 'byte'`,
      `        e.toBeTypename, 'float', /_expect_failure`,
      ``,
      `        ; make sure we fail when we don't match`,
      `        e._not_.toBeTypename, 'byte', /_expect_failure`,
      `        e._not_.toBeTypename, 'float'`,
      ``,
      `      ; create an expectation`,
      `      e = it.expects(fltarr(5))`,
      ``,
      `        ; make sure we match and dont match`,
      `        e.toBeA, ['array', 'float']`,
      `        e.toBeA, 'byte', /_expect_failure`,
      ``,
      `        ; make sure we fail when we don't match`,
      `        e._not_.toBeA, ['byte', 'string']`,
      `        e._not_.toBeA, ['array', 'float'], /_expect_failure`,
      ``,
      `; generate a nice summary to visualize`,
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
        `; h+`,
        `; Copyright (c) 2018 Harris Geospatial Solutions, Inc.`,
        `;`,
        `; Licensed under MIT. See LICENSE.txt for additional details and information.`,
        `; h-`,
        ``,
        `compile_opt idl2, hidden`,
        ``,
        `; lets test this!`,
        `l = luna(/in_package)`,
        ``,
        `  ; create a new suite of tests`,
        `  suite = l.suite('Test suite for the Luna tester')`,
        ``,
        `    ; create a new test for our suite`,
        `    it = suite.test('makes sure tests for null are valid')`,
        ``,
        `      ; run a sample test that passes`,
        `      (it.expects()).toBeNull`,
        ``,
        `      ; run a sample test that fails`,
        `      (it.expects(5)).toBeNull, /_expect_failure`,
        ``,
        `      ; run a sample test that fails`,
        `      (it.expects())._not_.toBeNull, /_expect_failure`,
        ``,
        `      ; run a sample test that passes`,
        `      (it.expects(5))._not_.toBeNull`,
        ``,
        `    ; create a new test for our suite`,
        `    it = suite.test('makes sure tests for equating values are valid')`,
        ``,
        `      ; create an expectation`,
        `      e = it.expects(5)`,
        ``,
        `        ; make sure we match and dont match`,
        `        e.toEqual, 5`,
        `        e.toEqual, 4, /_expect_failure`,
        ``,
        `        ; make sure we fail when we don't match`,
        `        e._not_.toEqual, 4`,
        `        e._not_.toEqual, 5, /_expect_failure`,
        ``,
        `      ; verify our other data types`,
        `      (it.expects(hash('fortyTwo', 42))).toEqual, hash('fortyTwo', 42)`,
        `      (it.expects(orderedhash('fortyTwo', 42))).toEqual, orderedhash('fortyTwo', 42)`,
        `      (it.expects(dictionary('fortyTwo', 42))).toEqual, dictionary('fortyTwo', 42)`,
        `      (it.expects(list('fortyTwo', 42))).toEqual, list('fortyTwo', 42)`,
        `      (it.expects(['fortyTwo', '42'])).toEqual, ['fortyTwo', '42']`,
        `      (it.expects(list('fortyTwo', '42'))).toEqual, ['fortyTwo', '42']`,
        `      (it.expects(['fortyTwo', '42'])).toEqual, list('fortyTwo', '42')`,
        ``,
        `    ; create a new test for our suite`,
        `    it = suite.test('makes sure tests for types are valid')`,
        ``,
        `      ; create an expectation`,
        `      e = it.expects(5b)`,
        ``,
        `        ; make sure we match and dont match`,
        `        e.toBeTypename, 'byte'`,
        `        e.toBeTypename, 'float', /_expect_failure`,
        ``,
        `        ; make sure we fail when we don't match`,
        `        e._not_.toBeTypename, 'byte', /_expect_failure`,
        `        e._not_.toBeTypename, 'float'`,
        ``,
        `      ; create an expectation`,
        `      e = it.expects(fltarr(5))`,
        ``,
        `        ; make sure we match and dont match`,
        `        e.toBeA, ['array', 'float']`,
        `        e.toBeA, 'byte', /_expect_failure`,
        ``,
        `        ; make sure we fail when we don't match`,
        `        e._not_.toBeA, ['byte', 'string']`,
        `        e._not_.toBeA, ['array', 'float'], /_expect_failure`,
        ``,
        `; generate a nice summary to visualize`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems),
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] matches sol and luna arrays and lists spec file`, async () => {
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
      `; h+`,
      `; Copyright (c) 2018 Harris Geospatial Solutions, Inc.`,
      `;`,
      `; Licensed under MIT. See LICENSE.txt for additional details and information.`,
      `; h-`,
      ``,
      `compile_opt idl2, hidden`,
      ``,
      `; lets test this!`,
      `l = luna(/in_package)`,
      ``,
      `  ; create a new suite of tests`,
      `  suite = l.suite('Test suite for the Luna tester')`,
      ``,
      `    ; create a new test for our suite`,
      `    it = suite.test('makes sure tests for checking array elements are valid')`,
      ``,
      `      ; create an expectation`,
      `      e = it.expects(findgen(5))`,
      ``,
      `        ; check that we are valid`,
      `        e.toFindInArray, 1.0`,
      `        e._not_.toFindInArray, 5.0`,
      `        e.toFindInArray, 5.0, /_expect_failure`,
      `        e._not_.toFindInArray, 1.0, /_expect_failure`,
      ``,
      `        catch, err`,
      `        if (err ne 0) then begin`,
      `          catch, /cancel`,
      `          message, /reset`,
      `        endif else begin`,
      `          ; make sure that we cant find array in array`,
      `          e.toFindInArray, fltarr(2)`,
      `          catch, /cancel`,
      `          message, 'Expected an error to be thrown'`,
      `        endelse`,
      ``,
      `      ; create an expectation`,
      `      e = it.expects(5)`,
      ``,
      `        catch, err`,
      `        if (err ne 0) then begin`,
      `          catch, /cancel`,
      `          message, /reset`,
      `        endif else begin`,
      `          ; make sure we cant find element in scalar`,
      `          e.toFindInArray, 1.0`,
      `          catch, /cancel`,
      `          message, 'Expected an error to be thrown'`,
      `        endelse`,
      ``,
      `    ; create a new test for our suite`,
      `    it = suite.test('makes sure tests for checking list elements are valid')`,
      ``,
      `      ; create an expectation`,
      `      e = it.expects(list(0, 1, 2, 3, 4))`,
      ``,
      `        ; check that we are valid`,
      `        e.toContain, 1`,
      `        e._not_.toContain, 5`,
      `        e.toContain, 5, /_expect_failure`,
      `        e._not_.toContain, 1, /_expect_failure`,
      ``,
      `      ; create an expectation, arrays also support toContain`,
      `      e = it.expects(findgen(5))`,
      ``,
      `        e.toContain, 1`,
      `        e._not_.toContain, 5`,
      `        e.toContain, 5, /_expect_failure`,
      `        e._not_.toContain, 1, /_expect_failure`,
      ``,
      `; generate a nice summary to visualize`,
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
        `; h+`,
        `; Copyright (c) 2018 Harris Geospatial Solutions, Inc.`,
        `;`,
        `; Licensed under MIT. See LICENSE.txt for additional details and information.`,
        `; h-`,
        ``,
        `compile_opt idl2, hidden`,
        ``,
        `; lets test this!`,
        `l = luna(/in_package)`,
        ``,
        `  ; create a new suite of tests`,
        `  suite = l.suite('Test suite for the Luna tester')`,
        ``,
        `    ; create a new test for our suite`,
        `    it = suite.test('makes sure tests for checking array elements are valid')`,
        ``,
        `      ; create an expectation`,
        `      e = it.expects(findgen(5))`,
        ``,
        `        ; check that we are valid`,
        `        e.toFindInArray, 1.0`,
        `        e._not_.toFindInArray, 5.0`,
        `        e.toFindInArray, 5.0, /_expect_failure`,
        `        e._not_.toFindInArray, 1.0, /_expect_failure`,
        ``,
        `        catch, err`,
        `        if (err ne 0) then begin`,
        `          catch, /cancel`,
        `          message, /reset`,
        `        endif else begin`,
        `          ; make sure that we cant find array in array`,
        `          e.toFindInArray, fltarr(2)`,
        `          catch, /cancel`,
        `          message, 'Expected an error to be thrown'`,
        `        endelse`,
        ``,
        `      ; create an expectation`,
        `      e = it.expects(5)`,
        ``,
        `        catch, err`,
        `        if (err ne 0) then begin`,
        `          catch, /cancel`,
        `          message, /reset`,
        `        endif else begin`,
        `          ; make sure we cant find element in scalar`,
        `          e.toFindInArray, 1.0`,
        `          catch, /cancel`,
        `          message, 'Expected an error to be thrown'`,
        `        endelse`,
        ``,
        `    ; create a new test for our suite`,
        `    it = suite.test('makes sure tests for checking list elements are valid')`,
        ``,
        `      ; create an expectation`,
        `      e = it.expects(list(0, 1, 2, 3, 4))`,
        ``,
        `        ; check that we are valid`,
        `        e.toContain, 1`,
        `        e._not_.toContain, 5`,
        `        e.toContain, 5, /_expect_failure`,
        `        e._not_.toContain, 1, /_expect_failure`,
        ``,
        `      ; create an expectation, arrays also support toContain`,
        `      e = it.expects(findgen(5))`,
        ``,
        `        e.toContain, 1`,
        `        e._not_.toContain, 5`,
        `        e.toContain, 5, /_expect_failure`,
        `        e._not_.toContain, 1, /_expect_failure`,
        ``,
        `; generate a nice summary to visualize`,
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
    const expectedProblems: SyntaxProblems = [];

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
