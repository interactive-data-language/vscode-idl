import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find definitions for function methods`, () => {
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
    const position_0: Position = { line: 82, character: 17 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'fm',
      name: 'nystruct0::funcmethod1',
      pos: [15, 9, 22],
      meta: {
        className: 'nystruct0',
        method: 'funcmethod1',
        source: 'user',
        args: {},
        docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = NYStruct0.FuncMethod1( $\n  kw = value $\n  kwb = value)\n```\n\n\n#### Keywords\n\n- **kw**: bidirectional, optional, any\n\n    \n\n- **kwb**: bidirectional, optional, any\n\n    \n\n',
        docsLookup: {},
        display: 'NYStruct0::FuncMethod1',
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
            pos: [15, 33, 2],
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
            pos: [15, 42, 3],
          },
        },
        private: false,
        returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
    const position_1: Position = { line: 85, character: 14 };

    // define expected token we extract
    const expectedFound_1 = {
      type: 'fm',
      name: 'nystruct::funcmethod2',
      pos: [20, 9, 21],
      meta: {
        className: 'nystruct',
        method: 'funcmethod2',
        source: 'user',
        args: {},
        docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = NYStruct.FuncMethod2( $\n  kw = value $\n  kwb = value)\n```\n\n\n#### Keywords\n\n- **kw**: bidirectional, optional, any\n\n    \n\n- **kwb**: bidirectional, optional, any\n\n    \n\n',
        docsLookup: {},
        display: 'NYStruct::FuncMethod2',
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
            pos: [20, 32, 2],
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
            pos: [20, 41, 3],
          },
        },
        private: false,
        returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
    const position_0: Position = { line: 88, character: 19 };

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
