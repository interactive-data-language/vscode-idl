import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Add function for`, () => {
  it(`[auto generated] class init methods`, async () => {
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
      `function MyClass::init, a, b, c, kw2 = kw2`,
      `  compile_opt idl2`,
      ``,
      `  ; set data type correctly for local variable`,
      `  z = MyClass()`,
      ``,
      `  return, 1`,
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
      func: {
        'myclass::init': {
          kw2: {
            type: 'v',
            name: 'kw2',
            pos: [0, 39, 3],
            meta: {
              display: 'kw2',
              isDefined: true,
              usage: [[0, 39, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [0, 24, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[0, 24, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [0, 27, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[0, 27, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [0, 30, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[0, 30, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          z: {
            type: 'v',
            name: 'z',
            pos: [4, 2, 1],
            meta: {
              display: 'z',
              isDefined: true,
              usage: [[4, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                { name: 'MyClass', display: 'MyClass', args: [], meta: {} },
              ],
            },
          },
          self: {
            type: 'v',
            name: 'self',
            pos: [0, 9, 13],
            meta: {
              display: 'self',
              isDefined: true,
              docs: 'A reference to our object class',
              source: 'user',
              type: [
                { name: 'myclass', display: 'myclass', args: [], meta: {} },
              ],
              usage: [],
            },
          },
        },
      },
      pro: {},
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'fm',
        name: 'myclass::init',
        pos: [0, 9, 13],
        meta: {
          className: 'myclass',
          method: 'init',
          source: 'user',
          args: {
            a: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'a',
              code: true,
              pos: [0, 24, 1],
            },
            b: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'b',
              code: true,
              pos: [0, 27, 1],
            },
            c: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'c',
              code: true,
              pos: [0, 30, 1],
            },
          },
          docs: '\n```idl\nresult = MyClass.init( a, b, c, $\n [ kw2 = any ])\n```\n\n#### Arguments\n\n- **a**: bidirectional, required, any\n\n  \n\n- **b**: bidirectional, required, any\n\n  \n\n- **c**: bidirectional, required, any\n\n  \n\n\n#### Keywords\n\n- **kw2**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: {},
          display: 'MyClass::init',
          kws: {
            kw2: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'kw2',
              code: true,
              pos: [0, 33, 3],
            },
          },
          private: false,
          returns: [
            { name: 'MyClass', display: 'MyClass', args: [], meta: {} },
          ],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'myclass',
        pos: [0, 9, 13],
        meta: {
          source: 'user',
          args: {
            a: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'a',
              code: true,
              pos: [0, 24, 1],
            },
            b: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'b',
              code: true,
              pos: [0, 27, 1],
            },
            c: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'c',
              code: true,
              pos: [0, 30, 1],
            },
          },
          docs: '\n```idl\nresult = MyClass.init( a, b, c, $\n [ kw2 = any ])\n```\n\n#### Arguments\n\n- **a**: bidirectional, required, any\n\n  \n\n- **b**: bidirectional, required, any\n\n  \n\n- **c**: bidirectional, required, any\n\n  \n\n\n#### Keywords\n\n- **kw2**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: {},
          display: 'MyClass',
          kws: {
            kw2: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'kw2',
              code: true,
              pos: [0, 33, 3],
            },
          },
          private: false,
          returns: [
            { name: 'MyClass', display: 'MyClass', args: [], meta: {} },
          ],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { 'myclass::init': ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
