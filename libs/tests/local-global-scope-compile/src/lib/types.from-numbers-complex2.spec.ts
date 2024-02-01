import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] complex numbers using "j"`, async () => {
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
      `pro pro6`,
      `compile_opt idl2`,
      ``,
      `; byte`,
      `byte1 = 0bj`,
      `byte2 = 0ubj`,
      ``,
      `; jnteger`,
      `jnt1 = 0sj`,
      ``,
      `; compjle optjon`,
      `compOptLong = 0j`,
      ``,
      `; ujnt`,
      `ujnt1 = 0uj`,
      `ujnt2 = 0usj`,
      ``,
      `; long`,
      `long1 = 0lj`,
      ``,
      `; ulong`,
      `ulong1 = 0ulj`,
      ``,
      `; long64`,
      `long641 = 0llj`,
      ``,
      `; ulong64`,
      `ulong641 = 0ullj`,
      ``,
      `; float`,
      `float1 = 1.j`,
      `float2 = .1j`,
      `float3 = 1.1j`,
      `float4 = 10ej`,
      `float5 = 10e5j`,
      `float6 = 10.e-3j`,
      `float7 = .1e+12j`,
      `float8 = 2.3e12j`,
      ``,
      `; double`,
      `double0 = 1dj`,
      `double1 = 1.dj`,
      `double2 = .1dj`,
      `double3 = 1.1dj`,
      `double4 = 10dj`,
      `double5 = 10d5j`,
      `double6 = 10.d-3j`,
      `double7 = .1d+12j`,
      `double8 = 2.3d12j`,
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
        pro6: {
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0bj',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0ubj',
                },
              ],
            },
          },
          jnt1: {
            type: 'v',
            name: 'jnt1',
            pos: [8, 0, 4],
            meta: {
              display: 'jnt1',
              isDefined: true,
              usage: [[8, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0sj',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0j',
                },
              ],
            },
          },
          ujnt1: {
            type: 'v',
            name: 'ujnt1',
            pos: [14, 0, 5],
            meta: {
              display: 'ujnt1',
              isDefined: true,
              usage: [[14, 0, 5]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0uj',
                },
              ],
            },
          },
          ujnt2: {
            type: 'v',
            name: 'ujnt2',
            pos: [15, 0, 5],
            meta: {
              display: 'ujnt2',
              isDefined: true,
              usage: [[15, 0, 5]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0usj',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0lj',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0ulj',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0llj',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '0ullj',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '1.j',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '.1j',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '1.1j',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '10ej',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '10e5j',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '10.e-3j',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '.1e+12j',
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
                  display: 'Complex',
                  name: 'Complex',
                  args: [],
                  meta: {},
                  value: '2.3e12j',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '1dj',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '1.dj',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '.1dj',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '1.1dj',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '10dj',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '10d5j',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '10.d-3j',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '.1d+12j',
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
                  display: 'DoubleComplex',
                  name: 'DoubleComplex',
                  args: [],
                  meta: {},
                  value: '2.3d12j',
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
        name: 'pro6',
        pos: [0, 4, 4],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\npro6\n```\n',
          docsLookup: {},
          display: 'pro6',
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
      pro: { pro6: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
