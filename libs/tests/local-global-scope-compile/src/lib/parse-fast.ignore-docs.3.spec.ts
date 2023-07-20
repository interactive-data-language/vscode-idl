import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify fast parsing ignores docs`, () => {
  it(`[auto generated] for functions`, async () => {
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
      `;   arg1: in, required, envitask`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg2: in, required, idltask`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg3: in, required, ENVITask<buildmosaicraster> | ENVITask<SubsetRaster>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg4: in, required, IDLTask<S3_Download>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;   arg5: in, required, ENVITask<BuildMosaicRaster | SubsetRaster>`,
      `;     Placeholder docs for argument, keyword, or property`,
      `;`,
      `;-`,
      `function myfunc, arg1, arg2, arg3, arg4, arg5, KW1 = kw1`,
      `  compile_opt idl3`,
      `  return, 42`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode('not-real', code, {
      postProcess: true,
      full: false,
    });

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {
        myfunc: {
          kw1: {
            type: 'v',
            name: 'kw1',
            pos: [14, 53, 3],
            meta: {
              display: 'kw1',
              isDefined: true,
              usage: [[14, 53, 3]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg1: {
            type: 'v',
            name: 'arg1',
            pos: [14, 17, 4],
            meta: {
              display: 'arg1',
              isDefined: true,
              usage: [[14, 17, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg2: {
            type: 'v',
            name: 'arg2',
            pos: [14, 23, 4],
            meta: {
              display: 'arg2',
              isDefined: true,
              usage: [[14, 23, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg3: {
            type: 'v',
            name: 'arg3',
            pos: [14, 29, 4],
            meta: {
              display: 'arg3',
              isDefined: true,
              usage: [[14, 29, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg4: {
            type: 'v',
            name: 'arg4',
            pos: [14, 35, 4],
            meta: {
              display: 'arg4',
              isDefined: true,
              usage: [[14, 35, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          arg5: {
            type: 'v',
            name: 'arg5',
            pos: [14, 41, 4],
            meta: {
              display: 'arg5',
              isDefined: true,
              usage: [[14, 41, 4]],
              docs: '',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
        type: 'f',
        name: 'myfunc',
        pos: [14, 9, 6],
        meta: {
          source: 'user',
          args: {
            arg1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg1',
              code: true,
              pos: [14, 17, 4],
            },
            arg2: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg2',
              code: true,
              pos: [14, 23, 4],
            },
            arg3: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg3',
              code: true,
              pos: [14, 29, 4],
            },
            arg4: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg4',
              code: true,
              pos: [14, 35, 4],
            },
            arg5: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: true,
              display: 'arg5',
              code: true,
              pos: [14, 41, 4],
            },
          },
          docs: '#### myfunc\n\n```idl\nresult = myfunc( arg1, arg2, arg3, arg4, arg5, [ KW1 = any ])\n```\n\n#### Arguments\n\n- **arg1**: bidirectional, required, any\n\n  \n\n- **arg2**: bidirectional, required, any\n\n  \n\n- **arg3**: bidirectional, required, any\n\n  \n\n- **arg4**: bidirectional, required, any\n\n  \n\n- **arg5**: bidirectional, required, any\n\n  \n\n\n#### Keywords\n\n- **KW1**: bidirectional, optional, any\n\n    \n\n',
          docsLookup: {},
          display: 'myfunc',
          kws: {
            kw1: {
              docs: '',
              private: false,
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              direction: 'bidirectional',
              req: false,
              display: 'KW1',
              code: true,
              pos: [14, 47, 3],
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
      func: { myfunc: [] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
