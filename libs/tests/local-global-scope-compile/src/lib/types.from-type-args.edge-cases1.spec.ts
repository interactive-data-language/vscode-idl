import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] type without type args`, async () => {
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
      `; :Arguments:`,
      `;   item: in, required, List<>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;-`,
      `pro foreach, item`,
      `  compile_opt idl2`,
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
        foreach: {
          item: {
            type: 'v',
            name: 'item',
            pos: [5, 13, 4],
            meta: {
              display: 'item',
              isDefined: true,
              usage: [[5, 13, 4]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'List',
                  display: 'List<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
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
        name: 'foreach',
        pos: [5, 4, 7],
        meta: {
          source: 'user',
          args: {
            item: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'List',
                  display: 'List<any>',
                  args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'item',
              code: true,
              pos: [5, 13, 4],
            },
          },
          docs: '\n```idl\nforeach, item\n```\n\n\n\n#### Arguments\n\n- **item**: in, required, List<any>\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'foreach',
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
      pro: { foreach: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
