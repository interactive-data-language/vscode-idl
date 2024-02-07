import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify structures`, () => {
  it(`[auto generated] simple`, async () => {
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
      `     compile_opt idl2    `,
      `fourty2   =  {  mystruct   }`,
      `        `,
      `end     `,
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
        `fourty2 = {Mystruct}`,
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
        code: 77,
        info: 'No matching structure/object/class definition for structure named "mystruct   "',
        start: [1, 16, 11],
        end: [1, 16, 11],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "fourty2"',
        start: [1, 0, 7],
        end: [1, 0, 7],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] structure`, async () => {
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
      `pro folderwatch__define`,
      `  compile_opt idl2, hidden`,
      `  on_error, 2`,
      ``,
      `  void = { $`,
      `    FOLDERWATCH, $`,
      `    inherits idl_object, $`,
      `    _folder: '', $`,
      `    _callback: '', $`,
      `    _userdata: ptr_new(), $`,
      `    _added: 0b, $`,
      `    _modified: 0b, $`,
      `    _removed: 0b, $`,
      `    _frequency: 0d, $`,
      `    _timerid: 0l, $`,
      `    _fileinfo: ptr_new(), $`,
      `    _recursive: 0b, $`,
      `    _active: 0b, $`,
      `    _incallback: 0b $`,
      `  }`,
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
        `pro folderwatch__define`,
        `  compile_opt idl2, hidden`,
        `  on_error, 2`,
        ``,
        `  void = { $`,
        `    Folderwatch, $`,
        `    inherits IDL_Object, $`,
        `    _folder: '', $`,
        `    _callback: '', $`,
        `    _userdata: ptr_new(), $`,
        `    _added: 0b, $`,
        `    _modified: 0b, $`,
        `    _removed: 0b, $`,
        `    _frequency: 0d, $`,
        `    _timerid: 0l, $`,
        `    _fileinfo: ptr_new(), $`,
        `    _recursive: 0b, $`,
        `    _active: 0b, $`,
        `    _incallback: 0b $`,
        `    }`,
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
        info: 'Unused variable "void"',
        start: [4, 2, 4],
        end: [4, 2, 4],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] structure with arrays`, async () => {
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
      `pro folderwatch__define`,
      `  compile_opt idl2, hidden`,
      `  on_error, 2`,
      ``,
      `  void = { $`,
      `      IDX_XY:   [0l, 0l], $`,
      `   RIGHT_MEANS: ptrarr(mapDims) $`,
      `  }`,
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
        `pro folderwatch__define`,
        `  compile_opt idl2, hidden`,
        `  on_error, 2`,
        ``,
        `  void = { $`,
        `    idx_xy: [0l, 0l], $`,
        `    right_means: ptrarr(mapDims) $`,
        `    }`,
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
        info: 'Undefined variable "mapDims"',
        start: [6, 23, 7],
        end: [6, 23, 7],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "void"',
        start: [4, 2, 4],
        end: [4, 2, 4],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] structure with line continuations regression`, async () => {
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
      `  compile_opt idl2, hidden`,
      `!null = {IDLNotebook, $`,
      `  _foo: 5}`,
      ``,
      `  !null = $`,
      `    {IDLNotebook, $`,
      `      _foo: 5}`,
      ``,
      `  !null = { $`,
      `    _foo: 5}`,
      ``,
      `  !null = $`,
      `  { $`,
      ` _foo: 5}`,
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
        `compile_opt idl2, hidden`,
        `!null = {IDLNotebook, $`,
        `  _foo: 5}`,
        ``,
        `!null = $`,
        `  {IDLNotebook, $`,
        `    _foo: 5}`,
        ``,
        `!null = { $`,
        `  _foo: 5}`,
        ``,
        `!null = $`,
        `  { $`,
        `    _foo: 5}`,
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
        code: 77,
        info: 'No matching structure/object/class definition for structure named "IDLNotebook"',
        start: [1, 9, 11],
        end: [1, 9, 11],
        canReport: true,
      },
      {
        code: 77,
        info: 'No matching structure/object/class definition for structure named "IDLNotebook"',
        start: [5, 5, 11],
        end: [5, 5, 11],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
