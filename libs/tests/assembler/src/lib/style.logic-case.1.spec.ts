import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify we style case`, () => {
  it(`[auto generated] formats messy case`, async () => {
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
      `CASE x OF`,
      `   ; something cool`,
      `1 $`,
      `  : $`,
      `   PRINT, 'one' + func()`,
      `  2 $`,
      `  : $`,
      `  PRINT, 'one' + func()`,
      `     ELSE: BEGIN`,
      `   dat = {myStruct}`,
      `   PRINT, 'Please enter a value between 1 and 4'`,
      `   END`,
      `ENDCASE`,
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
        `case x of`,
        `  ; something cool`,
        `  1 $`,
        `  : $`,
        `    print, 'one' + func()`,
        `  2 $`,
        `  : $`,
        `    print, 'one' + func()`,
        `  else: begin`,
        `    dat = {MyStruct}`,
        `    print, 'Please enter a value between 1 and 4'`,
        `  end`,
        `endcase`,
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
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 4],
        end: [0, 0, 4],
        canReport: true,
      },
      {
        code: 77,
        info: 'No matching structure/object/class definition for structure named "myStruct"',
        start: [9, 10, 8],
        end: [9, 10, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "x"',
        start: [0, 5, 1],
        end: [0, 5, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "dat"',
        start: [9, 3, 3],
        end: [9, 3, 3],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] formats nested case`, async () => {
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
      `CASE x OF`,
      `1: PRINT, 'one'`,
      `ELSE: BEGIN`,
      ` CASE x OF`,
      `      2: PRINT, 'two'`,
      `    ELSE: BEGIN`,
      `  END`,
      `     ENDCASE`,
      `END`,
      `ENDCASE`,
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
        `case x of`,
        `  1: print, 'one'`,
        `  else: begin`,
        `    case x of`,
        `      2: print, 'two'`,
        `      else: begin`,
        `      end`,
        `    endcase`,
        `  end`,
        `endcase`,
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
        code: 38,
        info: 'No "compile_opt" statement present in routine or main level program. While not required, enforces consistency and helps prevent bugs with functions, variables, and arrays.',
        start: [0, 0, 4],
        end: [0, 0, 4],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "x"',
        start: [0, 5, 1],
        end: [0, 5, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "x"',
        start: [3, 6, 1],
        end: [3, 6, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] Properly format indents for case without line continuation`, async () => {
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
      `  ; determine how to proceed`,
      `  case !true of`,
      `    ; only have positive values`,
      `    negative eq !null: begin`,
      `        ranges[*, i] = [0, positive]`,
      `      end`,
      ``,
      `    ; only have negative values`,
      `    positive eq !null: begin`,
      `        ranges[*, i] = [-negative, 0]`,
      `      end`,
      ``,
      `    ; have positive and negative values`,
      `    else: begin`,
      `      ; get our bounds`,
      `      maxVal = negative > positive`,
      ``,
      `      ; populate range`,
      `      ranges[*, i] = [-maxVal, maxVal]`,
      `    end`,
      `  endcase`,
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
        `; determine how to proceed`,
        `case !true of`,
        `  ; only have positive values`,
        `  negative eq !null: begin`,
        `    ranges[*, i] = [0, positive]`,
        `  end`,
        ``,
        `  ; only have negative values`,
        `  positive eq !null: begin`,
        `    ranges[*, i] = [-negative, 0]`,
        `  end`,
        ``,
        `  ; have positive and negative values`,
        `  else: begin`,
        `    ; get our bounds`,
        `    maxVal = negative > positive`,
        ``,
        `    ; populate range`,
        `    ranges[*, i] = [-maxVal, maxVal]`,
        `  end`,
        `endcase`,
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
        info: 'Undefined variable "negative"',
        start: [4, 4, 8],
        end: [4, 4, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ranges"',
        start: [5, 8, 6],
        end: [5, 8, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "i"',
        start: [5, 18, 1],
        end: [5, 18, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "positive"',
        start: [5, 27, 8],
        end: [5, 27, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "positive"',
        start: [9, 4, 8],
        end: [9, 4, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ranges"',
        start: [10, 8, 6],
        end: [10, 8, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "i"',
        start: [10, 18, 1],
        end: [10, 18, 1],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "negative"',
        start: [10, 25, 8],
        end: [10, 25, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "negative"',
        start: [16, 15, 8],
        end: [16, 15, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "positive"',
        start: [16, 26, 8],
        end: [16, 26, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ranges"',
        start: [19, 6, 6],
        end: [19, 6, 6],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "i"',
        start: [19, 16, 1],
        end: [19, 16, 1],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] removes spaces in logical default`, async () => {
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
      `case N_PARAMS() of`,
      `else    : ; remove my space to the left after "else"`,
      `endcase`,
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
        `case n_params() of`,
        `  else: ; remove my space to the left after "else"`,
        `endcase`,
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

  it(`[auto generated] properly formats this case/switch style`, async () => {
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
      `; Just determine what to do and register.`,
      `case 1 of`,
      ``,
      `  keyword_set(visualization): $`,
      `    oSystem->RegisterVisualization, strName, strClassName, _EXTRA = _extra`,
      ``,
      `keyword_set(annotation): $`,
      `  oSystem->RegisterAnnotation, strName, strClassName, _EXTRA = _extra`,
      ``,
      `keyword_set(user_interface): $`,
      `oSystem->RegisterUserInterface, strName, strClassName, _EXTRA = _extra`,
      ``,
      `keyword_set(ui_panel): $`,
      `oSystem->RegisterUIPanel, strName, strClassName, _EXTRA = _extra`,
      ``,
      `keyword_set(ui_service): $`,
      `oSystem->RegisterUIService, strName, strClassName, _EXTRA = _extra`,
      ``,
      `keyword_set(file_reader): $`,
      `oSystem->RegisterFileReader, strName, strClassName, _EXTRA = _extra`,
      ``,
      `keyword_set(file_writer): $`,
      `oSystem->RegisterFileWriter, strName, strClassName, _EXTRA = _extra`,
      ``,
      `else: $`,
      `oSystem->RegisterTool, strName, strClassName, _EXTRA = _extra`,
      ``,
      `endcase`,
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
        `; Just determine what to do and register.`,
        `case 1 of`,
        `  keyword_set(visualization): $`,
        `    oSystem.registerVisualization, strName, strClassName, _extra = _extra`,
        ``,
        `  keyword_set(annotation): $`,
        `    oSystem.registerAnnotation, strName, strClassName, _extra = _extra`,
        ``,
        `  keyword_set(user_interface): $`,
        `    oSystem.registerUserInterface, strName, strClassName, _extra = _extra`,
        ``,
        `  keyword_set(ui_panel): $`,
        `    oSystem.registerUiPanel, strName, strClassName, _extra = _extra`,
        ``,
        `  keyword_set(ui_service): $`,
        `    oSystem.registerUiService, strName, strClassName, _extra = _extra`,
        ``,
        `  keyword_set(file_reader): $`,
        `    oSystem.registerFileReader, strName, strClassName, _extra = _extra`,
        ``,
        `  keyword_set(file_writer): $`,
        `    oSystem.registerFileWriter, strName, strClassName, _extra = _extra`,
        ``,
        `  else: $`,
        `    oSystem.registerTool, strName, strClassName, _extra = _extra`,
        `endcase`,
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
        info: 'Undefined variable "visualization"',
        start: [4, 14, 13],
        end: [4, 14, 13],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oSystem"',
        start: [5, 4, 7],
        end: [5, 4, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "annotation"',
        start: [7, 12, 10],
        end: [7, 12, 10],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oSystem"',
        start: [8, 2, 7],
        end: [8, 2, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "user_interface"',
        start: [10, 12, 14],
        end: [10, 12, 14],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oSystem"',
        start: [11, 0, 7],
        end: [11, 0, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ui_panel"',
        start: [13, 12, 8],
        end: [13, 12, 8],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oSystem"',
        start: [14, 0, 7],
        end: [14, 0, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "ui_service"',
        start: [16, 12, 10],
        end: [16, 12, 10],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oSystem"',
        start: [17, 0, 7],
        end: [17, 0, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "file_reader"',
        start: [19, 12, 11],
        end: [19, 12, 11],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oSystem"',
        start: [20, 0, 7],
        end: [20, 0, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "file_writer"',
        start: [22, 12, 11],
        end: [22, 12, 11],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oSystem"',
        start: [23, 0, 7],
        end: [23, 0, 7],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "oSystem"',
        start: [26, 0, 7],
        end: [26, 0, 7],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
