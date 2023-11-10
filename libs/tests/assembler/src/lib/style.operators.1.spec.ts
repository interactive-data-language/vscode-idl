import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify operators`, () => {
  it(`[auto generated] pointers`, async () => {
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
      `; complex pointers`,
      `(*pstate).coDesCovIdArr[(*pstate).coDesCovIdArrIdx++] = ogc_wcs_descov(ev.top, (*pstate).owcs, covNames, '')`,
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
        `; complex pointers`,
        `(*pstate).coDesCovIdArr[(*pstate).coDesCovIdArrIdx++] = ogc_wcs_descov(ev.top, (*pstate).owcs, covNames, '')`,
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
        info: 'Undefined variable "pstate"',
        start: [3, 2, 6],
        end: [3, 2, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [3, 26, 6],
        end: [3, 26, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "ev"',
        start: [3, 71, 2],
        end: [3, 71, 2],
      },
      {
        code: 99,
        info: 'Undefined variable "pstate"',
        start: [3, 81, 6],
        end: [3, 81, 6],
      },
      {
        code: 104,
        info: 'Unused variable "covNames"',
        start: [3, 95, 8],
        end: [3, 95, 8],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] pointers`, async () => {
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
    const code = [`compile_opt idl2`, ``, `*ptr = 42`, `end`];

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
        `*ptr = 42`,
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
        info: 'Undefined variable "ptr"',
        start: [2, 1, 3],
        end: [2, 1, 3],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] operators that should not have spaces`, async () => {
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
      `a++`,
      `b--`,
      `++c`,
      `--d`,
      `a += 6`,
      `y -= 42`,
      `m = --6`,
      `n = ++4`,
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
        `a++`,
        `b--`,
        `++c`,
        `--d`,
        `a += 6`,
        `y -= 42`,
        `m = --6`,
        `n = ++4`,
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
        code: 101,
        info: 'Variable is used before definition "a"',
        start: [2, 0, 1],
        end: [2, 0, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "b"',
        start: [3, 0, 1],
        end: [3, 0, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "c"',
        start: [4, 2, 1],
        end: [4, 2, 1],
      },
      {
        code: 99,
        info: 'Undefined variable "d"',
        start: [5, 2, 1],
        end: [5, 2, 1],
      },
      {
        code: 104,
        info: 'Unused variable "y"',
        start: [7, 0, 1],
        end: [7, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "m"',
        start: [8, 0, 1],
        end: [8, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "n"',
        start: [9, 0, 1],
        end: [9, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] handle tilde`, async () => {
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
      `if ~keyword_set(difference_raster_uri) then difference_raster_uri = e.GetTemporaryFilename()`,
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
        `if ~keyword_set(difference_raster_uri) then difference_raster_uri = e.getTemporaryFilename()`,
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
        code: 101,
        info: 'Variable is used before definition "difference_raster_uri"',
        start: [0, 16, 21],
        end: [0, 16, 21],
      },
      {
        code: 99,
        info: 'Undefined variable "e"',
        start: [0, 68, 1],
        end: [0, 68, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] pointer dereference and multiplication`, async () => {
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
      `a = 5*10`,
      `(*ptr).prop = 5`,
      `b = *ptr`,
      `segsUpper.Add, * overlaps.LOWER[mapXY[0], mapXY[1] - 1], /EXTRACT`,
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
        `a = 5 * 10`,
        `(*ptr).prop = 5`,
        `b = *ptr`,
        `segsUpper.add, *overlaps.lower[mapXY[0], mapXY[1] - 1], /extract`,
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
        info: 'Undefined variable "ptr"',
        start: [2, 2, 3],
        end: [2, 2, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "ptr"',
        start: [3, 5, 3],
        end: [3, 5, 3],
      },
      {
        code: 99,
        info: 'Undefined variable "segsUpper"',
        start: [4, 0, 9],
        end: [4, 0, 9],
      },
      {
        code: 99,
        info: 'Undefined variable "overlaps"',
        start: [4, 17, 8],
        end: [4, 17, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "mapXY"',
        start: [4, 32, 5],
        end: [4, 32, 5],
      },
      {
        code: 99,
        info: 'Undefined variable "mapXY"',
        start: [4, 42, 5],
        end: [4, 42, 5],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [1, 0, 1],
        end: [1, 0, 1],
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [3, 0, 1],
        end: [3, 0, 1],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] remove spaces before operators where we do not need then`, async () => {
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
      `  a = -  1`,
      `  mypro, -  1`,
      ``,
      `  ; create a struture to store information about our tile overlaps`,
      `  overlaps = { $`,
      `    IDX_X: - 0l $`,
      `    }`,
      `deltas = ranges[1, *]-ranges[0, *]`,
      `idxMin = [0 : - 2]`,
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
        `a = -1`,
        `mypro, -1`,
        ``,
        `; create a struture to store information about our tile overlaps`,
        `overlaps = { $`,
        `  idx_x: -0l $`,
        `  }`,
        `deltas = ranges[1, *] - ranges[0, *]`,
        `idxMin = [0 : -2]`,
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
        info: 'Undefined variable "ranges"',
        start: [9, 9, 6],
        end: [9, 9, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "ranges"',
        start: [9, 22, 6],
        end: [9, 22, 6],
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [2, 2, 1],
        end: [2, 2, 1],
      },
      {
        code: 104,
        info: 'Unused variable "overlaps"',
        start: [6, 2, 8],
        end: [6, 2, 8],
      },
      {
        code: 104,
        info: 'Unused variable "deltas"',
        start: [9, 0, 6],
        end: [9, 0, 6],
      },
      {
        code: 104,
        info: 'Unused variable "idxMin"',
        start: [10, 0, 6],
        end: [10, 0, 6],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] preserve spacing here`, async () => {
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
    const code = [`a = ['Anomaly Detection: ' + task.MEAN_CALCULATION_METHOD]`];

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
        `a = ['Anomaly Detection: ' + task.mean_calculation_method]`,
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
        info: 'Undefined variable "task"',
        start: [0, 29, 4],
        end: [0, 29, 4],
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

  it(`[auto generated] preserve spacing here too`, async () => {
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
    const code = [`cs = !dpi *[0d : num_period - 1]`];

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
        `cs = !dpi * [0d : num_period - 1]`,
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
        info: 'Undefined variable "num_period"',
        start: [0, 17, 10],
        end: [0, 17, 10],
      },
      {
        code: 104,
        info: 'Unused variable "cs"',
        start: [0, 0, 2],
        end: [0, 0, 2],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] operators by paren get properly ignored for trimming`, async () => {
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
      `  if (and filtMask and igMask) then filters = 'Image Files'`,
      `  if (eq filtMask and igMask) then filters = 'Image Files'`,
      `  if (ge filtMask and igMask) then filters = 'Image Files'`,
      `  if (gt filtMask and igMask) then filters = 'Image Files'`,
      `  if (le filtMask and igMask) then filters = 'Image Files'`,
      `  if (lt filtMask and igMask) then filters = 'Image Files'`,
      `  if (mod filtMask and igMask) then filters = 'Image Files'`,
      `  if (ne filtMask and igMask) then filters = 'Image Files'`,
      `  if (not filtMask and igMask) then filters = 'Image Files'`,
      `  if (or filtMask and igMask) then filters = 'Image Files'`,
      `  if (xor filtMask and igMask) then filters = 'Image Files'`,
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
        `if (and filtMask and igMask) then filters = 'Image Files'`,
        `if (eq filtMask and igMask) then filters = 'Image Files'`,
        `if (ge filtMask and igMask) then filters = 'Image Files'`,
        `if (gt filtMask and igMask) then filters = 'Image Files'`,
        `if (le filtMask and igMask) then filters = 'Image Files'`,
        `if (lt filtMask and igMask) then filters = 'Image Files'`,
        `if (mod filtMask and igMask) then filters = 'Image Files'`,
        `if (ne filtMask and igMask) then filters = 'Image Files'`,
        `if (not filtMask and igMask) then filters = 'Image Files'`,
        `if (or filtMask and igMask) then filters = 'Image Files'`,
        `if (xor filtMask and igMask) then filters = 'Image Files'`,
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
        info: 'Undefined variable "filtMask"',
        start: [1, 10, 8],
        end: [1, 10, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [1, 23, 6],
        end: [1, 23, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [2, 9, 8],
        end: [2, 9, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [2, 22, 6],
        end: [2, 22, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [3, 9, 8],
        end: [3, 9, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [3, 22, 6],
        end: [3, 22, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [4, 9, 8],
        end: [4, 9, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [4, 22, 6],
        end: [4, 22, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [5, 9, 8],
        end: [5, 9, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [5, 22, 6],
        end: [5, 22, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [6, 9, 8],
        end: [6, 9, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [6, 22, 6],
        end: [6, 22, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [7, 10, 8],
        end: [7, 10, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [7, 23, 6],
        end: [7, 23, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [8, 9, 8],
        end: [8, 9, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [8, 22, 6],
        end: [8, 22, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [9, 10, 8],
        end: [9, 10, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [9, 23, 6],
        end: [9, 23, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [10, 9, 8],
        end: [10, 9, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [10, 22, 6],
        end: [10, 22, 6],
      },
      {
        code: 99,
        info: 'Undefined variable "filtMask"',
        start: [11, 10, 8],
        end: [11, 10, 8],
      },
      {
        code: 99,
        info: 'Undefined variable "igMask"',
        start: [11, 23, 6],
        end: [11, 23, 6],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
