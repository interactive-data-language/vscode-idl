import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] array creation that needs to promote to "any"`, async () => {
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
      `pro array_creation`,
      `  compile_opt idl2`,
      ``,
      `  lookup = $`,
      `    [(regName ? {prop: 'NAME', cat: 'Property:Name', str: 'Name'} : []), $`,
      `    {prop: 'COLOR', cat: 'Property:Color', str: 'Color'}]`,
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
        array_creation: {
          lookup: {
            type: 'v',
            name: 'lookup',
            pos: [3, 2, 6],
            meta: {
              display: 'lookup',
              isDefined: true,
              usage: [[3, 2, 6]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
          },
          regname: {
            type: 'v',
            name: 'regname',
            pos: [4, 6, 7],
            meta: {
              display: 'regName',
              isDefined: false,
              usage: [[4, 6, 7]],
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
        name: 'array_creation',
        pos: [0, 4, 14],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\narray_creation\n```\n',
          docsLookup: {},
          display: 'array_creation',
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
      pro: { array_creation: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
