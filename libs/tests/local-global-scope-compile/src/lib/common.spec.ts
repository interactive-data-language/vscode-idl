import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly extract variables from`, () => {
  it(`[auto generated] common, excluding the first of the common block`, async () => {
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
      `pro color_edit_back`,
      `compile_opt idl2`,
      ``,
      `common color_edit, wxsize, wysize, r0`,
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
        color_edit_back: {
          wxsize: {
            type: 'v',
            name: 'wxsize',
            pos: [3, 19, 6],
            meta: {
              display: 'wxsize',
              isDefined: true,
              usage: [[3, 19, 6]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          wysize: {
            type: 'v',
            name: 'wysize',
            pos: [3, 27, 6],
            meta: {
              display: 'wysize',
              isDefined: true,
              usage: [[3, 27, 6]],
              docs: '',
              source: 'user',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
            },
          },
          r0: {
            type: 'v',
            name: 'r0',
            pos: [3, 35, 2],
            meta: {
              display: 'r0',
              isDefined: true,
              usage: [[3, 35, 2]],
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
        name: 'color_edit_back',
        pos: [0, 4, 15],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\ncolor_edit_back\n```\n',
          docsLookup: {},
          display: 'color_edit_back',
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
      pro: { color_edit_back: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
