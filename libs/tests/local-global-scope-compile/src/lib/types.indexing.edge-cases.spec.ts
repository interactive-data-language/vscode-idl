import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] indexing compound types`, async () => {
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
      `; should be number`,
      `rb_match = (where(5 eq [1, 2, 3, 4, 5]))[0]`,
      `end`,
      ``,
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
        rb_match: {
          type: 'v',
          name: 'rb_match',
          pos: [2, 0, 8],
          meta: {
            display: 'rb_match',
            isDefined: true,
            usage: [[2, 0, 8]],
            docs: '',
            source: 'user',
            type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
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

  it(`[auto generated] scalar with array`, async () => {
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
      `polyColors = 5l`,
      `array1 = polyColors[idx : nMax]`,
      `array2 = polyColors[[5 : 15: 1]]`,
      `end`,
      ``,
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
        polycolors: {
          type: 'v',
          name: 'polycolors',
          pos: [1, 0, 10],
          meta: {
            display: 'polyColors',
            isDefined: true,
            usage: [
              [1, 0, 10],
              [2, 9, 10],
              [3, 9, 10],
            ],
            docs: '',
            source: 'user',
            type: [
              {
                display: 'Long',
                name: 'Long',
                args: [],
                meta: {},
                value: '5l',
              },
            ],
          },
        },
        array1: {
          type: 'v',
          name: 'array1',
          pos: [2, 0, 6],
          meta: {
            display: 'array1',
            isDefined: true,
            usage: [[2, 0, 6]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Array',
                display: 'Array<Long>',
                args: [[{ name: 'Long', display: 'Long', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
        idx: {
          type: 'v',
          name: 'idx',
          pos: [2, 20, 3],
          meta: {
            display: 'idx',
            isDefined: false,
            usage: [[2, 20, 3]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        nmax: {
          type: 'v',
          name: 'nmax',
          pos: [2, 26, 4],
          meta: {
            display: 'nMax',
            isDefined: false,
            usage: [[2, 26, 4]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        array2: {
          type: 'v',
          name: 'array2',
          pos: [3, 0, 6],
          meta: {
            display: 'array2',
            isDefined: true,
            usage: [[3, 0, 6]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'Array',
                display: 'Array<Long>',
                args: [[{ name: 'Long', display: 'Long', args: [], meta: {} }]],
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
