import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] returns without docs`, async () => {
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
      `function get_dir, arg`,
      `  compile_opt idl2`,
      `  if arg eq 0 then return, 'NSEW' else return, 0`,
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
        get_dir: {
          arg: {
            type: 'v',
            name: 'arg',
            pos: [0, 18, 3],
            meta: {
              display: 'arg',
              isDefined: true,
              canReset: false,
              usage: [
                [0, 18, 3],
                [2, 5, 3],
              ],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
        name: 'get_dir',
        pos: [0, 9, 7],
        range: { start: [0, 0, 9], end: [3, 0, 3] },
        meta: {
          source: 'user',
          args: {
            arg: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg',
              code: true,
              pos: [0, 18, 3],
            },
          },
          docs: '\n```idl\n;+\n; :Returns: String | Long\n;+\nresult = get_dir(arg)\n```\n\n\n#### Arguments\n\n- **arg**: bidirectional, required, any\n\n  \n\n',
          docsLookup: {},
          display: 'get_dir',
          kws: {},
          private: false,
          returns: [
            {
              display: 'String',
              name: 'String',
              args: [],
              meta: {},
              value: 'NSEW',
            },
            { display: 'Long', name: 'Long', args: [], meta: {}, value: '0' },
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
      func: { get_dir: ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] handles syntax errors 1`, async () => {
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
      `function myFunc`,
      `  compile_opt idl2`,
      `  print, 'Hello world'`,
      `  return, `,
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
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'f',
        name: 'myfunc',
        pos: [0, 9, 6],
        range: { start: [0, 0, 9], end: [4, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = myFunc()\n```\n',
          docsLookup: {},
          display: 'myFunc',
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
      func: { myfunc: ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] handles syntax errors 2`, async () => {
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
      `function myFunc`,
      `  compile_opt idl2`,
      `  print, 'Hello world'`,
      `  return 42`,
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
        myfunc: {
          return: {
            type: 'v',
            name: 'return',
            pos: [3, 2, 6],
            meta: {
              display: 'return',
              isDefined: false,
              canReset: true,
              usage: [[3, 2, 6]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
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
        name: 'myfunc',
        pos: [0, 9, 6],
        range: { start: [0, 0, 9], end: [4, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = myFunc()\n```\n',
          docsLookup: {},
          display: 'myFunc',
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
      func: { myfunc: ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] handles syntax errors 3`, async () => {
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
      `function myPro`,
      `  compile_opt idl2`,
      `  print, 'Hello world'`,
      `  return`,
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
      func: { mypro: {} },
      pro: {},
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'f',
        name: 'mypro',
        pos: [0, 9, 5],
        range: { start: [0, 0, 9], end: [4, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = myPro()\n```\n',
          docsLookup: {},
          display: 'myPro',
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
      func: { mypro: ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
