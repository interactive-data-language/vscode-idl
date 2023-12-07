import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify comment`, () => {
  it(`[auto generated] all flavors of comments`, async () => {
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
      `a = 42      ;    comment OK`,
      `    ;; comment bad, now fixed    `,
      `; TODO:   something super crazy    `,
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
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `a = 42 ; comment OK`,
        `; ; comment bad, now fixed`,
        `; TODO:   something super crazy`,
        `compile_opt idl2`,
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
        code: 6,
        info: 'TODO: something super crazy',
        start: [2, 0, 35],
        end: [2, 0, 35],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [0, 0, 1],
        end: [0, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] limit formatting for routine comments`, async () => {
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
      `;   My procedure`,
      `;`,
      `;;   Preserve spacing in routine docs`,
      `   ;   fix left alignment though`,
      `;   And trim the right side of the comment blocks       `,
      `; :Args:`,
      `;  var1: in, required, unknown`,
      `;    My favorite thing`,
      `; :Keywords:`,
      `;  kw1: in, optional, type=boolean`,
      `;    Super Cool flag`,
      `;`,
      `;-`,
      `pro mypro, var1, var2, KW1=kw1, KW2=kw2`,
      `  compile_opt idl2`,
      `  if !true then begin`,
      `  print, 'yes'`,
      `  endif`,
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
        `;   My procedure`,
        `;`,
        `;;   Preserve spacing in routine docs`,
        `;   fix left alignment though`,
        `;   And trim the right side of the comment blocks`,
        `; :Args:`,
        `;  var1: in, required, unknown`,
        `;    My favorite thing`,
        `; :Keywords:`,
        `;  kw1: in, optional, type=boolean`,
        `;    Super Cool flag`,
        `;`,
        `;-`,
        `pro mypro, var1, var2, kw1 = kw1, kw2 = kw2`,
        `  compile_opt idl2`,
        `  if !true then begin`,
        `    print, 'yes'`,
        `  endif`,
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
        code: 59,
        info: 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
        start: [3, 0, 37],
        end: [3, 0, 37],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "var2"',
        start: [14, 17, 4],
        end: [14, 17, 4],
      },
      {
        code: 64,
        info: 'Parameter is missing from documentation: "kw2"',
        start: [14, 32, 3],
        end: [14, 32, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [14, 27, 3],
        end: [14, 27, 3],
      },
      {
        code: 104,
        info: 'Unused variable "kw2"',
        start: [14, 36, 3],
        end: [14, 36, 3],
      },
      {
        code: 104,
        info: 'Unused variable "var1"',
        start: [14, 11, 4],
        end: [14, 11, 4],
      },
      {
        code: 104,
        info: 'Unused variable "var2"',
        start: [14, 17, 4],
        end: [14, 17, 4],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] add placeholder case for variable docs`, async () => {
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
      `  compile_opt idl2`,
      ``,
      `  ;+    comment for variable`,
      `  ;  leave indent formatting alone for now`,
      `  ;-   stopped here`,
      `  a = 'something'`,
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
        ``,
        `;+    comment for variable`,
        `;  leave indent formatting alone for now`,
        `;-   stopped here`,
        `a = 'something'`,
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
        code: 59,
        info: 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
        start: [3, 2, 40],
        end: [3, 2, 40],
      },
      {
        code: 59,
        info: 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
        start: [4, 2, 17],
        end: [4, 2, 17],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [5, 2, 1],
        end: [5, 2, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated]  do not trim string before comment after line continuation`, async () => {
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
      `      ; left align`,
      `   a = 5      ; trim`,
      `MESSAGE, $ ; keep my space!`,
      `'baaaad'`,
      `end`,
      ``,
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
        `; left align`,
        `a = 5 ; trim`,
        `message, $ ; keep my space!`,
        `  'baaaad'`,
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
        start: [2, 3, 1],
        end: [2, 3, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
