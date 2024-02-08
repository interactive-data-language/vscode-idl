import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Exclude idl-disabled from`, () => {
  it(`[auto generated] variables docs`, async () => {
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
      `compile_opt idl2`,
      ``,
      `;+ idl-disable`,
      `a = 42`,
      ``,
      `;+ TODO: var comment idl-disable`,
      `b = 42`,
      ``,
      `;+ some comment idl-disable-next-line unused-var`,
      `c = 42`,
      ``,
      `;+ var comment idl-disable-line unused-var`,
      `d = 42`,
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
      pro: {},
      main: {
        a: {
          type: 'v',
          name: 'a',
          pos: [3, 0, 1],
          meta: {
            display: 'a',
            isDefined: true,
            usage: [[3, 0, 1]],
            docs: '',
            source: 'user',
            type: [
              {
                display: 'Long',
                name: 'Long',
                args: [],
                meta: {},
                value: '42',
              },
            ],
          },
        },
        b: {
          type: 'v',
          name: 'b',
          pos: [6, 0, 1],
          meta: {
            display: 'b',
            isDefined: true,
            usage: [[6, 0, 1]],
            docs: 'TODO: var comment',
            source: 'user',
            type: [
              {
                display: 'Long',
                name: 'Long',
                args: [],
                meta: {},
                value: '42',
              },
            ],
          },
        },
        c: {
          type: 'v',
          name: 'c',
          pos: [9, 0, 1],
          meta: {
            display: 'c',
            isDefined: true,
            usage: [[9, 0, 1]],
            docs: 'some comment',
            source: 'user',
            type: [
              {
                display: 'Long',
                name: 'Long',
                args: [],
                meta: {},
                value: '42',
              },
            ],
          },
        },
        d: {
          type: 'v',
          name: 'd',
          pos: [12, 0, 1],
          meta: {
            display: 'd',
            isDefined: true,
            usage: [[12, 0, 1]],
            docs: 'var comment',
            source: 'user',
            type: [
              {
                display: 'Long',
                name: 'Long',
                args: [],
                meta: {},
                value: '42',
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
