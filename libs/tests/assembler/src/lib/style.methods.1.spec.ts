import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify style for methods`, () => {
  it(`[auto generated] remove excess spaces`, async () => {
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
      `     compile_opt idl2`,
      ``,
      `a  = myclass  .  mymethod()`,
      `myclass  .  mymethod`,
      `a  = myclass  ->  mymethod()`,
      `myclass  ->  mymethod`,
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
        `compile_opt idl2`,
        ``,
        `a = myclass.mymethod()`,
        `myclass.mymethod`,
        `a = myclass.mymethod()`,
        `myclass.mymethod`,
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
        code: 99,
        info: 'Undefined variable "myclass"',
        start: [2, 5, 7],
        end: [2, 5, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "myclass"',
        start: [3, 0, 7],
        end: [3, 0, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "myclass"',
        start: [4, 5, 7],
        end: [4, 5, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "myclass"',
        start: [5, 0, 7],
        end: [5, 0, 7],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
