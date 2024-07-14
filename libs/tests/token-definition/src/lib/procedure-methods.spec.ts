import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find definitions for procedure methods`, () => {
  it(`[auto generated] real`, async () => {
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
    const filepath = GetExtensionPath('idl/test/token-def/all_cases.pro');

    // parse file for tests
    await index.indexFile(GetExtensionPath('idl/test/token-def/all_cases.pro'));

    // define position
    const position_0: Position = { line: 73, character: 8 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'pm',
      name: 'nystruct0::promethod1',
      pos: [5, 4, 21],
      meta: {
        className: 'nystruct0',
        method: 'promethod1',
        source: 'user',
        args: {},
        docs: '\n```idl\nNYStruct0.proMethod1, $\n  kw = value, $\n  kwb = value\n```\n\n\n#### Keywords\n\n- **kw**: bidirectional, optional, any\n\n    \n\n- **kwb**: bidirectional, optional, any\n\n    \n\n',
        docsLookup: {},
        display: 'NYStruct0::proMethod1',
        kws: {
          kw: {
            docs: '',
            private: false,
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            req: false,
            display: 'kw',
            code: true,
            pos: [5, 27, 2],
          },
          kwb: {
            docs: '',
            private: false,
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            req: false,
            display: 'kwb',
            code: true,
            pos: [5, 36, 3],
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

    // define position
    const position_1: Position = { line: 76, character: 8 };

    // define expected token we extract
    const expectedFound_1 = {
      type: 'pm',
      name: 'nystruct::promethod2',
      pos: [10, 4, 20],
      meta: {
        className: 'nystruct',
        method: 'promethod2',
        source: 'user',
        args: {},
        docs: '\n```idl\nNYStruct.proMethod2, $\n  kw = value, $\n  kwb = value\n```\n\n\n#### Keywords\n\n- **kw**: bidirectional, optional, any\n\n    \n\n- **kwb**: bidirectional, optional, any\n\n    \n\n',
        docsLookup: {},
        display: 'NYStruct::proMethod2',
        kws: {
          kw: {
            docs: '',
            private: false,
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            req: false,
            display: 'kw',
            code: true,
            pos: [10, 26, 2],
          },
          kwb: {
            docs: '',
            private: false,
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            req: false,
            display: 'kwb',
            code: true,
            pos: [10, 35, 3],
          },
        },
        private: false,
        struct: [],
      },
    };

    // get expected and remove file
    const found_1 = await index.getTokenDef(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_1
    );
    if (found_1 !== undefined) {
      delete found_1.file;
    }

    // verify results
    expect(expectedFound_1).toEqual(found_1);
  });

  it(`[auto generated] fake`, async () => {
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
    const filepath = GetExtensionPath('idl/test/token-def/all_cases.pro');

    // parse file for tests
    await index.indexFile(GetExtensionPath('idl/test/token-def/all_cases.pro'));

    // define position
    const position_0: Position = { line: 79, character: 6 };

    // define expected token we extract
    const expectedFound_0 = undefined;

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
