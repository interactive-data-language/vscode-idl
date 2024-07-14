import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] properties of anonymous structures`, async () => {
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
      `pro pro4`,
      `  compile_opt idl2`,
      `  a = {a: 'string', $`,
      `    b: \`string\`}`,
      ``,
      `  ; properties`,
      `  p1 = a.a`,
      `  p2 = p1.length`,
      `  p3 = (a.b)`,
      `  p4 = a.b`,
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
        pro4: {
          a: {
            type: 'v',
            name: 'a',
            pos: [2, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [
                [2, 2, 1],
                [6, 7, 1],
                [8, 8, 1],
                [9, 7, 1],
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
                          display: 'String',
                          name: 'String',
                          args: [],
                          meta: {},
                          value: 'string',
                        },
                      ],
                      direction: 'bidirectional',
                      source: 'user',
                      docs: '',
                      code: true,
                      pos: [2, 7, 2],
                    },
                    b: {
                      display: 'b',
                      type: [
                        {
                          display: 'String',
                          name: 'String',
                          args: [],
                          meta: {},
                          value: 'string',
                        },
                      ],
                      direction: 'bidirectional',
                      source: 'user',
                      docs: '',
                      code: true,
                      pos: [3, 4, 2],
                    },
                  },
                },
              ],
            },
          },
          p1: {
            type: 'v',
            name: 'p1',
            pos: [6, 2, 2],
            meta: {
              display: 'p1',
              isDefined: true,
              usage: [
                [6, 2, 2],
                [7, 7, 2],
              ],
              docs: '',
              source: 'user',
              type: [{ display: 'String', name: 'String', args: [], meta: {} }],
            },
          },
          p2: {
            type: 'v',
            name: 'p2',
            pos: [7, 2, 2],
            meta: {
              display: 'p2',
              isDefined: true,
              usage: [[7, 2, 2]],
              docs: '',
              source: 'user',
              type: [{ display: 'Number', name: 'Number', args: [], meta: {} }],
            },
          },
          p3: {
            type: 'v',
            name: 'p3',
            pos: [8, 2, 2],
            meta: {
              display: 'p3',
              isDefined: true,
              usage: [[8, 2, 2]],
              docs: '',
              source: 'user',
              type: [{ display: 'String', name: 'String', args: [], meta: {} }],
            },
          },
          p4: {
            type: 'v',
            name: 'p4',
            pos: [9, 2, 2],
            meta: {
              display: 'p4',
              isDefined: true,
              usage: [[9, 2, 2]],
              docs: '',
              source: 'user',
              type: [{ display: 'String', name: 'String', args: [], meta: {} }],
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
        name: 'pro4',
        pos: [0, 4, 4],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\npro4\n```\n',
          docsLookup: {},
          display: 'pro4',
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
      pro: { pro4: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
