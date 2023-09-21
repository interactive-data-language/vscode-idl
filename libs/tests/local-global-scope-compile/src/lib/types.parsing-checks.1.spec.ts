import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Cases to make sure we always parse our types correctly`, () => {
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
      `;   arg1: in, required, Pointer`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg2: in, required, Pointer<Array>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg3: in, required, Pointer<Array<Number>>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: in, required, Pointer<Array<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg5: in, required, Number | String`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg6: in, required, Hash<Number> | List<Array<Number>>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg7: in, required, Hash<Number | string> | List<Array<Number | string> | List<ENVIRaster>>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro type_parsing_test, arg1, arg2, arg3, arg4, arg5, arg6, arg7`,
      `  compile_opt idl3`,
      ``,
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
        type_parsing_test: {
          arg1: {
            type: 'v',
            name: 'arg1',
            pos: [18, 23, 4],
            meta: {
              display: 'arg1',
              isDefined: true,
              usage: [[18, 23, 4]],
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
          arg2: {
            type: 'v',
            name: 'arg2',
            pos: [18, 29, 4],
            meta: {
              display: 'arg2',
              isDefined: true,
              usage: [[18, 29, 4]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Array<any>>',
                  args: [
                    [
                      {
                        name: 'Array',
                        display: 'Array<any>',
                        args: [
                          [{ name: 'any', display: 'any', args: [], meta: {} }],
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
          arg3: {
            type: 'v',
            name: 'arg3',
            pos: [18, 35, 4],
            meta: {
              display: 'arg3',
              isDefined: true,
              usage: [[18, 35, 4]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Array<Number>>',
                  args: [
                    [
                      {
                        name: 'Array',
                        display: 'Array<Number>',
                        args: [
                          [
                            {
                              name: 'Number',
                              display: 'Number',
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
            pos: [18, 41, 4],
            meta: {
              display: 'arg4',
              isDefined: true,
              usage: [[18, 41, 4]],
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
          arg5: {
            type: 'v',
            name: 'arg5',
            pos: [18, 47, 4],
            meta: {
              display: 'arg5',
              isDefined: true,
              usage: [[18, 47, 4]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
            },
          },
          arg6: {
            type: 'v',
            name: 'arg6',
            pos: [18, 53, 4],
            meta: {
              display: 'arg6',
              isDefined: true,
              usage: [[18, 53, 4]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Hash',
                  display: 'Hash<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
                {
                  name: 'List',
                  display: 'List<Array<Number>>',
                  args: [
                    [
                      {
                        name: 'Array',
                        display: 'Array<Number>',
                        args: [
                          [
                            {
                              name: 'Number',
                              display: 'Number',
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
          arg7: {
            type: 'v',
            name: 'arg7',
            pos: [18, 59, 4],
            meta: {
              display: 'arg7',
              isDefined: true,
              usage: [[18, 59, 4]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'Hash',
                  display: 'Hash<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
                {
                  name: 'List',
                  display: 'List<Array<Number | String> | List<ENVIRaster>>',
                  args: [
                    [
                      {
                        name: 'Array',
                        display: 'Array<Number | String>',
                        args: [
                          [
                            {
                              name: 'Number',
                              display: 'Number',
                              args: [],
                              meta: {},
                            },
                            {
                              name: 'String',
                              display: 'String',
                              args: [],
                              meta: {},
                            },
                          ],
                        ],
                        meta: {},
                      },
                      {
                        name: 'List',
                        display: 'List<ENVIRaster>',
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
        name: 'type_parsing_test',
        pos: [18, 4, 17],
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
                  display: 'Pointer<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'arg1',
              code: true,
              pos: [18, 23, 4],
            },
            arg2: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Array<any>>',
                  args: [
                    [
                      {
                        name: 'Array',
                        display: 'Array<any>',
                        args: [
                          [{ name: 'any', display: 'any', args: [], meta: {} }],
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
              display: 'arg2',
              code: true,
              pos: [18, 29, 4],
            },
            arg3: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Pointer',
                  display: 'Pointer<Array<Number>>',
                  args: [
                    [
                      {
                        name: 'Array',
                        display: 'Array<Number>',
                        args: [
                          [
                            {
                              name: 'Number',
                              display: 'Number',
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
              pos: [18, 35, 4],
            },
            arg4: {
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
              display: 'arg4',
              code: true,
              pos: [18, 41, 4],
            },
            arg5: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
              private: false,
              req: true,
              display: 'arg5',
              code: true,
              pos: [18, 47, 4],
            },
            arg6: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Hash',
                  display: 'Hash<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
                {
                  name: 'List',
                  display: 'List<Array<Number>>',
                  args: [
                    [
                      {
                        name: 'Array',
                        display: 'Array<Number>',
                        args: [
                          [
                            {
                              name: 'Number',
                              display: 'Number',
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
              display: 'arg6',
              code: true,
              pos: [18, 53, 4],
            },
            arg7: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Hash',
                  display: 'Hash<Number | String>',
                  args: [
                    [
                      { name: 'Number', display: 'Number', args: [], meta: {} },
                      { name: 'String', display: 'String', args: [], meta: {} },
                    ],
                  ],
                  meta: {},
                },
                {
                  name: 'List',
                  display: 'List<Array<Number | String> | List<ENVIRaster>>',
                  args: [
                    [
                      {
                        name: 'Array',
                        display: 'Array<Number | String>',
                        args: [
                          [
                            {
                              name: 'Number',
                              display: 'Number',
                              args: [],
                              meta: {},
                            },
                            {
                              name: 'String',
                              display: 'String',
                              args: [],
                              meta: {},
                            },
                          ],
                        ],
                        meta: {},
                      },
                      {
                        name: 'List',
                        display: 'List<ENVIRaster>',
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
              display: 'arg7',
              code: true,
              pos: [18, 59, 4],
            },
          },
          docs: '\n```idl\ntype_parsing_test, arg1, arg2, arg3, arg4, arg5, arg6, arg7\n```\n\n\n\n#### Arguments\n\n- **arg1**: in, required, Pointer<any>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg2**: in, required, Pointer<Array<any>>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg3**: in, required, Pointer<Array<Number>>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg4**: in, required, Pointer<any>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg5**: in, required, Number | String\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg6**: in, required, Hash<Number> | List<Array<Number>>\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg7**: in, required, Hash<Number | String> | List<Array<Number | String> | List<ENVIRaster>>\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'type_parsing_test',
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
      pro: { type_parsing_test: ['idl3'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
