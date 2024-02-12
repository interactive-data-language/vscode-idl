import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from output arguments`, () => {
  it(`[auto generated] and exclude incorrectly documented parameters`, async () => {
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
      `;   a: in, required, ENVIRaster`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   b: out, required, Long`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   c: out, required, ENVIRaster`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `pro auto_doc_example, a, b, c`,
      `  compile_opt idl2`,
      ``,
      `end`,
      ``,
      `; main level`,
      `compile_opt idl2`,
      `auto_doc_example, arg1, arg2, arg3`,
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
        auto_doc_example: {
          a: {
            type: 'v',
            name: 'a',
            pos: [10, 22, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[10, 22, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [10, 25, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[10, 25, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [10, 28, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[10, 28, 1]],
              docs: 'Placeholder docs for argument, keyword, or property',
              source: 'user',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
        },
      },
      main: {
        arg1: {
          type: 'v',
          name: 'arg1',
          pos: [17, 18, 4],
          meta: {
            display: 'arg1',
            isDefined: false,
            usage: [[17, 18, 4]],
            docs: '',
            source: 'user',
            type: [{ display: 'any', name: 'any', args: [], meta: {} }],
          },
        },
        arg2: {
          type: 'v',
          name: 'arg2',
          pos: [17, 24, 4],
          meta: {
            display: 'arg2',
            isDefined: true,
            usage: [[17, 24, 4]],
            docs: '',
            source: 'user',
            type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
          },
        },
        arg3: {
          type: 'v',
          name: 'arg3',
          pos: [17, 30, 4],
          meta: {
            display: 'arg3',
            isDefined: true,
            usage: [[17, 30, 4]],
            docs: '',
            source: 'user',
            type: [
              { name: 'ENVIRaster', display: 'ENVIRaster', args: [], meta: {} },
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
        pos: [15, 0, 12],
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
        type: 'p',
        name: 'auto_doc_example',
        pos: [10, 4, 16],
        meta: {
          source: 'user',
          args: {
            a: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'a',
              code: true,
              pos: [10, 22, 1],
            },
            b: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'out',
              source: 'internal',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'b',
              code: true,
              pos: [10, 25, 1],
            },
            c: {
              docs: 'Placeholder docs for argument, keyword, or property',
              direction: 'out',
              source: 'internal',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'c',
              code: true,
              pos: [10, 28, 1],
            },
          },
          docs: '\n```idl\nauto_doc_example, a, b, c\n```\n\n\n\n\n#### Arguments\n\n- **a**: in, required, ENVIRaster\n\n  Placeholder docs for argument, keyword, or property\n\n- **b**: out, required, Long\n\n  Placeholder docs for argument, keyword, or property\n\n- **c**: out, required, ENVIRaster\n\n  Placeholder docs for argument, keyword, or property\n\n',
          docsLookup: { default: '' },
          display: 'auto_doc_example',
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
      pro: { auto_doc_example: ['idl2'] },
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
