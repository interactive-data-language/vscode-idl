import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly extract variables from`, () => {
  it(`[auto generated] main level`, async () => {
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
    const code = [`compile_opt idl2`, `a = 5`, `mypro, a, b, c, d`, `end`];

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
      pro: {},
      main: {
        a: {
          type: 'v',
          name: 'a',
          pos: [1, 0, 1],
          meta: {
            display: 'a',
            isDefined: true,
            usage: [
              [1, 0, 1],
              [2, 7, 1],
            ],
            docs: '',
            source: 'user',
            type: [
              { display: 'Long', name: 'Long', args: [], meta: {}, value: '5' },
            ],
          },
        },
        b: {
          type: 'v',
          name: 'b',
          pos: [2, 10, 1],
          meta: {
            display: 'b',
            isDefined: true,
            usage: [[2, 10, 1]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        c: {
          type: 'v',
          name: 'c',
          pos: [2, 13, 1],
          meta: {
            display: 'c',
            isDefined: true,
            usage: [[2, 13, 1]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        d: {
          type: 'v',
          name: 'd',
          pos: [2, 16, 1],
          meta: {
            display: 'd',
            isDefined: true,
            usage: [[2, 16, 1]],
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
        pos: [0, 0, 11],
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
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
