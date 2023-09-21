import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify type formatting`, () => {
  it(`[auto generated] parses and gives normalized appearance for all IDL types`, async () => {
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
      `;   a05: in, required, binary`,
      `;     Placeholder docs for argument or keyword`,
      `;   a06: in, required, bool`,
      `;     Placeholder docs for argument or keyword`,
      `;   a07: in, required, boolean`,
      `;     Placeholder docs for argument or keyword`,
      `;   a08: in, required, byte`,
      `;     Placeholder docs for argument or keyword`,
      `;   a09: in, required, complex`,
      `;     Placeholder docs for argument or keyword`,
      `;   a10: in, required, dcomplex`,
      `;     Placeholder docs for argument or keyword`,
      `;   a11: in, required, doublecomplex`,
      `;     Placeholder docs for argument or keyword`,
      `;   a12: in, required, dict`,
      `;     Placeholder docs for argument or keyword`,
      `;   a13: in, required, dictionary`,
      `;     Placeholder docs for argument or keyword`,
      `;   a14: in, required, float64`,
      `;     Placeholder docs for argument or keyword`,
      `;   a15: in, required, double`,
      `;     Placeholder docs for argument or keyword`,
      `;   a16: in, required, float32`,
      `;     Placeholder docs for argument or keyword`,
      `;   a17: in, required, float`,
      `;     Placeholder docs for argument or keyword`,
      `;   a18: in, required, hash`,
      `;     Placeholder docs for argument or keyword`,
      `;   a19: in, required, hex`,
      `;     Placeholder docs for argument or keyword`,
      `;   a20: in, required, int`,
      `;     Placeholder docs for argument or keyword`,
      `;   a21: in, required, integer`,
      `;     Placeholder docs for argument or keyword`,
      `;   a22: in, required, list`,
      `;     Placeholder docs for argument or keyword`,
      `;   a23: in, required, long`,
      `;     Placeholder docs for argument or keyword`,
      `;   a24: in, required, long64`,
      `;     Placeholder docs for argument or keyword`,
      `;   a25: in, required, null`,
      `;     Placeholder docs for argument or keyword`,
      `;   a26: in, required, number`,
      `;     Placeholder docs for argument or keyword`,
      `;   a27: in, required, class`,
      `;     Placeholder docs for argument or keyword`,
      `;   a28: in, required, object`,
      `;     Placeholder docs for argument or keyword`,
      `;   a29: in, required, octal`,
      `;     Placeholder docs for argument or keyword`,
      `;   a30: in, required, orderedhash`,
      `;     Placeholder docs for argument or keyword`,
      `;   a31: in, required, pointer`,
      `;     Placeholder docs for argument or keyword`,
      `;   a32: in, required, string`,
      `;     Placeholder docs for argument or keyword`,
      `;   a33: in, required, structure`,
      `;     Placeholder docs for argument or keyword`,
      `;   a34: in, required, uint`,
      `;     Placeholder docs for argument or keyword`,
      `;   a35: in, required, unsignedint`,
      `;     Placeholder docs for argument or keyword`,
      `;   a36: in, required, unsignedinteger`,
      `;     Placeholder docs for argument or keyword`,
      `;   a37: in, required, ulong`,
      `;     Placeholder docs for argument or keyword`,
      `;   a38: in, required, unsignedlong`,
      `;     Placeholder docs for argument or keyword`,
      `;   a39: in, required, ulong64`,
      `;     Placeholder docs for argument or keyword`,
      `;   a40: in, required, unsignedlong64`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro my_thing, $`,
      `  a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, $`,
      `  a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, $`,
      `  a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, $`,
      `  a31, a32, a33, a34, a35, a36, a37, a38, a39, a40`,
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
        `;   a01: in, required, any`,
        `;     Placeholder docs for argument or keyword`,
        `;   a02: in, required, Array<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a03: in, required, BigInteger`,
        `;     Placeholder docs for argument or keyword`,
        `;   a04: in, required, BigInteger`,
        `;     Placeholder docs for argument or keyword`,
        `;   a05: in, required, binary`,
        `;     Placeholder docs for argument or keyword`,
        `;   a06: in, required, Boolean`,
        `;     Placeholder docs for argument or keyword`,
        `;   a07: in, required, Boolean`,
        `;     Placeholder docs for argument or keyword`,
        `;   a08: in, required, Byte`,
        `;     Placeholder docs for argument or keyword`,
        `;   a09: in, required, Complex`,
        `;     Placeholder docs for argument or keyword`,
        `;   a10: in, required, DoubleComplex`,
        `;     Placeholder docs for argument or keyword`,
        `;   a11: in, required, DoubleComplex`,
        `;     Placeholder docs for argument or keyword`,
        `;   a12: in, required, Dictionary<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a13: in, required, Dictionary<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a14: in, required, Double`,
        `;     Placeholder docs for argument or keyword`,
        `;   a15: in, required, Double`,
        `;     Placeholder docs for argument or keyword`,
        `;   a16: in, required, Float`,
        `;     Placeholder docs for argument or keyword`,
        `;   a17: in, required, Float`,
        `;     Placeholder docs for argument or keyword`,
        `;   a18: in, required, Hash<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a19: in, required, hex`,
        `;     Placeholder docs for argument or keyword`,
        `;   a20: in, required, Int`,
        `;     Placeholder docs for argument or keyword`,
        `;   a21: in, required, Int`,
        `;     Placeholder docs for argument or keyword`,
        `;   a22: in, required, List<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a23: in, required, Long`,
        `;     Placeholder docs for argument or keyword`,
        `;   a24: in, required, Long64`,
        `;     Placeholder docs for argument or keyword`,
        `;   a25: in, required, Null`,
        `;     Placeholder docs for argument or keyword`,
        `;   a26: in, required, Number`,
        `;     Placeholder docs for argument or keyword`,
        `;   a27: in, required, Object<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a28: in, required, Object<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a29: in, required, octal`,
        `;     Placeholder docs for argument or keyword`,
        `;   a30: in, required, OrderedHash<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a31: in, required, Pointer<any>`,
        `;     Placeholder docs for argument or keyword`,
        `;   a32: in, required, String`,
        `;     Placeholder docs for argument or keyword`,
        `;   a33: in, required, Structure`,
        `;     Placeholder docs for argument or keyword`,
        `;   a34: in, required, UInt`,
        `;     Placeholder docs for argument or keyword`,
        `;   a35: in, required, UInt`,
        `;     Placeholder docs for argument or keyword`,
        `;   a36: in, required, UInt`,
        `;     Placeholder docs for argument or keyword`,
        `;   a37: in, required, ULong`,
        `;     Placeholder docs for argument or keyword`,
        `;   a38: in, required, ULong`,
        `;     Placeholder docs for argument or keyword`,
        `;   a39: in, required, ULong64`,
        `;     Placeholder docs for argument or keyword`,
        `;   a40: in, required, ULong64`,
        `;     Placeholder docs for argument or keyword`,
        `;`,
        `;-`,
        `pro my_thing, $`,
        `  a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, $`,
        `  a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, $`,
        `  a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, $`,
        `  a31, a32, a33, a34, a35, a36, a37, a38, a39, a40`,
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
        info: 'Unused variable "a01"',
        start: [85, 2, 3],
        end: [85, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a02"',
        start: [85, 7, 3],
        end: [85, 7, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a03"',
        start: [85, 12, 3],
        end: [85, 12, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a04"',
        start: [85, 17, 3],
        end: [85, 17, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a05"',
        start: [85, 22, 3],
        end: [85, 22, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a06"',
        start: [85, 27, 3],
        end: [85, 27, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a07"',
        start: [85, 32, 3],
        end: [85, 32, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a08"',
        start: [85, 37, 3],
        end: [85, 37, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a09"',
        start: [85, 42, 3],
        end: [85, 42, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a10"',
        start: [85, 47, 3],
        end: [85, 47, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a11"',
        start: [86, 2, 3],
        end: [86, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a12"',
        start: [86, 7, 3],
        end: [86, 7, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a13"',
        start: [86, 12, 3],
        end: [86, 12, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a14"',
        start: [86, 17, 3],
        end: [86, 17, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a15"',
        start: [86, 22, 3],
        end: [86, 22, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a16"',
        start: [86, 27, 3],
        end: [86, 27, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a17"',
        start: [86, 32, 3],
        end: [86, 32, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a18"',
        start: [86, 37, 3],
        end: [86, 37, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a19"',
        start: [86, 42, 3],
        end: [86, 42, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a20"',
        start: [86, 47, 3],
        end: [86, 47, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a21"',
        start: [87, 2, 3],
        end: [87, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a22"',
        start: [87, 7, 3],
        end: [87, 7, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a23"',
        start: [87, 12, 3],
        end: [87, 12, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a24"',
        start: [87, 17, 3],
        end: [87, 17, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a25"',
        start: [87, 22, 3],
        end: [87, 22, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a26"',
        start: [87, 27, 3],
        end: [87, 27, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a27"',
        start: [87, 32, 3],
        end: [87, 32, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a28"',
        start: [87, 37, 3],
        end: [87, 37, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a29"',
        start: [87, 42, 3],
        end: [87, 42, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a30"',
        start: [87, 47, 3],
        end: [87, 47, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a31"',
        start: [88, 2, 3],
        end: [88, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a32"',
        start: [88, 7, 3],
        end: [88, 7, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a33"',
        start: [88, 12, 3],
        end: [88, 12, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a34"',
        start: [88, 17, 3],
        end: [88, 17, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a35"',
        start: [88, 22, 3],
        end: [88, 22, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a36"',
        start: [88, 27, 3],
        end: [88, 27, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a37"',
        start: [88, 32, 3],
        end: [88, 32, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a38"',
        start: [88, 37, 3],
        end: [88, 37, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a39"',
        start: [88, 42, 3],
        end: [88, 42, 3],
      },
      {
        code: 104,
        info: 'Unused variable "a40"',
        start: [88, 47, 3],
        end: [88, 47, 3],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
