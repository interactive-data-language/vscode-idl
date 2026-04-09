import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GlobalTokens, ICompileOptions } from '@idl/types/idl-data-types';
import { ILocalTokens } from '@idl/types/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] array promotion`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      ``,
      `; scalars`,
      `scalar = floor(5)`,
      ``,
      `; arrays`,
      `array = floor([5])`,
      ``,
      `; either scalar or array`,
      `all = floor(fakefunction())`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true },
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: {},
      main: {
        scalar: {
          type: 'v',
          name: 'scalar',
          pos: [3, 0, 6],
          meta: {
            display: 'scalar',
            isDefined: true,
            canReset: true,
            usage: [[3, 0, 6]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Long',
                display: 'Long',
                serialized: 'Long',
                args: [],
                meta: {},
              },
              {
                name: 'Long64',
                display: 'Long64',
                serialized: 'Long64',
                args: [],
                meta: {},
              },
            ],
          },
        },
        array: {
          type: 'v',
          name: 'array',
          pos: [6, 0, 5],
          meta: {
            display: 'array',
            isDefined: true,
            canReset: true,
            usage: [[6, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Array',
                display: 'Array<Long | Long64>',
                serialized: 'Array<Long | Long64>',
                args: [
                  [
                    {
                      name: 'Long',
                      display: 'Long',
                      serialized: 'Long',
                      args: [],
                      meta: {},
                    },
                    {
                      name: 'Long64',
                      display: 'Long64',
                      serialized: 'Long64',
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
        all: {
          type: 'v',
          name: 'all',
          pos: [9, 0, 3],
          meta: {
            display: 'all',
            isDefined: true,
            canReset: true,
            usage: [[9, 0, 3]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Long',
                display: 'Long',
                serialized: 'Long',
                args: [],
                meta: {},
              },
              {
                name: 'Long64',
                display: 'Long64',
                serialized: 'Long64',
                args: [],
                meta: {},
              },
              {
                name: 'Array',
                display: 'Array<Long | Long64>',
                serialized: 'Array<Long | Long64>',
                args: [
                  [
                    {
                      name: 'Long',
                      display: 'Long',
                      serialized: 'Long',
                      args: [],
                      meta: {},
                    },
                    {
                      name: 'Long64',
                      display: 'Long64',
                      serialized: 'Long64',
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
        range: { start: [0, 0, 11], end: [11, 0, 3] },
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
