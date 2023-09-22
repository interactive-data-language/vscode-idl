import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from assignment`, () => {
  it(`[auto generated] where we define vars in-line`, async () => {
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
      `; main level`,
      `compile_opt idl2`,
      ``,
      `; any because using var before defined`,
      `c = d + (d = 5)`,
      ``,
      `; number`,
      `f = (g = 6) + g`,
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
      pro: {},
      main: {
        c: {
          type: 'v',
          name: 'c',
          pos: [4, 0, 1],
          meta: {
            display: 'c',
            isDefined: true,
            usage: [[4, 0, 1]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        d: {
          type: 'v',
          name: 'd',
          pos: [4, 9, 1],
          meta: {
            display: 'd',
            isDefined: true,
            usage: [
              [4, 4, 1],
              [4, 9, 1],
            ],
            docs: '',
            source: 'user',
            type: [
              { display: 'Long', name: 'Long', args: [], meta: {}, value: '5' },
            ],
          },
        },
        f: {
          type: 'v',
          name: 'f',
          pos: [7, 0, 1],
          meta: {
            display: 'f',
            isDefined: true,
            usage: [[7, 0, 1]],
            docs: '',
            source: 'user',
            type: [{ display: 'Long', name: 'Long', args: [], meta: {} }],
          },
        },
        g: {
          type: 'v',
          name: 'g',
          pos: [7, 5, 1],
          meta: {
            display: 'g',
            isDefined: true,
            usage: [
              [7, 5, 1],
              [7, 14, 1],
            ],
            docs: '',
            source: 'user',
            type: [
              { display: 'Long', name: 'Long', args: [], meta: {}, value: '6' },
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
        pos: [0, 0, 12],
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
