import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify doc formatting`, () => {
  it(`[auto generated] close and auto populate existing docs block`, async () => {
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
      `;`,
      `function myPro, a, c, kw1 = kw1, kw=kw`,
      ` compile_opt idl2`,
      ` print, 'Hello world'`,
      ``,
      `  return, 42`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Returns: any`,
        `;`,
        `; :Arguments:`,
        `;   a: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   c: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `; :Keywords:`,
        `;   kw: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   kw1: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `function myPro, a, c, kw1 = kw1, kw = kw`,
        `  compile_opt idl2`,
        `  print, 'Hello world'`,
        ``,
        `  return, 42`,
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
        code: 64,
        info: 'Parameter is missing from documentation: "a"',
        start: [16, 16, 1],
        end: [16, 16, 1],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "c"',
        start: [16, 19, 1],
        end: [16, 19, 1],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "kw1"',
        start: [16, 22, 3],
        end: [16, 22, 3],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "kw"',
        start: [16, 33, 2],
        end: [16, 33, 2],
      },
      {
        code: 52,
        info: 'Expected a documentation tag for ":Returns:" since this is a function or function method',
        start: [0, 0, 2],
        end: [1, 0, 1],
      },
      {
        code: 48,
        info: 'Argument(s) are missing from the documentation for the routine',
        start: [0, 0, 2],
        end: [1, 0, 1],
      },
      {
        code: 50,
        info: 'Keywords(s) are missing from the documentation for the routine',
        start: [0, 0, 2],
        end: [1, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [16, 28, 3],
        end: [16, 28, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [16, 36, 2],
        end: [16, 36, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [16, 16, 1],
        end: [16, 16, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [16, 19, 1],
        end: [16, 19, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] capture default content and re-work`, async () => {
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
      `; Header`,
      `;-`,
      `pro myPro`,
      ` compile_opt idl2`,
      ` print, 'Hello world'`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Description:`,
        `;   Header`,
        `;`,
        `;-`,
        `pro myPro`,
        `  compile_opt idl2`,
        `  print, 'Hello world'`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] add docs for procedures automatically`, async () => {
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
      `pro myPro, a, c, kw1 = kw1, kw=kw`,
      ` compile_opt idl2`,
      ` print, 'Hello world'`,
      ``,
      `  return, 42`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Arguments:`,
        `;   a: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   c: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `; :Keywords:`,
        `;   kw: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   kw1: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `pro myPro, a, c, kw1 = kw1, kw = kw`,
        `  compile_opt idl2`,
        `  print, 'Hello world'`,
        ``,
        `  return, 42`,
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
        code: 20,
        info: 'In procedures and main level programs, the "return" procedure cannot have values',
        start: [18, 2, 6],
        end: [18, 12, 0],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [14, 23, 3],
        end: [14, 23, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [14, 31, 2],
        end: [14, 31, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [14, 11, 1],
        end: [14, 11, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [14, 14, 1],
        end: [14, 14, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] add docs for functions automatically`, async () => {
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
      `function myPro2, a, c, kw1 = kw1, kw=kw`,
      ` compile_opt idl2`,
      ` print, 'Hello world'`,
      ``,
      `  return, 42`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Returns: any`,
        `;`,
        `; :Arguments:`,
        `;   a: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   c: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `; :Keywords:`,
        `;   kw: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   kw1: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `function myPro2, a, c, kw1 = kw1, kw = kw`,
        `  compile_opt idl2`,
        `  print, 'Hello world'`,
        ``,
        `  return, 42`,
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
        info: 'Unused variable "kw1"',
        start: [16, 29, 3],
        end: [16, 29, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [16, 37, 2],
        end: [16, 37, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [16, 17, 1],
        end: [16, 17, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [16, 20, 1],
        end: [16, 20, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] add docs for multiple routines at once`, async () => {
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
      `pro myPro, a, c, kw1 = kw1, kw=kw`,
      ` compile_opt idl2`,
      ` print, 'Hello world'`,
      ``,
      `end`,
      ``,
      `function myPro2, a, c, kw1 = kw1, kw=kw`,
      ` compile_opt idl2`,
      ` print, 'Hello world'`,
      ``,
      `  return, 42`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Arguments:`,
        `;   a: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   c: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `; :Keywords:`,
        `;   kw: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   kw1: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `pro myPro, a, c, kw1 = kw1, kw = kw`,
        `  compile_opt idl2`,
        `  print, 'Hello world'`,
        `end`,
        ``,
        `;+`,
        `; :Returns: any`,
        `;`,
        `; :Arguments:`,
        `;   a: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   c: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `; :Keywords:`,
        `;   kw: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   kw1: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `function myPro2, a, c, kw1 = kw1, kw = kw`,
        `  compile_opt idl2`,
        `  print, 'Hello world'`,
        ``,
        `  return, 42`,
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
        info: 'Unused variable "kw1"',
        start: [14, 23, 3],
        end: [14, 23, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [14, 31, 2],
        end: [14, 31, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [14, 11, 1],
        end: [14, 11, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [14, 14, 1],
        end: [14, 14, 1],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [35, 29, 3],
        end: [35, 29, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [35, 37, 2],
        end: [35, 37, 2],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [35, 17, 1],
        end: [35, 17, 1],
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [35, 20, 1],
        end: [35, 20, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] handle, and format correctly, multi-line headers`, async () => {
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
      `; :Something fancy:`,
      `;   Really cool information `,
      `; sdf`,
      `;-`,
      `pro test_things`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Something fancy:`,
        `;   Really cool information`,
        `;   sdf`,
        `;`,
        `;-`,
        `pro test_things`,
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
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [6, 0, 4],
        end: [6, 15, 0],
      },
      {
        code: 59,
        info: 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
        start: [3, 0, 5],
        end: [3, 0, 5],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated]  uses proper external name for keyword in auto-docs`, async () => {
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
      `pro test_things2, a, b, kw2 = kw222`,
      `  compile_opt idl2`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Arguments:`,
        `;   a: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   b: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `; :Keywords:`,
        `;   kw2: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `pro test_things2, a, b, kw2 = kw222`,
        `  compile_opt idl2`,
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
        info: 'Unused variable "kw222"',
        start: [12, 30, 5],
        end: [12, 30, 5],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [12, 18, 1],
        end: [12, 18, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [12, 21, 1],
        end: [12, 21, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated]  for only arguments`, async () => {
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
    const code = [`pro test_things2, a, b`, `  compile_opt idl2`, ``, `end`];

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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Arguments:`,
        `;   a: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   b: bidirectional, required, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `pro test_things2, a, b`,
        `  compile_opt idl2`,
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
        start: [8, 18, 1],
        end: [8, 18, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [8, 21, 1],
        end: [8, 21, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated]  for only keywords`, async () => {
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
      `pro test_things2, kw222=kw2, kw3 = kw3`,
      `  compile_opt idl2`,
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
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Keywords:`,
        `;   kw222: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;   kw3: bidirectional, optional, any`,
        `;     Placeholder docs for argument, keyword, or property`,
        `;`,
        `;-`,
        `pro test_things2, kw222 = kw2, kw3 = kw3`,
        `  compile_opt idl2`,
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
        info: 'Unused variable "kw2"',
        start: [8, 24, 3],
        end: [8, 24, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw3"',
        start: [8, 35, 3],
        end: [8, 35, 3],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
