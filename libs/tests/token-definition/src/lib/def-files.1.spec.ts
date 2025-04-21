import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly get routine definition for`, () => {
  it(`[auto generated] for routine def files`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify reference filepath
    const filepath = GetExtensionPath('idl/test/token-def/from_def.pro');

    // parse file for tests
    await index.indexFile(GetExtensionPath('idl/test/token-def/from_def.pro'));

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/hover-help/testroutine.pro.def')
    );

    // define position
    const position_0: Position = { line: 2, character: 7 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'p',
      name: 'testroutine',
      pos: [25, 4, 11],
      meta: {
        source: 'user',
        args: {
          arg1: {
            docs: 'Placeholder docs for argument, keyword, or property',
            direction: 'bidirectional',
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            private: false,
            req: true,
            display: 'arg1',
            code: true,
            pos: [25, 17, 4],
          },
          arg2: {
            docs: 'Placeholder docs for argument, keyword, or property',
            direction: 'bidirectional',
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            private: false,
            req: true,
            display: 'arg2',
            code: true,
            pos: [25, 23, 4],
          },
          arg3: {
            docs: 'Placeholder docs for argument, keyword, or property',
            direction: 'bidirectional',
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            private: false,
            req: true,
            display: 'arg3',
            code: true,
            pos: [25, 29, 4],
          },
          arg4: {
            docs: 'Placeholder docs for argument, keyword, or property',
            direction: 'bidirectional',
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            private: false,
            req: true,
            display: 'arg4',
            code: true,
            pos: [25, 35, 4],
          },
        },
        docs: '\n```idl\ntestroutine, arg1, arg2, arg3, arg4, $\n  kw1 = value, $\n  kw2 = value\n```\n\nreference to our super cool and awesome plot\nsample if statement\nsample for loop\nsample ENVI routine\nformatting matches whatever you type as a user\n\n\n#### Arguments\n\n- **arg1**: bidirectional, required, any\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg2**: bidirectional, required, any\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg3**: bidirectional, required, any\n\n  Placeholder docs for argument, keyword, or property\n\n- **arg4**: bidirectional, required, any\n\n  Placeholder docs for argument, keyword, or property\n\n\n\n#### Keywords\n\n- **kw1**: bidirectional, optional, any\n\n    Placeholder docs for argument, keyword, or property\n\n- **kw2**: bidirectional, optional, any\n\n    Placeholder docs for argument, keyword, or property\n\n',
        docsLookup: {
          default:
            'reference to our super cool and awesome plot\nsample if statement\nsample for loop\nsample ENVI routine\nformatting matches whatever you type as a user',
        },
        display: 'testroutine',
        kws: {
          kw1: {
            docs: 'Placeholder docs for argument, keyword, or property',
            direction: 'bidirectional',
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            private: false,
            req: false,
            display: 'kw1',
            code: true,
            pos: [25, 41, 3],
          },
          kw2: {
            docs: 'Placeholder docs for argument, keyword, or property',
            direction: 'bidirectional',
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            private: false,
            req: false,
            display: 'kw2',
            code: true,
            pos: [25, 52, 3],
          },
        },
        private: false,
        struct: [],
      },
    };

    // get expected and remove file
    const found_0 = await index.getTokenDef(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );
    if (found_0 !== undefined) {
      delete found_0.file;
    }

    // verify results
    expect(expectedFound_0).toEqual(found_0);
  });
});
