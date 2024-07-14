import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] structure operations`, async () => {
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
      `pro struct_checks`,
      `compile_opt idl2`,
      ``,
      `str = {a: 42}`,
      ``,
      `a = 1 + str`,
      ``,
      `b = str + {a: 42}`,
      ``,
      `c = str + list()`,
      ``,
      `d = str + hash()`,
      ``,
      `e = str + orderedhash()`,
      ``,
      `f = str + dictionary()`,
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
        struct_checks: {
          str: {
            type: 'v',
            name: 'str',
            pos: [3, 0, 3],
            meta: {
              display: 'str',
              isDefined: true,
              usage: [
                [3, 0, 3],
                [5, 8, 3],
                [7, 4, 3],
                [9, 4, 3],
                [11, 4, 3],
                [13, 4, 3],
                [15, 4, 3],
              ],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Structure',
                  name: 'Structure',
                  args: [],
                  meta: {
                    a: {
                      display: 'a',
                      type: [
                        {
                          display: 'Long',
                          name: 'Long',
                          args: [],
                          meta: {},
                          value: '42',
                        },
                      ],
                      direction: 'bidirectional',
                      source: 'user',
                      docs: '',
                      code: true,
                      pos: [3, 7, 2],
                    },
                  },
                },
              ],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [5, 0, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[5, 0, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [7, 0, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[7, 0, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  display: 'Structure',
                  name: 'Structure',
                  args: [],
                  meta: {
                    a: {
                      display: 'a',
                      type: [
                        {
                          display: 'Long',
                          name: 'Long',
                          args: [],
                          meta: {},
                          value: '42',
                        },
                      ],
                      direction: 'bidirectional',
                      source: 'user',
                      docs: '',
                      code: true,
                      pos: [3, 7, 2],
                    },
                  },
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
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          d: {
            type: 'v',
            name: 'd',
            pos: [11, 0, 1],
            meta: {
              display: 'd',
              isDefined: true,
              usage: [[11, 0, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          e: {
            type: 'v',
            name: 'e',
            pos: [13, 0, 1],
            meta: {
              display: 'e',
              isDefined: true,
              usage: [[13, 0, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          f: {
            type: 'v',
            name: 'f',
            pos: [15, 0, 1],
            meta: {
              display: 'f',
              isDefined: true,
              usage: [[15, 0, 1]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
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
        name: 'struct_checks',
        pos: [0, 4, 13],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nstruct_checks\n```\n',
          docsLookup: {},
          display: 'struct_checks',
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
      pro: { struct_checks: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
