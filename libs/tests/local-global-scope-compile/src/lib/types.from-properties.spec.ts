import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] properties`, async () => {
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
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro pro4, a`,
      `  compile_opt idl2`,
      ``,
      `  ; properties`,
      `  p1 = a.metadata`,
      `  p2 = p1.count`,
      `  p3 = (a.metadata)`,
      `  p4 = a.metadata.count`,
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
            pos: [6, 10, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [
                [6, 10, 1],
                [10, 7, 1],
                [12, 8, 1],
                [13, 7, 1],
              ],
              docs: 'Placeholder docs for argument or keyword',
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
          p1: {
            type: 'v',
            name: 'p1',
            pos: [10, 2, 2],
            meta: {
              display: 'p1',
              isDefined: true,
              usage: [
                [10, 2, 2],
                [11, 7, 2],
              ],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ENVIRasterMetadata',
                  display: 'ENVIRasterMetadata',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          p2: {
            type: 'v',
            name: 'p2',
            pos: [11, 2, 2],
            meta: {
              display: 'p2',
              isDefined: true,
              usage: [[11, 2, 2]],
              docs: '',
              source: 'user',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
            },
          },
          p3: {
            type: 'v',
            name: 'p3',
            pos: [12, 2, 2],
            meta: {
              display: 'p3',
              isDefined: true,
              usage: [[12, 2, 2]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ENVIRasterMetadata',
                  display: 'ENVIRasterMetadata',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          p4: {
            type: 'v',
            name: 'p4',
            pos: [13, 2, 2],
            meta: {
              display: 'p4',
              isDefined: true,
              usage: [[13, 2, 2]],
              docs: '',
              source: 'user',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
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
        pos: [6, 4, 4],
        meta: {
          source: 'user',
          args: {
            a: {
              docs: 'Placeholder docs for argument or keyword',
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
              pos: [6, 10, 1],
            },
          },
          docs: '\n```idl\npro4, a\n```\n\n\n\n\n#### Arguments\n\n- **a**: in, required, ENVIRaster\n\n  Placeholder docs for argument or keyword\n\n',
          docsLookup: { default: '' },
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
