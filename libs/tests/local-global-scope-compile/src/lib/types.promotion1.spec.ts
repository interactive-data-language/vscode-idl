import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] type promotion`, async () => {
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
      `;`,
      `;-`,
      `function most_cases, a, b`,
      `  compile_opt idl2`,
      ``,
      `  byte = 's' + 1b`,
      ``,
      `  int = 's' + 1s`,
      ``,
      `  uint = 's' + 1us`,
      ``,
      `  long = 's' + 1l`,
      ``,
      `  ulong = 's' + 1ul`,
      ``,
      `  long64 = 's' + 1ll`,
      ``,
      `  ulong64 = 's' + 1ull`,
      ``,
      `  float1 = 's' + 1.`,
      `  float2 = 's' + 1e`,
      ``,
      `  double = 's' + 1d`,
      ``,
      `  biginteger = 's' + BigInteger(5)`,
      ``,
      `  number = 's' + a`,
      ``,
      `  complexfloat = 's' + 1.i`,
      ``,
      `  complexdouble = 's' + 1di`,
      `  complexdouble = 's' + 1dj`,
      ``,
      `  complexnumber1 = 's' + a + 1di + 1dj`,
      `  complexnumber2 = a + b`,
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

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {
        most_cases: {
          a: {
            type: 'v',
            name: 'a',
            pos: [11, 21, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [
                [11, 21, 1],
                [35, 17, 1],
                [42, 25, 1],
                [43, 19, 1],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [11, 24, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [
                [11, 24, 1],
                [43, 23, 1],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'ComplexNumber',
                  display: 'ComplexNumber',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          byte: {
            type: 'v',
            name: 'byte',
            pos: [14, 2, 4],
            meta: {
              display: 'byte',
              isDefined: true,
              usage: [[14, 2, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'Byte', display: 'Byte', args: [], meta: {} }],
            },
          },
          int: {
            type: 'v',
            name: 'int',
            pos: [16, 2, 3],
            meta: {
              display: 'int',
              isDefined: true,
              usage: [[16, 2, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'Int', display: 'Int', args: [], meta: {} }],
            },
          },
          uint: {
            type: 'v',
            name: 'uint',
            pos: [18, 2, 4],
            meta: {
              display: 'uint',
              isDefined: true,
              usage: [[18, 2, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'UInt', display: 'UInt', args: [], meta: {} }],
            },
          },
          long: {
            type: 'v',
            name: 'long',
            pos: [20, 2, 4],
            meta: {
              display: 'long',
              isDefined: true,
              usage: [[20, 2, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
            },
          },
          ulong: {
            type: 'v',
            name: 'ulong',
            pos: [22, 2, 5],
            meta: {
              display: 'ulong',
              isDefined: true,
              usage: [[22, 2, 5]],
              docs: '',
              source: 'user',
              type: [{ name: 'ULong', display: 'ULong', args: [], meta: {} }],
            },
          },
          long64: {
            type: 'v',
            name: 'long64',
            pos: [24, 2, 6],
            meta: {
              display: 'long64',
              isDefined: true,
              usage: [[24, 2, 6]],
              docs: '',
              source: 'user',
              type: [{ name: 'Long64', display: 'Long64', args: [], meta: {} }],
            },
          },
          ulong64: {
            type: 'v',
            name: 'ulong64',
            pos: [26, 2, 7],
            meta: {
              display: 'ulong64',
              isDefined: true,
              usage: [[26, 2, 7]],
              docs: '',
              source: 'user',
              type: [
                { name: 'ULong64', display: 'ULong64', args: [], meta: {} },
              ],
            },
          },
          float1: {
            type: 'v',
            name: 'float1',
            pos: [28, 2, 6],
            meta: {
              display: 'float1',
              isDefined: true,
              usage: [[28, 2, 6]],
              docs: '',
              source: 'user',
              type: [{ name: 'Float', display: 'Float', args: [], meta: {} }],
            },
          },
          float2: {
            type: 'v',
            name: 'float2',
            pos: [29, 2, 6],
            meta: {
              display: 'float2',
              isDefined: true,
              usage: [[29, 2, 6]],
              docs: '',
              source: 'user',
              type: [{ name: 'Float', display: 'Float', args: [], meta: {} }],
            },
          },
          double: {
            type: 'v',
            name: 'double',
            pos: [31, 2, 6],
            meta: {
              display: 'double',
              isDefined: true,
              usage: [[31, 2, 6]],
              docs: '',
              source: 'user',
              type: [{ name: 'Double', display: 'Double', args: [], meta: {} }],
            },
          },
          biginteger: {
            type: 'v',
            name: 'biginteger',
            pos: [33, 2, 10],
            meta: {
              display: 'biginteger',
              isDefined: true,
              usage: [[33, 2, 10]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'BigInteger',
                  display: 'BigInteger',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          number: {
            type: 'v',
            name: 'number',
            pos: [35, 2, 6],
            meta: {
              display: 'number',
              isDefined: true,
              usage: [[35, 2, 6]],
              docs: '',
              source: 'user',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
            },
          },
          complexfloat: {
            type: 'v',
            name: 'complexfloat',
            pos: [37, 2, 12],
            meta: {
              display: 'complexfloat',
              isDefined: true,
              usage: [[37, 2, 12]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Complex', display: 'Complex', args: [], meta: {} },
              ],
            },
          },
          complexdouble: {
            type: 'v',
            name: 'complexdouble',
            pos: [39, 2, 13],
            meta: {
              display: 'complexdouble',
              isDefined: true,
              usage: [
                [39, 2, 13],
                [40, 2, 13],
              ],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'DoubleComplex',
                  display: 'DoubleComplex',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          complexnumber1: {
            type: 'v',
            name: 'complexnumber1',
            pos: [42, 2, 14],
            meta: {
              display: 'complexnumber1',
              isDefined: true,
              usage: [[42, 2, 14]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ComplexNumber',
                  display: 'ComplexNumber',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          complexnumber2: {
            type: 'v',
            name: 'complexnumber2',
            pos: [43, 2, 14],
            meta: {
              display: 'complexnumber2',
              isDefined: true,
              usage: [[43, 2, 14]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ComplexNumber',
                  display: 'ComplexNumber',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
        },
      },
      pro: {},
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'f',
        name: 'most_cases',
        pos: [11, 9, 10],
        meta: {
          source: 'user',
          args: {
            a: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'a',
              code: true,
              pos: [11, 21, 1],
            },
            b: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'ComplexNumber',
                  display: 'ComplexNumber',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'b',
              code: true,
              pos: [11, 24, 1],
            },
          },
          docs: '\n```idl\nresult = most_cases( a, b)\n```\n\n\n\n#### Arguments\n\n- **a**: in, required, Number\n\n  Placeholder docs for argument, keyword, or property\n\n- **b**: in, required, ComplexNumber\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '', returns: 'any' },
          display: 'most_cases',
          kws: {},
          private: false,
          returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { most_cases: ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
