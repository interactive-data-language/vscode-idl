import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we style ternary operators well`, () => {
  it(`[auto generated] simple case with spacing`, async () => {
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
    const code = [`nPrint = (nTiles lt 100) ? 1:ceil(nTiles / 100.0)`];

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
        `nPrint = (nTiles lt 100) ? 1 : ceil(nTiles / 100.0)`,
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
        info: 'Undefined variable "nTiles"',
        start: [0, 10, 6],
        end: [0, 10, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "nTiles"',
        start: [0, 34, 6],
        end: [0, 34, 6],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "nPrint"',
        start: [0, 0, 6],
        end: [0, 0, 6],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] Case to preserve spacing before else`, async () => {
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
    const code = [`oWorld = OBJ_VALID(oLayer) ? oLayer->GetWorld(): OBJ_NEW()`];

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
        `oWorld = obj_valid(oLayer) ? oLayer.getWorld() : obj_new()`,
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
        info: 'Undefined variable "oLayer"',
        start: [0, 19, 6],
        end: [0, 19, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oLayer"',
        start: [0, 29, 6],
        end: [0, 29, 6],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "oWorld"',
        start: [0, 0, 6],
        end: [0, 0, 6],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
