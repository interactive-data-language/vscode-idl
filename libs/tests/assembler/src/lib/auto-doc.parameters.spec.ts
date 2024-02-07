import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify parameter formatting`, () => {
  it(`[auto generated] sort arguments by appearance and add bad at the end`, async () => {
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
      `; :Args:`,
      `;    a: in, required, int, private`,
      `;     Some cool statement`,
      `;   b: in, required, string`,
      `;     Some cool statement`,
      `;    c: in, required, int, private`,
      `;     Some cool statement`,
      `;`,
      `;-`,
      `pro myPro, a, c`,
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
        `; :Arguments:`,
        `;   a: in, required, Int, private`,
        `;     Some cool statement`,
        `;   c: in, required, Int, private`,
        `;     Some cool statement`,
        `;   b: in, required, String`,
        `;     Some cool statement`,
        `;`,
        `;-`,
        `pro myPro, a, c`,
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "b"',
        start: [4, 0, 27],
        end: [4, 0, 27],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [10, 11, 1],
        end: [10, 11, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [10, 14, 1],
        end: [10, 14, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] sort keywords alphabetically and add bad at the end`, async () => {
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
      `; :Keywords:`,
      `;   kw2: in, required, int`,
      `;     Some cool statement`,
      `;   kw: in, required, string`,
      `;     Some cool statement across`,
      `;`,
      `;     multiple lines`,
      `;   kw1: in, required, string`,
      `;     Some cool statement across`,
      `;`,
      `;-`,
      `pro myPro, kw1 = kw1, kw=kw`,
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
        `; :Keywords:`,
        `;   kw: in, required, String`,
        `;     Some cool statement across`,
        `;`,
        `;     multiple lines`,
        `;   kw1: in, required, String`,
        `;     Some cool statement across`,
        `;   kw2: in, required, Int`,
        `;     Some cool statement`,
        `;`,
        `;-`,
        `pro myPro, kw1 = kw1, kw = kw`,
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 63,
        info: 'Documented argument, keyword, or property does not exist: "kw2"',
        start: [2, 0, 26],
        end: [2, 0, 26],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw1"',
        start: [12, 17, 3],
        end: [12, 17, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "kw"',
        start: [12, 25, 2],
        end: [12, 25, 2],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
