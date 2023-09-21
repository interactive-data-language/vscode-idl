import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify arg ordering`, () => {
  it(`[auto generated] matches the argument definition`, async () => {
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
      `; :Arguments:`,
      `;   a01: in, required, any`,
      `;     Placeholder docs for argument or keyword`,
      `;   a02: in, required, array`,
      `;     Placeholder docs for argument or keyword`,
      `;   a03: in, required, bigint`,
      `;     Placeholder docs for argument or keyword`,
      `;   a04: in, required, biginteger`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro my_thing, $`,
      `  a03, a04, a01, a02`,
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
        `;   a03: in, required, BigInteger`,
        `;     Placeholder docs for argument or keyword`,
        `;   a04: in, required, BigInteger`,
        `;     Placeholder docs for argument or keyword`,
        `;   a01: in, required, any`,
        `;     Placeholder docs for argument or keyword`,
        `;   a02: in, required, Array<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;`,
        `;-`,
        `pro my_thing, $`,
        `  a03, a04, a01, a02`,
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
        info: 'Unused variable "a03"',
        start: [13, 2, 3],
        end: [13, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a04"',
        start: [13, 7, 3],
        end: [13, 7, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a01"',
        start: [13, 12, 3],
        end: [13, 12, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a02"',
        start: [13, 17, 3],
        end: [13, 17, 3],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
