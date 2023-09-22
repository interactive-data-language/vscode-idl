import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from foreach loop`, () => {
  it(`[auto generated] with type args 1`, async () => {
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
      `;   item: in, required, List<Number>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;-`,
      `pro foreach, item`,
      `  compile_opt idl2`,
      `  ; item is bad`,
      `  foreach val, item, key do print, val`,
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
        foreach: {
          item: {
            type: 'v',
            name: 'item',
            pos: [5, 13, 4],
            meta: {
              display: 'item',
              isDefined: true,
              usage: [
                [5, 13, 4],
                [8, 15, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
          },
          val: {
            type: 'v',
            name: 'val',
            pos: [8, 10, 3],
            meta: {
              display: 'val',
              isDefined: true,
              usage: [
                [8, 10, 3],
                [8, 35, 3],
              ],
              docs: '',
              source: 'user',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
            },
          },
          key: {
            type: 'v',
            name: 'key',
            pos: [8, 21, 3],
            meta: {
              display: 'key',
              isDefined: true,
              usage: [[8, 21, 3]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
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
        name: 'foreach',
        pos: [5, 4, 7],
        meta: {
          source: 'user',
          args: {
            item: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'List',
                  display: 'List<Number>',
                  args: [
                    [{ name: 'Number', display: 'Number', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'item',
              code: true,
              pos: [5, 13, 4],
            },
          },
          docs: '\n```idl\nforeach, item\n```\n\n\n\n#### Arguments\n\n- **item**: in, required, List<Number>\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'foreach',
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
      pro: { foreach: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] with type args 2`, async () => {
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
      `;   item: in, required, Array<Number | String>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;-`,
      `pro foreach, item`,
      `  compile_opt idl2`,
      `  ; item is bad`,
      `  foreach val, item, key do print, val`,
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
        foreach: {
          item: {
            type: 'v',
            name: 'item',
            pos: [5, 13, 4],
            meta: {
              display: 'item',
              isDefined: true,
              usage: [
                [5, 13, 4],
                [8, 15, 4],
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
          val: {
            type: 'v',
            name: 'val',
            pos: [8, 10, 3],
            meta: {
              display: 'val',
              isDefined: true,
              usage: [
                [8, 10, 3],
                [8, 35, 3],
              ],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
              ],
            },
          },
          key: {
            type: 'v',
            name: 'key',
            pos: [8, 21, 3],
            meta: {
              display: 'key',
              isDefined: true,
              usage: [[8, 21, 3]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
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
        name: 'foreach',
        pos: [5, 4, 7],
        meta: {
          source: 'user',
          args: {
            item: {
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
              display: 'item',
              code: true,
              pos: [5, 13, 4],
            },
          },
          docs: '\n```idl\nforeach, item\n```\n\n\n\n#### Arguments\n\n- **item**: in, required, Array<Number | String>\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'foreach',
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
      pro: { foreach: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] with non-index types returning original 1`, async () => {
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
      `;   item: in, required, String`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;-`,
      `pro foreach, item`,
      `  compile_opt idl2`,
      `  ; item is bad`,
      `  foreach val, item, key do print, val`,
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
        foreach: {
          item: {
            type: 'v',
            name: 'item',
            pos: [5, 13, 4],
            meta: {
              display: 'item',
              isDefined: true,
              usage: [
                [5, 13, 4],
                [8, 15, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          val: {
            type: 'v',
            name: 'val',
            pos: [8, 10, 3],
            meta: {
              display: 'val',
              isDefined: true,
              usage: [
                [8, 10, 3],
                [8, 35, 3],
              ],
              docs: '',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          key: {
            type: 'v',
            name: 'key',
            pos: [8, 21, 3],
            meta: {
              display: 'key',
              isDefined: true,
              usage: [[8, 21, 3]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
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
        name: 'foreach',
        pos: [5, 4, 7],
        meta: {
          source: 'user',
          args: {
            item: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'item',
              code: true,
              pos: [5, 13, 4],
            },
          },
          docs: '\n```idl\nforeach, item\n```\n\n\n\n#### Arguments\n\n- **item**: in, required, String\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'foreach',
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
      pro: { foreach: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] with non-index types returning original 2`, async () => {
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
      `;   item: in, required, Number`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;-`,
      `pro foreach, item`,
      `  compile_opt idl2`,
      `  ; item is bad`,
      `  foreach val, item, key do print, val`,
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
        foreach: {
          item: {
            type: 'v',
            name: 'item',
            pos: [5, 13, 4],
            meta: {
              display: 'item',
              isDefined: true,
              usage: [
                [5, 13, 4],
                [8, 15, 4],
              ],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
            },
          },
          val: {
            type: 'v',
            name: 'val',
            pos: [8, 10, 3],
            meta: {
              display: 'val',
              isDefined: true,
              usage: [
                [8, 10, 3],
                [8, 35, 3],
              ],
              docs: '',
              source: 'user',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
            },
          },
          key: {
            type: 'v',
            name: 'key',
            pos: [8, 21, 3],
            meta: {
              display: 'key',
              isDefined: true,
              usage: [[8, 21, 3]],
              docs: '',
              source: 'user',
              type: [
                { name: 'Number', display: 'Number', args: [], meta: {} },
                { name: 'String', display: 'String', args: [], meta: {} },
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
        name: 'foreach',
        pos: [5, 4, 7],
        meta: {
          source: 'user',
          args: {
            item: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'item',
              code: true,
              pos: [5, 13, 4],
            },
          },
          docs: '\n```idl\nforeach, item\n```\n\n\n\n#### Arguments\n\n- **item**: in, required, Number\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'foreach',
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
      pro: { foreach: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
