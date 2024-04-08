import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify notebook parsing`, () => {
  it(`[auto generated] ignores compile opt idl2 for procedures`, async () => {
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
    const code = [`pro myPro`, `  print, 'Hello world'`, `end`];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true, isNotebook: true }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: { mypro: {} },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'mypro',
        pos: [0, 4, 5],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmyPro\n```\n',
          docsLookup: {},
          display: 'myPro',
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
      pro: { mypro: [] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] ignores compile opt idl2 for functions`, async () => {
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
      `  print, 'Hello world'`,
      `  return 42`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true, isNotebook: true }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {
        mypro: {
          return: {
            type: 'v',
            name: 'return',
            pos: [2, 2, 6],
            meta: {
              display: 'return',
              isDefined: false,
              usage: [[2, 2, 6]],
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
        name: 'mypro',
        pos: [0, 9, 5],
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
      func: { mypro: [] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
