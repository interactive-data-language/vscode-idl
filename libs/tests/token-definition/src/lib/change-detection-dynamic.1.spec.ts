import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly get routine definition for`, () => {
  it(`[auto generated] change detection with proper type`, async () => {
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
    const filepath = GetExtensionPath(
      'idl/test/change-detection/dynamic/leap4.pro'
    );

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/change-detection/dynamic/leap4.pro')
    );

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/change-detection/dynamic/leap2.pro')
    );

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/change-detection/dynamic/leap.pro')
    );

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/change-detection/dynamic/leap3.pro')
    );

    // define position
    const position_0: Position = { line: 8, character: 11 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'f',
      name: 'leap4',
      pos: [0, 9, 5],
      range: { start: [0, 0, 9], end: [4, 0, 3] },
      meta: {
        source: 'user',
        args: {},
        docs: '\n```idl\n;+\n; :Returns: Plot\n;+\nresult = leap4()\n```\n',
        docsLookup: {},
        display: 'leap4',
        kws: {},
        private: false,
        returns: [{ name: 'Plot', display: 'Plot', args: [], meta: {} }],
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
