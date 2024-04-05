import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly generate syntax for routine signatures`, () => {
  it(`[auto generated] for all basic cases`, async () => {
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
      `function testfunction, a, b, c, kw1 = kw1`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `function testfunction2, kw1 = kw1`,
      `  compile_opt idl2`,
      `  return, 1`,
      `end`,
      ``,
      `pro test, a, b, c, kw1 = kw1`,
      `  compile_opt idl2`,
      `end`,
      ``,
      `pro test2, kw1 = kw1`,
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
      func: {
        testfunction2: {
          kw1: {
            type: 'v',
            name: 'kw1',
            pos: [5, 30, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              usage: [[5, 30, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
        },
        testfunction: {
          kw1: {
            type: 'v',
            name: 'kw1',
            pos: [0, 38, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              usage: [[0, 38, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [0, 23, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[0, 23, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [0, 26, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[0, 26, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [0, 29, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[0, 29, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
        },
      },
      pro: {
        test2: {
          kw1: {
            type: 'v',
            name: 'kw1',
            pos: [14, 17, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              usage: [[14, 17, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
        },
        test: {
          kw1: {
            type: 'v',
            name: 'kw1',
            pos: [10, 25, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              usage: [[10, 25, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [10, 10, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[10, 10, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          b: {
            type: 'v',
            name: 'b',
            pos: [10, 13, 1],
            meta: {
              display: 'b',
              isDefined: true,
              usage: [[10, 13, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          c: {
            type: 'v',
            name: 'c',
            pos: [10, 16, 1],
            meta: {
              display: 'c',
              isDefined: true,
              usage: [[10, 16, 1]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
        name: 'test2',
        pos: [14, 4, 5],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\ntest2, $\n  kw1 = value\n```\n\n\n#### Keywords\n\n- **kw1**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: {},
          display: 'test2',
          kws: {
            kw1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'kw1',
              code: true,
              pos: [14, 11, 3],
            },
          },
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'p',
        name: 'test',
        pos: [10, 4, 4],
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
              pos: [10, 10, 1],
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
              pos: [10, 13, 1],
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
              pos: [10, 16, 1],
            },
          },
          docs: '\n```idl\ntest, a, b, c, $\n  kw1 = value\n```\n\n\n#### Arguments\n\n- **a**: bidirectional, required, any\n\n  \n\n- **b**: bidirectional, required, any\n\n  \n\n- **c**: bidirectional, required, any\n\n  \n\n\n\n#### Keywords\n\n- **kw1**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: {},
          display: 'test',
          kws: {
            kw1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'kw1',
              code: true,
              pos: [10, 19, 3],
            },
          },
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'testfunction2',
        pos: [5, 9, 13],
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = testfunction2( $\n  kw1 = value)\n```\n\n\n#### Keywords\n\n- **kw1**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: {},
          display: 'testfunction2',
          kws: {
            kw1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'kw1',
              code: true,
              pos: [5, 24, 3],
            },
          },
          private: false,
          returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
          struct: [],
        },
        file: 'not-real',
      },
      {
        type: 'f',
        name: 'testfunction',
        pos: [0, 9, 12],
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
              pos: [0, 23, 1],
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
              pos: [0, 26, 1],
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
              pos: [0, 29, 1],
            },
          },
          docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = testfunction(a, b, c, $\n  kw1 = value)\n```\n\n\n#### Arguments\n\n- **a**: bidirectional, required, any\n\n  \n\n- **b**: bidirectional, required, any\n\n  \n\n- **c**: bidirectional, required, any\n\n  \n\n\n\n#### Keywords\n\n- **kw1**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: {},
          display: 'testfunction',
          kws: {
            kw1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'kw1',
              code: true,
              pos: [0, 32, 3],
            },
          },
          private: false,
          returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { testfunction2: ['idl2'], testfunction: ['idl2'] },
      pro: { test2: ['idl2'], test: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
