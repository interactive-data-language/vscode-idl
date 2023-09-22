import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Get types correctly from pointer de-reference`, () => {
  it(`[auto generated] for normal cases`, async () => {
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
      `;   arg1: in, required, Pointer<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg2: in, required, Array<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg3: in, required, Array<Pointer<ENVIRaster>>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: in, required, Pointer<Number> | String`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg5: in, required, Pointer<any>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg6: in, required, Pointer<String> | Pointer<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg7: in, required, Pointer<String> | Pointer<Number | String>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro pointers, arg1, arg2, arg3, arg4, arg5, arg6, arg7`,
      `  compile_opt idl3`,
      ``,
      `  ; number`,
      `  a = *arg1`,
      ``,
      `  ; enviraster`,
      `  b = *arg3[0]`,
      ``,
      `  ; and, unable to index`,
      `  c = arg1[0]`,
      ``,
      `  ; any, unable to de-reference`,
      `  d = *5`,
      ``,
      `  ; any, ambiguous de-reference`,
      `  e = *arg4`,
      ``,
      `  ; any`,
      `  f = *arg5`,
      ``,
      `  ; union of type args`,
      `  g = *arg6`,
      ``,
      `  ; union of type args, dont show arg7 more string more than once`,
      `  g = *arg7`,
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
        pointers: {
          arg1: {
            type: 'v',
            name: 'arg1',
            pos: [18, 14, 4],
            meta: {
              display: 'arg1',
              isDefined: true,
              usage: [
                [18, 14, 4],
                [22, 7, 4],
                [28, 6, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          arg2: {
            type: 'v',
            name: 'arg2',
            pos: [18, 20, 4],
            meta: {
              display: 'arg2',
              isDefined: true,
              usage: [[18, 20, 4]],
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
            pos: [18, 26, 4],
            meta: {
              display: 'arg3',
              isDefined: true,
              usage: [
                [18, 26, 4],
                [25, 7, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Pointer<ENVIRaster>>',
                  args: [
                    [
                      {
                        name: 'Pointer',
                        display: 'Pointer<ENVIRaster>',
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
                  ],
                  meta: {},
                },
              ],
            },
          },
          arg4: {
            type: 'v',
            name: 'arg4',
            pos: [18, 32, 4],
            meta: {
              display: 'arg4',
              isDefined: true,
              usage: [
                [18, 32, 4],
                [34, 7, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
            },
          },
          arg5: {
            type: 'v',
            name: 'arg5',
            pos: [18, 38, 4],
            meta: {
              display: 'arg5',
              isDefined: true,
              usage: [
                [18, 38, 4],
                [37, 7, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          arg6: {
            type: 'v',
            name: 'arg6',
            pos: [18, 44, 4],
            meta: {
              display: 'arg6',
              isDefined: true,
              usage: [
                [18, 44, 4],
                [40, 7, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
                {
                  name: 'Pointer',
                  display: 'Pointer<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          arg7: {
            type: 'v',
            name: 'arg7',
            pos: [18, 50, 4],
            meta: {
              display: 'arg7',
              isDefined: true,
              usage: [
                [18, 50, 4],
                [43, 7, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
                {
                  name: 'Pointer',
                  display: 'Pointer<Number | String>',
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
          a: {
            type: 'v',
            name: 'a',
            pos: [22, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[22, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [25, 2, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[25, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [28, 2, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[28, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          d: {
            type: 'v',
            name: 'd',
            pos: [31, 2, 1],
            meta: {
              display: 'd',
              isDefined: true,
              usage: [[31, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [34, 2, 1],
            meta: {
              display: 'e',
              isDefined: true,
              usage: [[34, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          f: {
            type: 'v',
            name: 'f',
            pos: [37, 2, 1],
            meta: {
              display: 'f',
              isDefined: true,
              usage: [[37, 2, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          g: {
            type: 'v',
            name: 'g',
            pos: [40, 2, 1],
            meta: {
              display: 'g',
              isDefined: true,
              usage: [
                [40, 2, 1],
                [43, 2, 1],
              ],
              docs: '',
              source: 'user',
              type: [
                { name: 'String', display: 'String', args: [], meta: {} },
                { name: 'Number', display: 'Number', args: [], meta: {} },
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
        name: 'pointers',
        pos: [18, 4, 8],
        meta: {
          source: 'user',
          args: {
            arg1: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg1',
              code: true,
              pos: [18, 14, 4],
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
              pos: [18, 20, 4],
            },
            arg3: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Pointer<ENVIRaster>>',
                  args: [
                    [
                      {
                        name: 'Pointer',
                        display: 'Pointer<ENVIRaster>',
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
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg3',
              code: true,
              pos: [18, 26, 4],
            },
            arg4: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
              private: false,
              req: true,
              display: 'arg4',
              code: true,
              pos: [18, 32, 4],
            },
            arg5: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg5',
              code: true,
              pos: [18, 38, 4],
            },
            arg6: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
                {
                  name: 'Pointer',
                  display: 'Pointer<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg6',
              code: true,
              pos: [18, 44, 4],
            },
            arg7: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
                {
                  name: 'Pointer',
                  display: 'Pointer<Number | String>',
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
              display: 'arg7',
              code: true,
              pos: [18, 50, 4],
            },
          },
          docs: '\n```idl\npointers, arg1, arg2, arg3, arg4, arg5, arg6, arg7\n```\n\n\n\n#### Arguments\n\n- **arg1**: in, required, Pointer<Number>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg2**: in, required, Array<Number>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg3**: in, required, Array<Pointer<ENVIRaster>>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg4**: in, required, Pointer<Number> | String\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg5**: in, required, Pointer<any>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg6**: in, required, Pointer<String> | Pointer<Number>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg7**: in, required, Pointer<String> | Pointer<Number | String>\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'pointers',
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
      pro: { pointers: ['idl3'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
