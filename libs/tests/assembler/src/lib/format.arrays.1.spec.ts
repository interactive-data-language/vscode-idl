import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify array formatting`, () => {
  it(`[auto generated] basic formatting`, async () => {
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
    const code = [`compile_opt idl2`, ``, `a = [1,2,3,4,5]`, `end`];

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
        `a = [1, 2, 3, 4, 5]`,
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
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] line continuation 1`, async () => {
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
      `a = [ $`,
      `  1,  $`,
      `  2,$`,
      `  3, $`,
      `  4,   $`,
      `  5 $`,
      `]`,
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
        `a = [ $`,
        `  1, $`,
        `  2, $`,
        `  3, $`,
        `  4, $`,
        `  5 $`,
        `  ]`,
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
        start: [2, 0, 1],
        end: [2, 0, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] indexing and properties`, async () => {
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
      `for xx = 0, numRows-1 do begin`,
      `xRows[xx].Index       = xCobs[xx].Index`,
      `xRows[xx].Name        = xCobs[xx].Name`,
      `xRows[xx].Label       = xCobs[xx].Label`,
      `xRows[xx].SRS_Name    = xCobs[xx].SRS_Name`,
      `xRows[xx].Pos1        = xCobs[xx].Pos1`,
      `xRows[xx].Dims1       = xCobs[xx].Dims1`,
      `xRows[xx].Pos2        = xCobs[xx].Pos2`,
      `xRows[xx].Dims2       = xCobs[xx].Dims2`,
      `xRows[xx].Tm_Pos1     = xCobs[xx].Tm_Pos1`,
      `xRows[xx].Tm_Pos2     = xCobs[xx].Tm_Pos2`,
      `endfor`,
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
        `for xx = 0, numRows - 1 do begin`,
        `  xRows[xx].index = xCobs[xx].index`,
        `  xRows[xx].name = xCobs[xx].name`,
        `  xRows[xx].label = xCobs[xx].label`,
        `  xRows[xx].srs_name = xCobs[xx].srs_name`,
        `  xRows[xx].pos1 = xCobs[xx].pos1`,
        `  xRows[xx].dims1 = xCobs[xx].dims1`,
        `  xRows[xx].pos2 = xCobs[xx].pos2`,
        `  xRows[xx].dims2 = xCobs[xx].dims2`,
        `  xRows[xx].tm_pos1 = xCobs[xx].tm_pos1`,
        `  xRows[xx].tm_pos2 = xCobs[xx].tm_pos2`,
        `endfor`,
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
        info: 'Undefined variable "numRows"',
        start: [2, 12, 7],
        end: [2, 12, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [3, 0, 5],
        end: [3, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [3, 24, 5],
        end: [3, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [4, 0, 5],
        end: [4, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [4, 24, 5],
        end: [4, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [5, 0, 5],
        end: [5, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [5, 24, 5],
        end: [5, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [6, 0, 5],
        end: [6, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [6, 24, 5],
        end: [6, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [7, 0, 5],
        end: [7, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [7, 24, 5],
        end: [7, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [8, 0, 5],
        end: [8, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [8, 24, 5],
        end: [8, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [9, 0, 5],
        end: [9, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [9, 24, 5],
        end: [9, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [10, 0, 5],
        end: [10, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [10, 24, 5],
        end: [10, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [11, 0, 5],
        end: [11, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [11, 24, 5],
        end: [11, 24, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xRows"',
        start: [12, 0, 5],
        end: [12, 0, 5],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "xCobs"',
        start: [12, 24, 5],
        end: [12, 24, 5],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] array indexing spacing`, async () => {
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
      `overlaps.LOWER[sIdx] = ptr_new(segs[tSub[0] : tSub[2], tSub[3]])`,
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
        `overlaps.lower[sIdx] = ptr_new(segs[tSub[0] : tSub[2], tSub[3]])`,
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
        info: 'Undefined variable "overlaps"',
        start: [0, 0, 8],
        end: [0, 0, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "sIdx"',
        start: [0, 15, 4],
        end: [0, 15, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "segs"',
        start: [0, 31, 4],
        end: [0, 31, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "tSub"',
        start: [0, 36, 4],
        end: [0, 36, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "tSub"',
        start: [0, 46, 4],
        end: [0, 46, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "tSub"',
        start: [0, 55, 4],
        end: [0, 55, 4],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] brackets for access (via overload)`, async () => {
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
    const code = [`meta['band names'] = 'Awesome Label Regions'`];

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
        `meta['band names'] = 'Awesome Label Regions'`,
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
        info: 'Undefined variable "meta"',
        start: [0, 0, 4],
        end: [0, 0, 4],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] array after comma as argument`, async () => {
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
      `  inputValidator, hash( $`,
      `'buffer', ['number', 'required'])`,
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
        `inputValidator, hash( $`,
        `  'buffer', ['number', 'required'])`,
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
