import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/core';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly extract docs for`, () => {
  it(`[auto generated] variables with single-line block`, async () => {
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
      `pro myclass::mymethod, var1`,
      `  compile_opt idl2`,
      `  ;+ meaning of life`,
      `  a = 42`,
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
        'myclass::mymethod': {
          var1: {
            type: 'v',
            name: 'var1',
            pos: [0, 23, 4],
            meta: {
              display: 'var1',
              isDefined: true,
              usage: [[0, 23, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [3, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[3, 2, 1]],
              docs: 'meaning of life',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '42',
                },
              ],
            },
          },
          self: {
            type: 'v',
            name: 'self',
            pos: [0, 4, 17],
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
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'pm',
        name: 'myclass::mymethod',
        pos: [0, 4, 17],
        meta: {
          className: 'myclass',
          method: 'mymethod',
          source: 'user',
          args: {
            var1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'var1',
              code: true,
              pos: [0, 23, 4],
            },
          },
          docs: '\n```idl\nmyclass.mymethod, var1\n```\n\n\n#### Arguments\n\n- **var1**: bidirectional, required, any\n\n  \n\n',
          docsLookup: {},
          display: 'myclass::mymethod',
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
      pro: { 'myclass::mymethod': ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] variables with multi-line block`, async () => {
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
      `pro myclass::mymethod, var1`,
      `  compile_opt idl2`,
      `  ;+`,
      `  ; Some things are really awesome`,
      `  ; and need a big description`,
      `  ;-`,
      `  a = 42`,
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
        'myclass::mymethod': {
          var1: {
            type: 'v',
            name: 'var1',
            pos: [0, 23, 4],
            meta: {
              display: 'var1',
              isDefined: true,
              usage: [[0, 23, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [6, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [[6, 2, 1]],
              docs: 'Some things are really awesome\nand need a big description',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '42',
                },
              ],
            },
          },
          self: {
            type: 'v',
            name: 'self',
            pos: [0, 4, 17],
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
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'pm',
        name: 'myclass::mymethod',
        pos: [0, 4, 17],
        meta: {
          className: 'myclass',
          method: 'mymethod',
          source: 'user',
          args: {
            var1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'var1',
              code: true,
              pos: [0, 23, 4],
            },
          },
          docs: '\n```idl\nmyclass.mymethod, var1\n```\n\n\n#### Arguments\n\n- **var1**: bidirectional, required, any\n\n  \n\n',
          docsLookup: {},
          display: 'myclass::mymethod',
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
      pro: { 'myclass::mymethod': ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] only use docs from first encounter`, async () => {
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
      `pro myclass::mymethod, var1`,
      `  compile_opt idl2`,
      `  ;+`,
      `  ; Some things are really awesome`,
      `  ; and need a big description`,
      `  ;-`,
      `  a = 42`,
      ``,
      `  ;+ second docs are ignored`,
      `  a = 42`,
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
        'myclass::mymethod': {
          var1: {
            type: 'v',
            name: 'var1',
            pos: [0, 23, 4],
            meta: {
              display: 'var1',
              isDefined: true,
              usage: [[0, 23, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          a: {
            type: 'v',
            name: 'a',
            pos: [6, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              usage: [
                [6, 2, 1],
                [9, 2, 1],
              ],
              docs: 'Some things are really awesome\nand need a big description',
              source: 'user',
              type: [
                {
                  display: 'Long',
                  name: 'Long',
                  args: [],
                  meta: {},
                  value: '42',
                },
              ],
            },
          },
          self: {
            type: 'v',
            name: 'self',
            pos: [0, 4, 17],
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
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'pm',
        name: 'myclass::mymethod',
        pos: [0, 4, 17],
        meta: {
          className: 'myclass',
          method: 'mymethod',
          source: 'user',
          args: {
            var1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'var1',
              code: true,
              pos: [0, 23, 4],
            },
          },
          docs: '\n```idl\nmyclass.mymethod, var1\n```\n\n\n#### Arguments\n\n- **var1**: bidirectional, required, any\n\n  \n\n',
          docsLookup: {},
          display: 'myclass::mymethod',
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
      pro: { 'myclass::mymethod': ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
