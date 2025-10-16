import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';
import { GlobalTokens, ICompileOptions } from '@idl/types/idl-data-types';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] array creation using edge cases that failed`, async () => {
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
      `  ; array of number`,
      `  a = [where(x)]`,
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
          a: {
            type: 'v',
            name: 'a',
            pos: [4, 2, 1],
            meta: {
              display: 'a',
              isDefined: true,
              canReset: true,
              usage: [[4, 2, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Number>',
                  serialized: 'Array<Number>',
                  args: [
                    [
                      {
                        name: 'Number',
                        display: 'Number',
                        serialized: 'Number',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          x: {
            type: 'v',
            name: 'x',
            pos: [4, 13, 1],
            meta: {
              display: 'x',
              isDefined: true,
              canReset: true,
              usage: [[4, 13, 1]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'any',
                  display: 'any',
                  serialized: 'any',
                  args: [],
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
        name: 'array_creation',
        pos: [0, 4, 14],
        range: { start: [0, 0, 4], end: [5, 0, 3] },
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

  it(`[auto generated] scalars or arrays can be used interchangeably`, async () => {
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
      `  e = envi()`,
      `  r = e.openRaster() ; scalar or array ENVIRaster`,
      `  ; array of ENVIRaster`,
      `  arr = [r]`,
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
          e: {
            type: 'v',
            name: 'e',
            pos: [2, 2, 1],
            meta: {
              display: 'e',
              isDefined: true,
              canReset: true,
              usage: [
                [2, 2, 1],
                [3, 6, 1],
              ],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ENVI',
                  display: 'ENVI',
                  serialized: 'ENVI',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          r: {
            type: 'v',
            name: 'r',
            pos: [3, 2, 1],
            meta: {
              display: 'r',
              isDefined: true,
              canReset: true,
              usage: [
                [3, 2, 1],
                [5, 9, 1],
              ],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  serialized: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
                {
                  name: 'Array',
                  display: 'Array<ENVIRaster>',
                  serialized: 'Array<ENVIRaster>',
                  args: [
                    [
                      {
                        name: 'ENVIRaster',
                        display: 'ENVIRaster',
                        serialized: 'ENVIRaster',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          arr: {
            type: 'v',
            name: 'arr',
            pos: [5, 2, 3],
            meta: {
              display: 'arr',
              isDefined: true,
              canReset: true,
              usage: [[5, 2, 3]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ENVIRaster>',
                  serialized: 'Array<ENVIRaster>',
                  args: [
                    [
                      {
                        name: 'ENVIRaster',
                        display: 'ENVIRaster',
                        serialized: 'ENVIRaster',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
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
        name: 'array_creation',
        pos: [0, 4, 14],
        range: { start: [0, 0, 4], end: [6, 0, 3] },
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

  it(`[auto generated] allow all objects as long as no structures or all structures`, async () => {
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
      `  arr1 = [ENVIRaster(), ENVIMetaspectralRaster(), ENVISubsetRaster()]`,
      `  arr2 = [{}, {}]`,
      ``,
      `  bad = [ENVIRaster(), ENVIMetaspectralRaster(), ENVISubsetRaster(), {}, 1]`,
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
          arr1: {
            type: 'v',
            name: 'arr1',
            pos: [2, 2, 4],
            meta: {
              display: 'arr1',
              isDefined: true,
              canReset: true,
              usage: [[2, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display:
                    'Array<ENVIRaster | ENVIMetaspectralRaster | ENVISubsetRaster>',
                  serialized:
                    'Array<ENVIRaster | ENVIMetaspectralRaster | ENVISubsetRaster>',
                  args: [
                    [
                      {
                        name: 'ENVIRaster',
                        display: 'ENVIRaster',
                        serialized: 'ENVIRaster',
                        args: [],
                        meta: {},
                      },
                      {
                        name: 'ENVIMetaspectralRaster',
                        display: 'ENVIMetaspectralRaster',
                        serialized: 'ENVIMetaspectralRaster',
                        args: [],
                        meta: {},
                      },
                      {
                        name: 'ENVISubsetRaster',
                        display: 'ENVISubsetRaster',
                        serialized: 'ENVISubsetRaster',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          arr2: {
            type: 'v',
            name: 'arr2',
            pos: [3, 2, 4],
            meta: {
              display: 'arr2',
              isDefined: true,
              canReset: true,
              usage: [[3, 2, 4]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Structure>',
                  serialized: 'Array<Structure>',
                  args: [
                    [
                      {
                        display: 'Structure',
                        name: 'Structure',
                        serialized: 'Structure',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
          bad: {
            type: 'v',
            name: 'bad',
            pos: [5, 2, 3],
            meta: {
              display: 'bad',
              isDefined: true,
              canReset: true,
              usage: [[5, 2, 3]],
              docs: '',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<any>',
                  serialized: 'Array<any>',
                  args: [
                    [
                      {
                        display: 'any',
                        name: 'any',
                        serialized: 'any',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
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
        name: 'array_creation',
        pos: [0, 4, 14],
        range: { start: [0, 0, 4], end: [6, 0, 3] },
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
