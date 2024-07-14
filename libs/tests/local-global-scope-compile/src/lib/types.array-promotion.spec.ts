import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

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
      0
    );

    // test code to extract tokens from
    const code = [
      `;+`,
      `; :Returns: ArrayPromotion<String>`,
      `;`,
      `; :Arguments:`,
      `;   a: bidirectional, required, any`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function test, a`,
      `  compile_opt idl2`,
      ``,
      `  return, 1`,
      `end`,
      ``,
      `compile_opt idl2`,
      ``,
      `; scalars`,
      `scalar1 = test(1)`,
      ``,
      `; arrays`,
      `array1 = test([1])`,
      `array2 = test(bytarr(5))`,
      ``,
      `; either scalar or array`,
      `c = made_up()`,
      `either = test(c)`,
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
      func: {
        test: {
          a: {
            type: 'v',
            name: 'a',
            pos: [8, 15, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[8, 15, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
        },
      },
      pro: {},
      main: {
        scalar1: {
          type: 'v',
          name: 'scalar1',
          pos: [17, 0, 7],
          meta: {
            display: 'scalar1',
            isDefined: true,
            usage: [[17, 0, 7]],
            docs: '',
            source: 'user',
            type: [{ name: 'String', display: 'String', args: [], meta: {} }],
          },
        },
        array1: {
          type: 'v',
          name: 'array1',
          pos: [20, 0, 6],
          meta: {
            display: 'array1',
            isDefined: true,
            usage: [[20, 0, 6]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Array',
                display: 'Array<String>',
                args: [
                  [{ name: 'String', display: 'String', args: [], meta: {} }],
                ],
                meta: {},
              },
            ],
          },
        },
        array2: {
          type: 'v',
          name: 'array2',
          pos: [21, 0, 6],
          meta: {
            display: 'array2',
            isDefined: true,
            usage: [[21, 0, 6]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Array',
                display: 'Array<String>',
                args: [
                  [{ name: 'String', display: 'String', args: [], meta: {} }],
                ],
                meta: {},
              },
            ],
          },
        },
        c: {
          type: 'v',
          name: 'c',
          pos: [24, 0, 1],
          meta: {
            display: 'c',
            isDefined: true,
            usage: [
              [24, 0, 1],
              [25, 14, 1],
            ],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        either: {
          type: 'v',
          name: 'either',
          pos: [25, 0, 6],
          meta: {
            display: 'either',
            isDefined: true,
            usage: [[25, 0, 6]],
            docs: '',
            source: 'user',
            type: [
              { name: 'String', display: 'String', args: [], meta: {} },
              {
                name: 'Array',
                display: 'Array<String>',
                args: [
                  [{ name: 'String', display: 'String', args: [], meta: {} }],
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
        pos: [14, 0, 11],
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
        name: 'test',
        pos: [8, 9, 4],
        meta: {
          source: 'user',
          args: {
            a: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'a',
              code: true,
              pos: [8, 15, 1],
            },
          },
          docs: '\n```idl\n;+\n; :Returns: ArrayPromotion<String>\n;+\nresult = test(a)\n```\n\n\n\n\n#### Arguments\n\n- **a**: bidirectional, required, any\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '', returns: 'ArrayPromotion<String>' },
          display: 'test',
          kws: {},
          private: false,
          returns: [
            {
              name: 'ArrayPromotion',
              display: 'ArrayPromotion<String>',
              args: [
                [{ name: 'String', display: 'String', args: [], meta: {} }],
              ],
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
      func: { test: ['idl2'] },
      pro: {},
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
