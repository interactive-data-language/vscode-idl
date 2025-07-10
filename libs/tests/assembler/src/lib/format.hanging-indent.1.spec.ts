import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/types/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify hanging indent`, () => {
  it(`[auto generated] works the right way when enabled`, async () => {
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
      `function myclass::mymethod, $`,
      `  a, b, c`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `pro myPro, $`,
      `  input_param`,
      `  compile_opt idl2`,
      `  print, 'Foo!'`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `raster = ENVIRaster(ine, $`,
      `  make_array(foo, bar, $`,
      `    thing), $`,
      `  )`,
      ``,
      `triangulate, a, b, c, $`,
      `  connectivity = conn`,
      ``,
      `foo = [1, 2, 3, $`,
      `  4, 5, 6]`,
      ``,
      `bar = (1 + $`,
      `  [1, 2, 3, $`,
      `  4, 5, 6] $`,
      `)`,
      ``,
      `struct = {!cpu, $`,
      `  field: 'foo'}`,
      ``,
      `end`,
      ``,
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
      hangingIndent: true,
      autoDoc: false,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::mymethod, $`,
        `                          a, b, c`,
        `  compile_opt idl2`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro myPro, $`,
        `         input_param`,
        `  compile_opt idl2`,
        `  print, 'Foo!'`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `raster = ENVIRaster(ine, $`,
        `                    make_array(foo, bar, $`,
        `             thing), $`,
        `                    )`,
        ``,
        `triangulate, a, b, c, $`,
        `           connectivity = conn`,
        ``,
        `foo = [1, 2, 3, $`,
        `       4, 5, 6]`,
        ``,
        `bar = (1 + $`,
        `       [1, 2, 3, $`,
        `   4, 5, 6] $`,
        `       )`,
        ``,
        `struct = {!cpu, $`,
        `          field: 'foo'}`,
        ``,
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
        info: 'Unused variable "a"',
        start: [1, 2, 1],
        end: [1, 2, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [1, 5, 1],
        end: [1, 5, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [1, 8, 1],
        end: [1, 8, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "input_param"',
        start: [8, 2, 11],
        end: [8, 2, 11],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "foo"',
        start: [16, 13, 3],
        end: [16, 13, 3],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "bar"',
        start: [16, 18, 3],
        end: [16, 18, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "thing"',
        start: [17, 4, 5],
        end: [17, 4, 5],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "raster"',
        start: [15, 0, 6],
        end: [15, 0, 6],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "ine"',
        start: [15, 20, 3],
        end: [15, 20, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [20, 13, 1],
        end: [20, 13, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [20, 16, 1],
        end: [20, 16, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [20, 19, 1],
        end: [20, 19, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "conn"',
        start: [21, 17, 4],
        end: [21, 17, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "struct"',
        start: [31, 0, 6],
        end: [31, 0, 6],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] works the right way when disabled`, async () => {
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
      `function myclass::mymethod, $`,
      `  a, b, c`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `pro myPro, $`,
      `  input_param`,
      `  compile_opt idl2`,
      `  print, 'Foo!'`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `raster = ENVIRaster(ine, $`,
      `  make_array(foo, bar, $`,
      `    thing), $`,
      `  )`,
      ``,
      `triangulate, a, b, c, $`,
      `  connectivity = conn`,
      ``,
      `foo = [1, 2, 3, $`,
      `  4, 5, 6]`,
      ``,
      `bar = (1 + $`,
      `  [1, 2, 3, $`,
      `  4, 5, 6] $`,
      `)`,
      ``,
      `struct = {!cpu, $`,
      `  field: 'foo'}`,
      ``,
      `end`,
      ``,
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
      hangingIndent: false,
      autoDoc: false,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `function myclass::mymethod, $`,
        `  a, b, c`,
        `  compile_opt idl2`,
        ``,
        `  return, 1`,
        `end`,
        ``,
        `pro myPro, $`,
        `  input_param`,
        `  compile_opt idl2`,
        `  print, 'Foo!'`,
        `end`,
        ``,
        `compile_opt idl2`,
        ``,
        `raster = ENVIRaster(ine, $`,
        `  make_array(foo, bar, $`,
        `    thing), $`,
        `  )`,
        ``,
        `triangulate, a, b, c, $`,
        `  connectivity = conn`,
        ``,
        `foo = [1, 2, 3, $`,
        `  4, 5, 6]`,
        ``,
        `bar = (1 + $`,
        `  [1, 2, 3, $`,
        `  4, 5, 6] $`,
        `)`,
        ``,
        `struct = {!cpu, $`,
        `  field: 'foo'}`,
        ``,
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
        info: 'Unused variable "a"',
        start: [1, 2, 1],
        end: [1, 2, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [1, 5, 1],
        end: [1, 5, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [1, 8, 1],
        end: [1, 8, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "input_param"',
        start: [8, 2, 11],
        end: [8, 2, 11],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "foo"',
        start: [16, 13, 3],
        end: [16, 13, 3],
        canReport: true,
      },
      {
        code: 101,
        info: 'Variable is used before definition "bar"',
        start: [16, 18, 3],
        end: [16, 18, 3],
        canReport: true,
      },
      {
        code: 99,
        info: 'Undefined variable "thing"',
        start: [17, 4, 5],
        end: [17, 4, 5],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "raster"',
        start: [15, 0, 6],
        end: [15, 0, 6],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "ine"',
        start: [15, 20, 3],
        end: [15, 20, 3],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "a"',
        start: [20, 13, 1],
        end: [20, 13, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "b"',
        start: [20, 16, 1],
        end: [20, 16, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "c"',
        start: [20, 19, 1],
        end: [20, 19, 1],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "conn"',
        start: [21, 17, 4],
        end: [21, 17, 4],
        canReport: true,
      },
      {
        code: 104,
        info: 'Unused variable "struct"',
        start: [31, 0, 6],
        end: [31, 0, 6],
        canReport: true,
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
