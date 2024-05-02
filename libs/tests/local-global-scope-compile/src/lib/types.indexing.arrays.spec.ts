import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] indexing arrays`, async () => {
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
      `;   Number`,
      `;`,
      `;-`,
      `function myfunc`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Returns:`,
      `;   Array<Number>`,
      `;`,
      `;-`,
      `function myfunc2`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `;+`,
      `; :Arguments:`,
      `;   arg1: in, required, Array<Number | String>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg2: in, required, Array<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg3: in, required, Array<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: in, required, Array<Byte>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg5: in, required, Array<ENVIRaster>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg6: in, required, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro arrays, arg1, arg2, arg3, arg4, arg5, arg6`,
      `  compile_opt idl3`,
      ``,
      `  ; type args`,
      `  c = arg1[0]`,
      ``,
      `  ; return array of type args`,
      `  d = arg1[arg2]`,
      ``,
      `  ; return array`,
      `  e = arg1[*]`,
      ``,
      `  ; return array`,
      `  f = arg1[0, 1, *]`,
      ``,
      `  ; return type args`,
      `  g = arg1[myfunc()]`,
      ``,
      `  ; return array`,
      `  h = arg1[myfunc2()]`,
      ``,
      `  ; type args`,
      `  i = arg1[0, 1, 2]`,
      ``,
      `  ; return array`,
      `  j = arg1[0, 1, myfunc2()]`,
      ``,
      `  ; return array`,
      `  k = arg1[0 : -1 : 1]`,
      ``,
      `  ; return array`,
      `  l = arg1[0, 1, *]`,
      ``,
      `  ; return type args`,
      `  m = arg1[-1]`,
      ``,
      `  ; any`,
      `  n = arg3[0]`,
      ``,
      `  ; array of any`,
      `  o = arg3[myfunc2()]`,
      ``,
      `  ; return array`,
      `  p = arg1[0, myfunc2(), 1]`,
      ``,
      `  ; return array`,
      `  q = arg1[[1, 2, 3]]`,
      ``,
      `  ; return type args`,
      `  r = arg1[1 + 2]`,
      ``,
      `  ; return array`,
      `  s = arg1[1 + myfunc2()]`,
      ``,
      `  ; return any`,
      `  t = arg1[plot()]`,
      ``,
      `  ; return any`,
      `  u = arg1[1j]`,
      ``,
      `  ; return any`,
      `  v = arg1[1i]`,
      ``,
      `  ; return any`,
      `  w = arg1[1di]`,
      ``,
      `  ; return any`,
      `  x = arg1[1dj]`,
      ``,
      `  ; merge type args`,
      `  y = arg1 + arg3`,
      ``,
      `  ; merge type args`,
      `  z = arg1 + arg4 + 1l`,
      ``,
      `  ; merge type args`,
      `  a2 = arg1 + arg4 + 1`,
      ``,
      `  ; merge type args`,
      `  b2 = arg1 + arg4 + arg5`,
      ``,
      `  ; any`,
      `  c2 = arg1[arg6]`,
      ``,
      `  ; any`,
      `  d2 = arg1 + arg4 + arg6`,
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
      func: { myfunc2: {}, myfunc: {} },
      pro: {
        arrays: {
          arg1: {
            type: 'v',
            name: 'arg1',
            pos: [38, 12, 4],
            meta: {
              display: 'arg1',
              isDefined: true,
              usage: [
                [38, 12, 4],
                [42, 6, 4],
                [45, 6, 4],
                [48, 6, 4],
                [51, 6, 4],
                [54, 6, 4],
                [57, 6, 4],
                [60, 6, 4],
                [63, 6, 4],
                [66, 6, 4],
                [69, 6, 4],
                [72, 6, 4],
                [81, 6, 4],
                [84, 6, 4],
                [87, 6, 4],
                [90, 6, 4],
                [93, 6, 4],
                [96, 6, 4],
                [99, 6, 4],
                [102, 6, 4],
                [105, 6, 4],
                [108, 6, 4],
                [111, 6, 4],
                [114, 7, 4],
                [117, 7, 4],
                [120, 7, 4],
                [123, 7, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          arg2: {
            type: 'v',
            name: 'arg2',
            pos: [38, 18, 4],
            meta: {
              display: 'arg2',
              isDefined: true,
              usage: [
                [38, 18, 4],
                [45, 11, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          arg3: {
            type: 'v',
            name: 'arg3',
            pos: [38, 24, 4],
            meta: {
              display: 'arg3',
              isDefined: true,
              usage: [
                [38, 24, 4],
                [75, 6, 4],
                [78, 6, 4],
                [108, 13, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          arg4: {
            type: 'v',
            name: 'arg4',
            pos: [38, 30, 4],
            meta: {
              display: 'arg4',
              isDefined: true,
              usage: [
                [38, 30, 4],
                [111, 13, 4],
                [114, 14, 4],
                [117, 14, 4],
                [123, 14, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Byte>',
                  args: [
                    [{ name: 'Byte', display: 'Byte', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          arg5: {
            type: 'v',
            name: 'arg5',
            pos: [38, 36, 4],
            meta: {
              display: 'arg5',
              isDefined: true,
              usage: [
                [38, 36, 4],
                [117, 21, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ENVIRaster>',
                  args: [
                    [
                      {
                        name: 'ENVIRaster',
                        display: 'ENVIRaster',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          arg6: {
            type: 'v',
            name: 'arg6',
            pos: [38, 42, 4],
            meta: {
              display: 'arg6',
              isDefined: true,
              usage: [
                [38, 42, 4],
                [120, 12, 4],
                [123, 21, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [42, 2, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[42, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
            },
          },
          d: {
            type: 'v',
            name: 'd',
            pos: [45, 2, 1],
            meta: {
              display: 'd',
              isDefined: true,
              usage: [[45, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [48, 2, 1],
            meta: {
              display: 'e',
              isDefined: true,
              usage: [[48, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          f: {
            type: 'v',
            name: 'f',
            pos: [51, 2, 1],
            meta: {
              display: 'f',
              isDefined: true,
              usage: [[51, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          g: {
            type: 'v',
            name: 'g',
            pos: [54, 2, 1],
            meta: {
              display: 'g',
              isDefined: true,
              usage: [[54, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
            },
          },
          h: {
            type: 'v',
            name: 'h',
            pos: [57, 2, 1],
            meta: {
              display: 'h',
              isDefined: true,
              usage: [[57, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          i: {
            type: 'v',
            name: 'i',
            pos: [60, 2, 1],
            meta: {
              display: 'i',
              isDefined: true,
              usage: [[60, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
            },
          },
          j: {
            type: 'v',
            name: 'j',
            pos: [63, 2, 1],
            meta: {
              display: 'j',
              isDefined: true,
              usage: [[63, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          k: {
            type: 'v',
            name: 'k',
            pos: [66, 2, 1],
            meta: {
              display: 'k',
              isDefined: true,
              usage: [[66, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          l: {
            type: 'v',
            name: 'l',
            pos: [69, 2, 1],
            meta: {
              display: 'l',
              isDefined: true,
              usage: [[69, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          m: {
            type: 'v',
            name: 'm',
            pos: [72, 2, 1],
            meta: {
              display: 'm',
              isDefined: true,
              usage: [[72, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
            },
          },
          n: {
            type: 'v',
            name: 'n',
            pos: [75, 2, 1],
            meta: {
              display: 'n',
              isDefined: true,
              usage: [[75, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          o: {
            type: 'v',
            name: 'o',
            pos: [78, 2, 1],
            meta: {
              display: 'o',
              isDefined: true,
              usage: [[78, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          p: {
            type: 'v',
            name: 'p',
            pos: [81, 2, 1],
            meta: {
              display: 'p',
              isDefined: true,
              usage: [[81, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          q: {
            type: 'v',
            name: 'q',
            pos: [84, 2, 1],
            meta: {
              display: 'q',
              isDefined: true,
              usage: [[84, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          r: {
            type: 'v',
            name: 'r',
            pos: [87, 2, 1],
            meta: {
              display: 'r',
              isDefined: true,
              usage: [[87, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
            },
          },
          s: {
            type: 'v',
            name: 's',
            pos: [90, 2, 1],
            meta: {
              display: 's',
              isDefined: true,
              usage: [[90, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          t: {
            type: 'v',
            name: 't',
            pos: [93, 2, 1],
            meta: {
              display: 't',
              isDefined: true,
              usage: [[93, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          u: {
            type: 'v',
            name: 'u',
            pos: [96, 2, 1],
            meta: {
              display: 'u',
              isDefined: true,
              usage: [[96, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          v: {
            type: 'v',
            name: 'v',
            pos: [99, 2, 1],
            meta: {
              display: 'v',
              isDefined: true,
              usage: [[99, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          w: {
            type: 'v',
            name: 'w',
            pos: [102, 2, 1],
            meta: {
              display: 'w',
              isDefined: true,
              usage: [[102, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          x: {
            type: 'v',
            name: 'x',
            pos: [105, 2, 1],
            meta: {
              display: 'x',
              isDefined: true,
              usage: [[105, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          y: {
            type: 'v',
            name: 'y',
            pos: [108, 2, 1],
            meta: {
              display: 'y',
              isDefined: true,
              usage: [[108, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          z: {
            type: 'v',
            name: 'z',
            pos: [111, 2, 1],
            meta: {
              display: 'z',
              isDefined: true,
              usage: [[111, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          a2: {
            type: 'v',
            name: 'a2',
            pos: [114, 2, 2],
            meta: {
              display: 'a2',
              isDefined: true,
              usage: [[114, 2, 2]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          b2: {
            type: 'v',
            name: 'b2',
            pos: [117, 2, 2],
            meta: {
              display: 'b2',
              isDefined: true,
              usage: [[117, 2, 2]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          c2: {
            type: 'v',
            name: 'c2',
            pos: [120, 2, 2],
            meta: {
              display: 'c2',
              isDefined: true,
              usage: [[120, 2, 2]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          d2: {
            type: 'v',
            name: 'd2',
            pos: [123, 2, 2],
            meta: {
              display: 'd2',
              isDefined: true,
              usage: [[123, 2, 2]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
        name: 'arrays',
        pos: [38, 4, 6],
        meta: {
          source: 'user',
          args: {
            arg1: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg1',
              code: true,
              pos: [38, 12, 4],
            },
            arg2: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg2',
              code: true,
              pos: [38, 18, 4],
            },
            arg3: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg3',
              code: true,
              pos: [38, 24, 4],
            },
            arg4: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Byte>',
                  args: [
                    [{ name: 'Byte', display: 'Byte', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg4',
              code: true,
              pos: [38, 30, 4],
            },
            arg5: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ENVIRaster>',
                  args: [
                    [
                      {
                        name: 'ENVIRaster',
                        display: 'ENVIRaster',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg5',
              code: true,
              pos: [38, 36, 4],
            },
            arg6: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'arg6',
              code: true,
              pos: [38, 42, 4],
            },
          },
          docs: '\n```idl\narrays, arg1, arg2, arg3, arg4, arg5, arg6\n```\n\n\n\n\n#### Arguments\n\n- **arg1**: in, required, Array<Number | String>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg2**: in, required, Array<Number>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg3**: in, required, Array<any>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg4**: in, required, Array<Byte>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg5**: in, required, Array<ENVIRaster>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg6**: in, required, any\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'arrays',
          kws: {},
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'myfunc2',
        pos: [16, 9, 7],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: Array<Number>\n;+\nresult = myfunc2()\n```\n\n\n',
          docsLookup: { default: '', returns: 'Array<Number>' },
          display: 'myfunc2',
          kws: {},
          private: false,
          returns: [
            {
              name: 'Array',
              display: 'Array<Number>',
              args: [
                [{ name: 'Number', display: 'Number', args: [], meta: {} }],
              ],
              meta: {},
            },
          ],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'myfunc',
        pos: [5, 9, 6],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: Number\n;+\nresult = myfunc()\n```\n\n\n',
          docsLookup: { default: '', returns: 'Number' },
          display: 'myfunc',
          kws: {},
          private: false,
          returns: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { myfunc2: ['idl2'], myfunc: ['idl2'] },
      pro: { arrays: ['idl3'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
