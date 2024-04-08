import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find function definitions`, () => {
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
    const position_0: Position = { line: 58, character: 11 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'f',
      name: 'func2',
      pos: [0, 9, 5],
      meta: {
        source: 'user',
        args: {},
        docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = func2( $\n  kw = value $\n  kwb = value)\n```\n\n\n#### Keywords\n\n- **kw**: bidirectional, optional, any\n\n    \n\n- **kwb**: bidirectional, optional, any\n\n    \n\n',
        docsLookup: {},
        display: 'func2',
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
            pos: [0, 16, 2],
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
            pos: [0, 25, 3],
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
    const position_0: Position = { line: 61, character: 11 };

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
