import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] type-of-arg case without args (default to first)`, async () => {
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
      `; :Returns: TypeOfArg`,
      `;`,
      `;-`,
      `function myfunc`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `; main level`,
      `compile_opt idl2`,
      ``,
      `string = myfunc('string')`,
      `any = myfunc()`,
      `float = myfunc(1.0)`,
      `array = myfunc([1, 2, 3])`,
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
      func: { myfunc: {} },
      pro: {},
      main: {
        string: {
          type: 'v',
          name: 'string',
          pos: [13, 0, 6],
          meta: {
            display: 'string',
            isDefined: true,
            usage: [[13, 0, 6]],
            docs: '',
            source: 'user',
            type: [{ display: 'String', name: 'String', args: [], meta: {} }],
          },
        },
        any: {
          type: 'v',
          name: 'any',
          pos: [14, 0, 3],
          meta: {
            display: 'any',
            isDefined: true,
            usage: [[14, 0, 3]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        float: {
          type: 'v',
          name: 'float',
          pos: [15, 0, 5],
          meta: {
            display: 'float',
            isDefined: true,
            usage: [[15, 0, 5]],
            docs: '',
            source: 'user',
            type: [{ display: 'Float', name: 'Float', args: [], meta: {} }],
          },
        },
        array: {
          type: 'v',
          name: 'array',
          pos: [16, 0, 5],
          meta: {
            display: 'array',
            isDefined: true,
            usage: [[16, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Array',
                display: 'Array<Long>',
                args: [[{ name: 'Long', display: 'Long', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
      },
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: '$main$',
        pos: [10, 0, 12],
        meta: {
          display: '$main$',
          docs: 'Main level program',
          docsLookup: {},
          args: {},
          kws: {},
          source: 'user',
          struct: [],
        },
      },
      {
        type: 'f',
        name: 'myfunc',
        pos: [4, 9, 6],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: TypeOfArg<0>\n;+\nresult = myfunc()\n```\n\n\n',
          docsLookup: { default: '', returns: 'TypeOfArg' },
          display: 'myfunc',
          kws: {},
          private: false,
          returns: [
            {
              name: 'TypeOfArg',
              display: 'TypeOfArg<0>',
              args: [[{ name: '0', display: '0', args: [], meta: {} }]],
              meta: {},
            },
          ],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { myfunc: ['idl2'] },
      pro: {},
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] type-of-arg case specifying arg`, async () => {
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
      `; :Returns: TypeOfArg<0>`,
      `;`,
      `;-`,
      `function myfunc`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `; main level`,
      `compile_opt idl2`,
      ``,
      `string = myfunc('string')`,
      `any = myfunc()`,
      `float = myfunc(1.0)`,
      `array = myfunc([1, 2, 3])`,
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
      func: { myfunc: {} },
      pro: {},
      main: {
        string: {
          type: 'v',
          name: 'string',
          pos: [13, 0, 6],
          meta: {
            display: 'string',
            isDefined: true,
            usage: [[13, 0, 6]],
            docs: '',
            source: 'user',
            type: [{ display: 'String', name: 'String', args: [], meta: {} }],
          },
        },
        any: {
          type: 'v',
          name: 'any',
          pos: [14, 0, 3],
          meta: {
            display: 'any',
            isDefined: true,
            usage: [[14, 0, 3]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        float: {
          type: 'v',
          name: 'float',
          pos: [15, 0, 5],
          meta: {
            display: 'float',
            isDefined: true,
            usage: [[15, 0, 5]],
            docs: '',
            source: 'user',
            type: [{ display: 'Float', name: 'Float', args: [], meta: {} }],
          },
        },
        array: {
          type: 'v',
          name: 'array',
          pos: [16, 0, 5],
          meta: {
            display: 'array',
            isDefined: true,
            usage: [[16, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Array',
                display: 'Array<Long>',
                args: [[{ name: 'Long', display: 'Long', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
      },
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: '$main$',
        pos: [10, 0, 12],
        meta: {
          display: '$main$',
          docs: 'Main level program',
          docsLookup: {},
          args: {},
          kws: {},
          source: 'user',
          struct: [],
        },
      },
      {
        type: 'f',
        name: 'myfunc',
        pos: [4, 9, 6],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: TypeOfArg<0>\n;+\nresult = myfunc()\n```\n\n\n',
          docsLookup: { default: '', returns: 'TypeOfArg<0>' },
          display: 'myfunc',
          kws: {},
          private: false,
          returns: [
            {
              name: 'TypeOfArg',
              display: 'TypeOfArg<0>',
              args: [[{ name: '0', display: '0', args: [], meta: {} }]],
              meta: {},
            },
          ],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { myfunc: ['idl2'] },
      pro: {},
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] type-of-arg case invalid arg uses any`, async () => {
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
      `; :Returns: TypeOfArg<2>`,
      `;`,
      `;-`,
      `function myfunc`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `; main level`,
      `compile_opt idl2`,
      ``,
      `string = myfunc('string')`,
      `any = myfunc()`,
      `float = myfunc(1.0)`,
      `array = myfunc([1, 2, 3])`,
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
      func: { myfunc: {} },
      pro: {},
      main: {
        string: {
          type: 'v',
          name: 'string',
          pos: [13, 0, 6],
          meta: {
            display: 'string',
            isDefined: true,
            usage: [[13, 0, 6]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        any: {
          type: 'v',
          name: 'any',
          pos: [14, 0, 3],
          meta: {
            display: 'any',
            isDefined: true,
            usage: [[14, 0, 3]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        float: {
          type: 'v',
          name: 'float',
          pos: [15, 0, 5],
          meta: {
            display: 'float',
            isDefined: true,
            usage: [[15, 0, 5]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        array: {
          type: 'v',
          name: 'array',
          pos: [16, 0, 5],
          meta: {
            display: 'array',
            isDefined: true,
            usage: [[16, 0, 5]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
      },
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: '$main$',
        pos: [10, 0, 12],
        meta: {
          display: '$main$',
          docs: 'Main level program',
          docsLookup: {},
          args: {},
          kws: {},
          source: 'user',
          struct: [],
        },
      },
      {
        type: 'f',
        name: 'myfunc',
        pos: [4, 9, 6],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: TypeOfArg<2>\n;+\nresult = myfunc()\n```\n\n\n',
          docsLookup: { default: '', returns: 'TypeOfArg<2>' },
          display: 'myfunc',
          kws: {},
          private: false,
          returns: [
            {
              name: 'TypeOfArg',
              display: 'TypeOfArg<2>',
              args: [[{ name: '2', display: '2', args: [], meta: {} }]],
              meta: {},
            },
          ],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { myfunc: ['idl2'] },
      pro: {},
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] type-of-arg case non-number index`, async () => {
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
      `; :Returns: TypeOfArg<baad>`,
      `;`,
      `;-`,
      `function myfunc`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `; main level`,
      `compile_opt idl2`,
      ``,
      `string = myfunc('string')`,
      `any = myfunc()`,
      `float = myfunc(1.0)`,
      `array = myfunc([1, 2, 3])`,
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
      func: { myfunc: {} },
      pro: {},
      main: {
        string: {
          type: 'v',
          name: 'string',
          pos: [13, 0, 6],
          meta: {
            display: 'string',
            isDefined: true,
            usage: [[13, 0, 6]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        any: {
          type: 'v',
          name: 'any',
          pos: [14, 0, 3],
          meta: {
            display: 'any',
            isDefined: true,
            usage: [[14, 0, 3]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        float: {
          type: 'v',
          name: 'float',
          pos: [15, 0, 5],
          meta: {
            display: 'float',
            isDefined: true,
            usage: [[15, 0, 5]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        array: {
          type: 'v',
          name: 'array',
          pos: [16, 0, 5],
          meta: {
            display: 'array',
            isDefined: true,
            usage: [[16, 0, 5]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
      },
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: '$main$',
        pos: [10, 0, 12],
        meta: {
          display: '$main$',
          docs: 'Main level program',
          docsLookup: {},
          args: {},
          kws: {},
          source: 'user',
          struct: [],
        },
      },
      {
        type: 'f',
        name: 'myfunc',
        pos: [4, 9, 6],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: TypeOfArg<baad>\n;+\nresult = myfunc()\n```\n\n\n',
          docsLookup: { default: '', returns: 'TypeOfArg<baad>' },
          display: 'myfunc',
          kws: {},
          private: false,
          returns: [
            {
              name: 'TypeOfArg',
              display: 'TypeOfArg<baad>',
              args: [[{ name: 'baad', display: 'baad', args: [], meta: {} }]],
              meta: {},
            },
          ],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { myfunc: ['idl2'] },
      pro: {},
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
