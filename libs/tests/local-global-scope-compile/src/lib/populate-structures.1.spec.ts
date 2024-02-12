import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly populate structures`, () => {
  it(`[auto generated] in class definitions`, async () => {
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
      `pro mystruct__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct, inherits IDL_object, prop: 1, prop2: 4}`,
      ``,
      `  !null = {mystruct2, inherits IDL_object, prop: 1, prop2: 4}`,
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
        pos: [0, 4, 16],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmystruct__define\n```\n',
          docsLookup: {},
          display: 'mystruct__define',
          kws: {},
          private: false,
          struct: [
            {
              type: 's',
              name: 'mystruct',
              pos: [3, 11, 8],
              meta: {
                display: 'MyStruct',
                inherits: ['idl_object'],
                docs: '',
                props: {
                  prop: {
                    direction: 'bidirectional',
                    display: 'prop',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [3, 42, 5],
                  },
                  prop2: {
                    direction: 'bidirectional',
                    display: 'prop2',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [3, 51, 6],
                  },
                },
                source: 'user',
              },
            },
            {
              type: 's',
              name: 'mystruct2',
              pos: [5, 11, 9],
              meta: {
                display: 'mystruct2',
                inherits: ['idl_object'],
                docs: '',
                props: {
                  prop: {
                    direction: 'bidirectional',
                    display: 'prop',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [5, 43, 5],
                  },
                  prop2: {
                    direction: 'bidirectional',
                    display: 'prop2',
                    code: true,
                    source: 'user',
                    docs: '',
                    type: [{ display: 'any', name: 'any', args: [], meta: {} }],
                    pos: [5, 52, 6],
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
        pos: [3, 11, 8],
        meta: {
          display: 'MyStruct',
          inherits: ['idl_object'],
          docs: '',
          props: {
            prop: {
              direction: 'bidirectional',
              display: 'prop',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [3, 42, 5],
            },
            prop2: {
              direction: 'bidirectional',
              display: 'prop2',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [3, 51, 6],
            },
          },
          source: 'user',
          private: false,
        },
        file: 'not-real',
      },
      {
        type: 's',
        name: 'mystruct2',
        pos: [5, 11, 9],
        meta: {
          display: 'mystruct2',
          inherits: ['idl_object'],
          docs: '',
          props: {
            prop: {
              direction: 'bidirectional',
              display: 'prop',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [5, 43, 5],
            },
            prop2: {
              direction: 'bidirectional',
              display: 'prop2',
              code: true,
              source: 'user',
              docs: '',
              type: [{ display: 'any', name: 'any', args: [], meta: {} }],
              pos: [5, 52, 6],
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

  it(`[auto generated] with no properties`, async () => {
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
      `pro mystruct__define`,
      `  compile_opt idl2`,
      ``,
      `  !null = {MyStruct}`,
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
        pos: [0, 4, 16],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\nmystruct__define\n```\n',
          docsLookup: {},
          display: 'mystruct__define',
          kws: {},
          private: false,
          struct: [
            {
              type: 's',
              name: 'mystruct',
              pos: [3, 11, 8],
              meta: {
                display: 'MyStruct',
                inherits: [],
                docs: '',
                props: {},
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
        pos: [3, 11, 8],
        meta: {
          display: 'MyStruct',
          inherits: [],
          docs: '',
          props: {},
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
});
