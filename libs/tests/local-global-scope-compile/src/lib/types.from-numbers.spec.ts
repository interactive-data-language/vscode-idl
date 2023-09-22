import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] numbers`, async () => {
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
      `pro pro4`,
      `compile_opt idl2`,
      ``,
      `; byte`,
      `byte1 = 0b`,
      `byte2 = 0ub`,
      ``,
      `; integer`,
      `int1 = 0s`,
      ``,
      `; compile option`,
      `compOptLong = 0`,
      ``,
      `; uint`,
      `uint1 = 0u`,
      `uint2 = 0us`,
      ``,
      `; long`,
      `long1 = 0l`,
      ``,
      `; ulong`,
      `ulong1 = 0ul`,
      ``,
      `; long64`,
      `long641 = 0ll`,
      ``,
      `; ulong64`,
      `ulong641 = 0ull`,
      ``,
      `; float`,
      `float1 = 1.`,
      `float2 = .1`,
      `float3 = 1.1`,
      `float4 = 10e`,
      `float5 = 10e5`,
      `float6 = 10.e-3`,
      `float7 = .1e+12`,
      `float8 = 2.3e12`,
      ``,
      `; double`,
      `double0 = 1d`,
      `double1 = 1.d`,
      `double2 = .1d`,
      `double3 = 1.1d`,
      `double4 = 10d`,
      `double5 = 10d5`,
      `double6 = 10.d-3`,
      `double7 = .1d+12`,
      `double8 = 2.3d12`,
      ``,
      `; binary`,
      `binary1 = '10101'b`,
      `binary2 = "10101"b`,
      ``,
      `; hex`,
      `hex1 = '10101'x`,
      `hex2 = '7FFF'XS`,
      `hex3 = '8FFF'XS`,
      `hex4 = "10101"x`,
      `hex5 = 0x`,
      `hex6 = 0x7FFF`,
      ``,
      `; octal`,
      `octal1 = "36`,
      `octal2 = "36b`,
      `octal3 = "345ull`,
      `octal4 = '10101'o`,
      `octal5 = "10101"o`,
      `octal6 = 0o`,
      `octal7 = 0o7FFF`,
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
      func: {},
      pro: {
        pro4: {
          byte1: {
            type: 'v',
            name: 'byte1',
            pos: [4, 0, 5],
            meta: {
              display: 'byte1',
              isDefined: true,
              usage: [[4, 0, 5]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Byte',
                  name: 'Byte',
                  args: [],
                  meta: {},
                  value: '0b',
                },
              ],
            },
          },
          byte2: {
            type: 'v',
            name: 'byte2',
            pos: [5, 0, 5],
            meta: {
              display: 'byte2',
              isDefined: true,
              usage: [[5, 0, 5]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Byte',
                  name: 'Byte',
                  args: [],
                  meta: {},
                  value: '0ub',
                },
              ],
            },
          },
          int1: {
            type: 'v',
            name: 'int1',
            pos: [8, 0, 4],
            meta: {
              display: 'int1',
              isDefined: true,
              usage: [[8, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Int',
                  name: 'Int',
                  args: [],
                  meta: {},
                  value: '0s',
                },
              ],
            },
          },
          compoptlong: {
            type: 'v',
            name: 'compoptlong',
            pos: [11, 0, 11],
            meta: {
              display: 'compOptLong',
              isDefined: true,
              usage: [[11, 0, 11]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '0',
                },
              ],
            },
          },
          uint1: {
            type: 'v',
            name: 'uint1',
            pos: [14, 0, 5],
            meta: {
              display: 'uint1',
              isDefined: true,
              usage: [[14, 0, 5]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'UInt',
                  name: 'UInt',
                  args: [],
                  meta: {},
                  value: '0u',
                },
              ],
            },
          },
          uint2: {
            type: 'v',
            name: 'uint2',
            pos: [15, 0, 5],
            meta: {
              display: 'uint2',
              isDefined: true,
              usage: [[15, 0, 5]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'UInt',
                  name: 'UInt',
                  args: [],
                  meta: {},
                  value: '0us',
                },
              ],
            },
          },
          long1: {
            type: 'v',
            name: 'long1',
            pos: [18, 0, 5],
            meta: {
              display: 'long1',
              isDefined: true,
              usage: [[18, 0, 5]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '0l',
                },
              ],
            },
          },
          ulong1: {
            type: 'v',
            name: 'ulong1',
            pos: [21, 0, 6],
            meta: {
              display: 'ulong1',
              isDefined: true,
              usage: [[21, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'ULong',
                  name: 'ULong',
                  args: [],
                  meta: {},
                  value: '0ul',
                },
              ],
            },
          },
          long641: {
            type: 'v',
            name: 'long641',
            pos: [24, 0, 7],
            meta: {
              display: 'long641',
              isDefined: true,
              usage: [[24, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long64',
                  name: 'Long64',
                  args: [],
                  meta: {},
                  value: '0ll',
                },
              ],
            },
          },
          ulong641: {
            type: 'v',
            name: 'ulong641',
            pos: [27, 0, 8],
            meta: {
              display: 'ulong641',
              isDefined: true,
              usage: [[27, 0, 8]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'ULong64',
                  name: 'ULong64',
                  args: [],
                  meta: {},
                  value: '0ull',
                },
              ],
            },
          },
          float1: {
            type: 'v',
            name: 'float1',
            pos: [30, 0, 6],
            meta: {
              display: 'float1',
              isDefined: true,
              usage: [[30, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '1.',
                },
              ],
            },
          },
          float2: {
            type: 'v',
            name: 'float2',
            pos: [31, 0, 6],
            meta: {
              display: 'float2',
              isDefined: true,
              usage: [[31, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '.1',
                },
              ],
            },
          },
          float3: {
            type: 'v',
            name: 'float3',
            pos: [32, 0, 6],
            meta: {
              display: 'float3',
              isDefined: true,
              usage: [[32, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '1.1',
                },
              ],
            },
          },
          float4: {
            type: 'v',
            name: 'float4',
            pos: [33, 0, 6],
            meta: {
              display: 'float4',
              isDefined: true,
              usage: [[33, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10e',
                },
              ],
            },
          },
          float5: {
            type: 'v',
            name: 'float5',
            pos: [34, 0, 6],
            meta: {
              display: 'float5',
              isDefined: true,
              usage: [[34, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10e5',
                },
              ],
            },
          },
          float6: {
            type: 'v',
            name: 'float6',
            pos: [35, 0, 6],
            meta: {
              display: 'float6',
              isDefined: true,
              usage: [[35, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10.e-3',
                },
              ],
            },
          },
          float7: {
            type: 'v',
            name: 'float7',
            pos: [36, 0, 6],
            meta: {
              display: 'float7',
              isDefined: true,
              usage: [[36, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '.1e+12',
                },
              ],
            },
          },
          float8: {
            type: 'v',
            name: 'float8',
            pos: [37, 0, 6],
            meta: {
              display: 'float8',
              isDefined: true,
              usage: [[37, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '2.3e12',
                },
              ],
            },
          },
          double0: {
            type: 'v',
            name: 'double0',
            pos: [40, 0, 7],
            meta: {
              display: 'double0',
              isDefined: true,
              usage: [[40, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '1d',
                },
              ],
            },
          },
          double1: {
            type: 'v',
            name: 'double1',
            pos: [41, 0, 7],
            meta: {
              display: 'double1',
              isDefined: true,
              usage: [[41, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '1.d',
                },
              ],
            },
          },
          double2: {
            type: 'v',
            name: 'double2',
            pos: [42, 0, 7],
            meta: {
              display: 'double2',
              isDefined: true,
              usage: [[42, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '.1d',
                },
              ],
            },
          },
          double3: {
            type: 'v',
            name: 'double3',
            pos: [43, 0, 7],
            meta: {
              display: 'double3',
              isDefined: true,
              usage: [[43, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '1.1d',
                },
              ],
            },
          },
          double4: {
            type: 'v',
            name: 'double4',
            pos: [44, 0, 7],
            meta: {
              display: 'double4',
              isDefined: true,
              usage: [[44, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '10d',
                },
              ],
            },
          },
          double5: {
            type: 'v',
            name: 'double5',
            pos: [45, 0, 7],
            meta: {
              display: 'double5',
              isDefined: true,
              usage: [[45, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '10d5',
                },
              ],
            },
          },
          double6: {
            type: 'v',
            name: 'double6',
            pos: [46, 0, 7],
            meta: {
              display: 'double6',
              isDefined: true,
              usage: [[46, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '10.d-3',
                },
              ],
            },
          },
          double7: {
            type: 'v',
            name: 'double7',
            pos: [47, 0, 7],
            meta: {
              display: 'double7',
              isDefined: true,
              usage: [[47, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '.1d+12',
                },
              ],
            },
          },
          double8: {
            type: 'v',
            name: 'double8',
            pos: [48, 0, 7],
            meta: {
              display: 'double8',
              isDefined: true,
              usage: [[48, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '2.3d12',
                },
              ],
            },
          },
          binary1: {
            type: 'v',
            name: 'binary1',
            pos: [51, 0, 7],
            meta: {
              display: 'binary1',
              isDefined: true,
              usage: [[51, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Byte',
                  name: 'Byte',
                  args: [],
                  meta: {},
                  value: "'10101'b",
                },
              ],
            },
          },
          binary2: {
            type: 'v',
            name: 'binary2',
            pos: [52, 0, 7],
            meta: {
              display: 'binary2',
              isDefined: true,
              usage: [[52, 0, 7]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Byte',
                  name: 'Byte',
                  args: [],
                  meta: {},
                  value: '"10101"b',
                },
              ],
            },
          },
          hex1: {
            type: 'v',
            name: 'hex1',
            pos: [55, 0, 4],
            meta: {
              display: 'hex1',
              isDefined: true,
              usage: [[55, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: "'10101'x",
                },
              ],
            },
          },
          hex2: {
            type: 'v',
            name: 'hex2',
            pos: [56, 0, 4],
            meta: {
              display: 'hex2',
              isDefined: true,
              usage: [[56, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Int',
                  name: 'Int',
                  args: [],
                  meta: {},
                  value: "'7FFF'XS",
                },
              ],
            },
          },
          hex3: {
            type: 'v',
            name: 'hex3',
            pos: [57, 0, 4],
            meta: {
              display: 'hex3',
              isDefined: true,
              usage: [[57, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Int',
                  name: 'Int',
                  args: [],
                  meta: {},
                  value: "'8FFF'XS",
                },
              ],
            },
          },
          hex4: {
            type: 'v',
            name: 'hex4',
            pos: [58, 0, 4],
            meta: {
              display: 'hex4',
              isDefined: true,
              usage: [[58, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '"10101"x',
                },
              ],
            },
          },
          hex5: {
            type: 'v',
            name: 'hex5',
            pos: [59, 0, 4],
            meta: {
              display: 'hex5',
              isDefined: true,
              usage: [[59, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '0x',
                },
              ],
            },
          },
          hex6: {
            type: 'v',
            name: 'hex6',
            pos: [60, 0, 4],
            meta: {
              display: 'hex6',
              isDefined: true,
              usage: [[60, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '0x7FFF',
                },
              ],
            },
          },
          octal1: {
            type: 'v',
            name: 'octal1',
            pos: [63, 0, 6],
            meta: {
              display: 'octal1',
              isDefined: true,
              usage: [[63, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '"36',
                },
              ],
            },
          },
          octal2: {
            type: 'v',
            name: 'octal2',
            pos: [64, 0, 6],
            meta: {
              display: 'octal2',
              isDefined: true,
              usage: [[64, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Byte',
                  name: 'Byte',
                  args: [],
                  meta: {},
                  value: '"36b',
                },
              ],
            },
          },
          octal3: {
            type: 'v',
            name: 'octal3',
            pos: [65, 0, 6],
            meta: {
              display: 'octal3',
              isDefined: true,
              usage: [[65, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'ULong64',
                  name: 'ULong64',
                  args: [],
                  meta: {},
                  value: '"345ull',
                },
              ],
            },
          },
          octal4: {
            type: 'v',
            name: 'octal4',
            pos: [66, 0, 6],
            meta: {
              display: 'octal4',
              isDefined: true,
              usage: [[66, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: "'10101'o",
                },
              ],
            },
          },
          octal5: {
            type: 'v',
            name: 'octal5',
            pos: [67, 0, 6],
            meta: {
              display: 'octal5',
              isDefined: true,
              usage: [[67, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '"10101"o',
                },
              ],
            },
          },
          octal6: {
            type: 'v',
            name: 'octal6',
            pos: [68, 0, 6],
            meta: {
              display: 'octal6',
              isDefined: true,
              usage: [[68, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '0o',
                },
              ],
            },
          },
          octal7: {
            type: 'v',
            name: 'octal7',
            pos: [69, 0, 6],
            meta: {
              display: 'octal7',
              isDefined: true,
              usage: [[69, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '0o7FFF',
                },
              ],
            },
          },
        },
      },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'pro4',
        pos: [0, 4, 4],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\npro4\n```\n',
          docsLookup: {},
          display: 'pro4',
          kws: {},
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { pro4: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] numbers with no compile opt`, async () => {
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
      `pro pro1`,
      `compile_opt`,
      `; compile option`,
      `compOptInt = 0`,
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
      func: {},
      pro: {
        pro1: {
          compoptint: {
            type: 'v',
            name: 'compoptint',
            pos: [3, 0, 10],
            meta: {
              display: 'compOptInt',
              isDefined: true,
              usage: [[3, 0, 10]],
              docs: '',
              source: 'user',
              type: [
                { display: 'Int', name: 'Int', args: [], meta: {}, value: '0' },
              ],
            },
          },
        },
      },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'pro1',
        pos: [0, 4, 4],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\npro1\n```\n',
          docsLookup: {},
          display: 'pro1',
          kws: {},
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { pro1: [] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] numbers with float64 compile opt`, async () => {
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
      `pro pro2`,
      `compile_opt float64`,
      `; compile option`,
      `compOptDouble = 0`,
      ``,
      `; float`,
      `float1 = 1.`,
      `float2 = .1`,
      `float3 = 1.1`,
      `float4 = 10e`,
      `float5 = 10e5`,
      `float6 = 10.e-3`,
      `float7 = .1e+12`,
      `float8 = 2.3e12`,
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
      func: {},
      pro: {
        pro2: {
          compoptdouble: {
            type: 'v',
            name: 'compoptdouble',
            pos: [3, 0, 13],
            meta: {
              display: 'compOptDouble',
              isDefined: true,
              usage: [[3, 0, 13]],
              docs: '',
              source: 'user',
              type: [
                { display: 'Int', name: 'Int', args: [], meta: {}, value: '0' },
              ],
            },
          },
          float1: {
            type: 'v',
            name: 'float1',
            pos: [6, 0, 6],
            meta: {
              display: 'float1',
              isDefined: true,
              usage: [[6, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '1.',
                },
              ],
            },
          },
          float2: {
            type: 'v',
            name: 'float2',
            pos: [7, 0, 6],
            meta: {
              display: 'float2',
              isDefined: true,
              usage: [[7, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '.1',
                },
              ],
            },
          },
          float3: {
            type: 'v',
            name: 'float3',
            pos: [8, 0, 6],
            meta: {
              display: 'float3',
              isDefined: true,
              usage: [[8, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '1.1',
                },
              ],
            },
          },
          float4: {
            type: 'v',
            name: 'float4',
            pos: [9, 0, 6],
            meta: {
              display: 'float4',
              isDefined: true,
              usage: [[9, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10e',
                },
              ],
            },
          },
          float5: {
            type: 'v',
            name: 'float5',
            pos: [10, 0, 6],
            meta: {
              display: 'float5',
              isDefined: true,
              usage: [[10, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10e5',
                },
              ],
            },
          },
          float6: {
            type: 'v',
            name: 'float6',
            pos: [11, 0, 6],
            meta: {
              display: 'float6',
              isDefined: true,
              usage: [[11, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10.e-3',
                },
              ],
            },
          },
          float7: {
            type: 'v',
            name: 'float7',
            pos: [12, 0, 6],
            meta: {
              display: 'float7',
              isDefined: true,
              usage: [[12, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '.1e+12',
                },
              ],
            },
          },
          float8: {
            type: 'v',
            name: 'float8',
            pos: [13, 0, 6],
            meta: {
              display: 'float8',
              isDefined: true,
              usage: [[13, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '2.3e12',
                },
              ],
            },
          },
        },
      },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'pro2',
        pos: [0, 4, 4],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\npro2\n```\n',
          docsLookup: {},
          display: 'pro2',
          kws: {},
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { pro2: ['float64'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] numbers with idl3 compile opt`, async () => {
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
      `pro pro3`,
      `compile_opt idl3`,
      `; compile option`,
      `compOptDouble = 0`,
      ``,
      `; float`,
      `float1 = 1.`,
      `float2 = .1`,
      `float3 = 1.1`,
      `float4 = 10e`,
      `float5 = 10e5`,
      `float6 = 10.e-3`,
      `float7 = .1e+12`,
      `float8 = 2.3e12`,
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
      func: {},
      pro: {
        pro3: {
          compoptdouble: {
            type: 'v',
            name: 'compoptdouble',
            pos: [3, 0, 13],
            meta: {
              display: 'compOptDouble',
              isDefined: true,
              usage: [[3, 0, 13]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '0',
                },
              ],
            },
          },
          float1: {
            type: 'v',
            name: 'float1',
            pos: [6, 0, 6],
            meta: {
              display: 'float1',
              isDefined: true,
              usage: [[6, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '1.',
                },
              ],
            },
          },
          float2: {
            type: 'v',
            name: 'float2',
            pos: [7, 0, 6],
            meta: {
              display: 'float2',
              isDefined: true,
              usage: [[7, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '.1',
                },
              ],
            },
          },
          float3: {
            type: 'v',
            name: 'float3',
            pos: [8, 0, 6],
            meta: {
              display: 'float3',
              isDefined: true,
              usage: [[8, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Double',
                  name: 'Double',
                  args: [],
                  meta: {},
                  value: '1.1',
                },
              ],
            },
          },
          float4: {
            type: 'v',
            name: 'float4',
            pos: [9, 0, 6],
            meta: {
              display: 'float4',
              isDefined: true,
              usage: [[9, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10e',
                },
              ],
            },
          },
          float5: {
            type: 'v',
            name: 'float5',
            pos: [10, 0, 6],
            meta: {
              display: 'float5',
              isDefined: true,
              usage: [[10, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10e5',
                },
              ],
            },
          },
          float6: {
            type: 'v',
            name: 'float6',
            pos: [11, 0, 6],
            meta: {
              display: 'float6',
              isDefined: true,
              usage: [[11, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '10.e-3',
                },
              ],
            },
          },
          float7: {
            type: 'v',
            name: 'float7',
            pos: [12, 0, 6],
            meta: {
              display: 'float7',
              isDefined: true,
              usage: [[12, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '.1e+12',
                },
              ],
            },
          },
          float8: {
            type: 'v',
            name: 'float8',
            pos: [13, 0, 6],
            meta: {
              display: 'float8',
              isDefined: true,
              usage: [[13, 0, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Float',
                  name: 'Float',
                  args: [],
                  meta: {},
                  value: '2.3e12',
                },
              ],
            },
          },
        },
      },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'pro3',
        pos: [0, 4, 4],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\npro3\n```\n',
          docsLookup: {},
          display: 'pro3',
          kws: {},
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { pro3: ['idl3'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
