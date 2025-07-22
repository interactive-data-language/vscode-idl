import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Convert old IDL Doc comments`, () => {
  it(`[auto generated] from multi-line complex docs`, async () => {
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
      `; @Param`,
      `;   TheParam {out}{required}`,
      `;     My docs for a parameter`,
      `;`,
      `; @Keyword`,
      `;   TheKeyword {in}{optional}{type=boolean}{default=0}`,
      `;     My docs for a keyword`,
      `;`,
      `;-`,
      `pro mypro2, TheParam, thekeyword = keyword`,
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
        `;   TheParam: out, required, any`,
        `;     My docs for a parameter`,
        `;`,
        `; :Keywords:`,
        `;   thekeyword: in, optional, Boolean`,
        `;     My docs for a keyword`,
        `;`,
        `;-`,
        `pro mypro2, TheParam, thekeyword = keyword`,
        `  compile_opt idl2`,
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
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before if not def files
      if (tokenized.type !== 'def') {
        expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
      }
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "keyword"',
        start: [10, 35, 7],
        end: [10, 35, 7],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "TheParam"',
        start: [10, 12, 8],
        end: [10, 12, 8],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
