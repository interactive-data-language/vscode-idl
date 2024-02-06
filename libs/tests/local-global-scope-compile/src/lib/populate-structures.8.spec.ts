import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Take first instance we encounter`, () => {
  it(`[auto generated] with non-full parse`, async () => {
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
      `if ~_exists then defsysv, '!notebook_magic', {WAVFILEHEADER}`,
      ``,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true, full: false }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: { my_def__define: {} },
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
          private: false,
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { my_def__define: [] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
