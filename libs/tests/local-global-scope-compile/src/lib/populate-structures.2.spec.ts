import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Use docs for property types`, () => {
  it(`[auto generated] in structures`, async () => {
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
      `; :MyStruct:`,
      `;   prop: Long`,
      `;     Placeholder docs for argument or keyword`,
      `;   prop2: ENVIRaster`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro mystruct__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1, prop2: 4}`,
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
      pro: { mystruct__define: {} },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'mystruct__define',
        pos: [8, 4, 16],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmystruct__define\n```\n\n\n',
          docsLookup: { default: '' },
          display: 'mystruct__define',
          kws: {},
          private: false,
          struct: [
            {
              type: 's',
              name: 'mystruct',
              pos: [11, 11, 8],
              meta: {
                display: 'MyStruct',
                inherits: ['idl_object'],
                docs: '',
                props: {
                  prop: {
                    docs: 'Placeholder docs for argument or keyword',
                    direction: 'in',
                    source: 'internal',
                    type: [
                      { name: 'Long', display: 'Long', args: [], meta: {} },
                    ],
                    private: false,
                    req: false,
                    display: 'prop',
                    code: true,
                    pos: [11, 42, 5],
                  },
                  prop2: {
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
                    req: false,
                    display: 'prop2',
                    code: true,
                    pos: [11, 51, 6],
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
        name: 'mystruct',
        pos: [11, 11, 8],
        meta: {
          display: 'MyStruct',
          inherits: ['idl_object'],
          docs: '',
          props: {
            prop: {
              docs: 'Placeholder docs for argument or keyword',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'prop',
              code: true,
              pos: [11, 42, 5],
            },
            prop2: {
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
              req: false,
              display: 'prop2',
              code: true,
              pos: [11, 51, 6],
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
      pro: { mystruct__define: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] in structures as private`, async () => {
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
      `; :Private:`,
      `;`,
      `; :MyStruct:`,
      `;   prop: Long`,
      `;     Placeholder docs for argument or keyword`,
      `;   prop2: ENVIRaster`,
      `;     Placeholder docs for argument or keyword`,
      `;`,
      `;-`,
      `pro mystruct__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1, prop2: 4}`,
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
      pro: { mystruct__define: {} },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'mystruct__define',
        pos: [10, 4, 16],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmystruct__define\n```\n\n\n\n\n### Private\n\n',
          docsLookup: { default: '', private: '' },
          display: 'mystruct__define',
          kws: {},
          private: true,
          struct: [
            {
              type: 's',
              name: 'mystruct',
              pos: [13, 11, 8],
              meta: {
                display: 'MyStruct',
                inherits: ['idl_object'],
                docs: '',
                props: {
                  prop: {
                    docs: 'Placeholder docs for argument or keyword',
                    direction: 'in',
                    source: 'internal',
                    type: [
                      { name: 'Long', display: 'Long', args: [], meta: {} },
                    ],
                    private: false,
                    req: false,
                    display: 'prop',
                    code: true,
                    pos: [13, 42, 5],
                  },
                  prop2: {
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
                    req: false,
                    display: 'prop2',
                    code: true,
                    pos: [13, 51, 6],
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
        name: 'mystruct',
        pos: [13, 11, 8],
        meta: {
          display: 'MyStruct',
          inherits: ['idl_object'],
          docs: '',
          props: {
            prop: {
              docs: 'Placeholder docs for argument or keyword',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Long', display: 'Long', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'prop',
              code: true,
              pos: [13, 42, 5],
            },
            prop2: {
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
              req: false,
              display: 'prop2',
              code: true,
              pos: [13, 51, 6],
            },
          },
          source: 'user',
          private: true,
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { mystruct__define: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
