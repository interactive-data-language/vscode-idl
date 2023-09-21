import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Errors for indexing`, () => {
  it(`[auto generated] variables that cannot be indexed`, async () => {
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
      `; :Returns:`,
      `;   any`,
      `;`,
      `; :Arguments:`,
      `;   a: in, required, Number`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   b: in, required, ComplexNumber`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   c: in, required, Array<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   d: in, required, List<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   e: in, required, Hash<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   f: in, required, OrderedHash<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   g: in, required, Dictionary<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   h: in, required, ENVIRasterMetadata`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function allowed_to_index, a, b, c, d, e, f, g, h`,
      `  compile_opt idl2`,
      ``,
      `  ; OK`,
      `  !null = c[0]`,
      `  !null = d[0]`,
      `  !null = e[0]`,
      `  !null = f[0]`,
      `  !null = g[0]`,
      ``,
      `  ; also OK, though non standard IDL types`,
      `  !null = h[0]`,
      ``,
      `  ; problems`,
      `  byte = ('s' + 1b)[0]`,
      `  int = ('s' + 1s)[0]`,
      `  uint = ('s' + 1us)[0]`,
      `  long = ('s' + 1l)[0]`,
      `  ulong = ('s' + 1ul)[0]`,
      `  long64 = ('s' + 1ll)[0]`,
      `  ulong64 = ('s' + 1ull)[0]`,
      `  float1 = ('s' + 1.)[0]`,
      `  float2 = ('s' + 1e)[0]`,
      `  double = ('s' + 1d)[0]`,
      `  biginteger = ('s' + BigInteger(5))[0]`,
      `  number = ('s' + a)[0]`,
      `  complexfloat = ('s' + 1.i)[0]`,
      `  complexdouble = ('s' + 1di)[0]`,
      `  complexdouble = ('s' + 1dj)[0]`,
      `  complexnumber1 = ('s' + a + 1di + 1dj)[0]`,
      `  complexnumber2 = (a + b)[0]`,
      ``,
      `  return, 1`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected tokens
    const expected: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "byte"',
        start: [37, 2, 4],
        end: [37, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "int"',
        start: [38, 2, 3],
        end: [38, 2, 3],
      },
      {
        code: 104,
        info: 'Unused variable "uint"',
        start: [39, 2, 4],
        end: [39, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "long"',
        start: [40, 2, 4],
        end: [40, 2, 4],
      },
      {
        code: 104,
        info: 'Unused variable "ulong"',
        start: [41, 2, 5],
        end: [41, 2, 5],
      },
      {
        code: 104,
        info: 'Unused variable "long64"',
        start: [42, 2, 6],
        end: [42, 2, 6],
      },
      {
        code: 104,
        info: 'Unused variable "ulong64"',
        start: [43, 2, 7],
        end: [43, 2, 7],
      },
      {
        code: 104,
        info: 'Unused variable "float1"',
        start: [44, 2, 6],
        end: [44, 2, 6],
      },
      {
        code: 104,
        info: 'Unused variable "float2"',
        start: [45, 2, 6],
        end: [45, 2, 6],
      },
      {
        code: 104,
        info: 'Unused variable "double"',
        start: [46, 2, 6],
        end: [46, 2, 6],
      },
      {
        code: 104,
        info: 'Unused variable "biginteger"',
        start: [47, 2, 10],
        end: [47, 2, 10],
      },
      {
        code: 104,
        info: 'Unused variable "number"',
        start: [48, 2, 6],
        end: [48, 2, 6],
      },
      {
        code: 104,
        info: 'Unused variable "complexfloat"',
        start: [49, 2, 12],
        end: [49, 2, 12],
      },
      {
        code: 104,
        info: 'Unused variable "complexnumber1"',
        start: [52, 2, 14],
        end: [52, 2, 14],
      },
      {
        code: 104,
        info: 'Unused variable "complexnumber2"',
        start: [53, 2, 14],
        end: [53, 2, 14],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expected);
  });
});
