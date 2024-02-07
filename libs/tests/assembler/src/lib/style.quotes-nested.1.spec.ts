import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify double quote parsing`, () => {
  it(`[auto generated] preserve nested double quote when we use single`, async () => {
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
      ``,
      `message, 'Each dimension must be greater than 1."'`,
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
      style: { quotes: 'single' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        ``,
        `message, 'Each dimension must be greater than 1."'`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] preserve nested single quote when we use double`, async () => {
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
      ``,
      `message, "Each dimension must be greater than 1.'"`,
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
      style: { quotes: 'double' },
      autoFix: false,
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `compile_opt idl2`,
        ``,
        `message, "Each dimension must be greater than 1.'"`,
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
    const expectedProblems: SyntaxProblems = [];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
