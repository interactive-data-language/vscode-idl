import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GlobalTokens, ICompileOptions } from '@idl/types/idl-data-types';
import { ILocalTokens } from '@idl/types/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify type regression tests`, () => {
  it(`[auto generated] for task parsing unknown tasks`, async () => {
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
      `compile_opt idl3`,
      `task1 = ENVITask('fooooooo')`,
      `task2 = IDLTask('barrrrrr')`,
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
        task1: {
          type: 'v',
          name: 'task1',
          pos: [1, 0, 5],
          meta: {
            display: 'task1',
            isDefined: true,
            canReset: true,
            usage: [[1, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envifoooooootask',
                display: 'ENVITask<fooooooo>',
                serialized: 'ENVITask<fooooooo>',
                args: [
                  [
                    {
                      name: 'fooooooo',
                      display: 'fooooooo',
                      serialized: 'fooooooo',
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
        task2: {
          type: 'v',
          name: 'task2',
          pos: [2, 0, 5],
          meta: {
            display: 'task2',
            isDefined: true,
            canReset: true,
            usage: [[2, 0, 5]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idlbarrrrrrtask',
                display: 'IDLTask<barrrrrr>',
                serialized: 'IDLTask<barrrrrr>',
                args: [
                  [
                    {
                      name: 'barrrrrr',
                      display: 'barrrrrr',
                      serialized: 'barrrrrr',
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
        range: { start: [0, 0, 11], end: [3, 0, 3] },
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
      main: ['idl3'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
