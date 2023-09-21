import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Ignore them in`, () => {
  it(`[auto generated] procedures`, async () => {
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
      `pro my_def__define`,
      `compile_opt idl2`,
      `fhdr = {WAVFILEHEADER, $`,
      `  friff: bytarr(4), $ ; A four char string`,
      `  fsize: 0ul, $`,
      `  fwave: bytarr(4) $ ; A four char string`,
      `}`,
      ``,
      `if ~_exists then defsysv, '!notebook_magic', {IDLNotebookMagic}`,
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
      pro: {
        my_def__define: {
          fhdr: {
            type: 'v',
            name: 'fhdr',
            pos: [2, 0, 4],
            meta: {
              display: 'fhdr',
              isDefined: true,
              usage: [[2, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'WAVFILEHEADER',
                  display: 'WAVFILEHEADER',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          _exists: {
            type: 'v',
            name: '_exists',
            pos: [8, 4, 7],
            meta: {
              display: '_exists',
              isDefined: false,
              usage: [[8, 4, 7]],
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
        name: 'my_def__define',
        pos: [0, 4, 14],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmy_def__define\n```\n',
          docsLookup: {},
          display: 'my_def__define',
          kws: {},
          private: false,
          struct: [
            {
              type: 's',
              name: 'wavfileheader',
              pos: [2, 8, 13],
              meta: {
                display: 'WAVFILEHEADER',
                inherits: [],
                docs: '',
                props: {
                  friff: {
                    direction: 'bidirectional',
                    display: 'friff',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [3, 2, 6],
                  },
                  fsize: {
                    direction: 'bidirectional',
                    display: 'fsize',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [4, 2, 6],
                  },
                  fwave: {
                    direction: 'bidirectional',
                    display: 'fwave',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [5, 2, 6],
                  },
                },
                source: 'user',
              },
            },
          ],
        },
        file: 'not-real',
      },
      {
        type: 's',
        name: 'wavfileheader',
        pos: [2, 8, 13],
        meta: {
          display: 'WAVFILEHEADER',
          inherits: [],
          docs: '',
          props: {
            friff: {
              direction: 'bidirectional',
              display: 'friff',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [3, 2, 6],
            },
            fsize: {
              direction: 'bidirectional',
              display: 'fsize',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [4, 2, 6],
            },
            fwave: {
              direction: 'bidirectional',
              display: 'fwave',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [5, 2, 6],
            },
          },
          source: 'user',
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { my_def__define: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] as nested properties`, async () => {
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
      `pro my_def__define`,
      `compile_opt idl2`,
      `fhdr = {WAVFILEHEADER, $`,
      `  friff: bytarr(4), $ ; A four char string`,
      `  fsize: 0ul, $`,
      `  fwave: bytarr(4) $ ; A four char string`,
      `}`,
      ``,
      `!null = {OtherStruct, prop:{SecondOtherStruct}}`,
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
      pro: {
        my_def__define: {
          fhdr: {
            type: 'v',
            name: 'fhdr',
            pos: [2, 0, 4],
            meta: {
              display: 'fhdr',
              isDefined: true,
              usage: [[2, 0, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'WAVFILEHEADER',
                  display: 'WAVFILEHEADER',
                  args: [],
                  meta: {},
                },
              ],
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
        name: 'my_def__define',
        pos: [0, 4, 14],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmy_def__define\n```\n',
          docsLookup: {},
          display: 'my_def__define',
          kws: {},
          private: false,
          struct: [
            {
              type: 's',
              name: 'wavfileheader',
              pos: [2, 8, 13],
              meta: {
                display: 'WAVFILEHEADER',
                inherits: [],
                docs: '',
                props: {
                  friff: {
                    direction: 'bidirectional',
                    display: 'friff',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [3, 2, 6],
                  },
                  fsize: {
                    direction: 'bidirectional',
                    display: 'fsize',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [4, 2, 6],
                  },
                  fwave: {
                    direction: 'bidirectional',
                    display: 'fwave',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [5, 2, 6],
                  },
                },
                source: 'user',
              },
            },
            {
              type: 's',
              name: 'otherstruct',
              pos: [8, 9, 11],
              meta: {
                display: 'OtherStruct',
                inherits: [],
                docs: '',
                props: {
                  prop: {
                    direction: 'bidirectional',
                    display: 'prop',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [8, 22, 5],
                  },
                },
                source: 'user',
              },
            },
          ],
        },
        file: 'not-real',
      },
      {
        type: 's',
        name: 'wavfileheader',
        pos: [2, 8, 13],
        meta: {
          display: 'WAVFILEHEADER',
          inherits: [],
          docs: '',
          props: {
            friff: {
              direction: 'bidirectional',
              display: 'friff',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [3, 2, 6],
            },
            fsize: {
              direction: 'bidirectional',
              display: 'fsize',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [4, 2, 6],
            },
            fwave: {
              direction: 'bidirectional',
              display: 'fwave',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [5, 2, 6],
            },
          },
          source: 'user',
        },
        file: 'not-real',
      },
      {
        type: 's',
        name: 'otherstruct',
        pos: [8, 9, 11],
        meta: {
          display: 'OtherStruct',
          inherits: [],
          docs: '',
          props: {
            prop: {
              direction: 'bidirectional',
              display: 'prop',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [8, 22, 5],
            },
          },
          source: 'user',
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { my_def__define: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
