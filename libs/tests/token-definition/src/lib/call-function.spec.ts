import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find function definitions`, () => {
  it(`[auto generated] for call_function`, async () => {
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
    const filepath = GetExtensionPath('idl/test/token-def/call_function.pro');

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/token-def/call_function.pro')
    );

    // define position
    const position_0: Position = { line: 8, character: 18 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'f',
      name: 'go_to_def_call_function',
      pos: [0, 9, 23],
      meta: {
        source: 'user',
        args: {},
        docs: '\n```idl\n;+\n; :Returns: any\n;+\nresult = go_to_def_call_function()\n```\n',
        docsLookup: {},
        display: 'go_to_def_call_function',
        kws: {},
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
});
