import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from call_function()`, () => {
  it(`[auto generated] for known and unknown functions`, async () => {
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
      `; main level`,
      `compile_opt idl2`,
      `known = call_function('envi')`,
      `unknown = call_function('unknownfunction')`,
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
        known: {
          type: 'v',
          name: 'known',
          pos: [2, 0, 5],
          meta: {
            display: 'known',
            isDefined: true,
            usage: [[2, 0, 5]],
            docs: '',
            source: 'user',
            type: [{ name: 'ENVI', display: 'ENVI', args: [], meta: {} }],
          },
        },
        unknown: {
          type: 'v',
          name: 'unknown',
          pos: [3, 0, 7],
          meta: {
            display: 'unknown',
            isDefined: true,
            usage: [[3, 0, 7]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
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
        pos: [0, 0, 12],
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
