import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find definitions in structures`, () => {
  it(`[auto generated] real variables`, async () => {
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
    const position_0: Position = { line: 46, character: 9 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'v',
      name: 'st',
      pos: [40, 0, 2],
      meta: {
        display: 'st',
        isDefined: true,
        usage: [
          [40, 0, 2],
          [46, 8, 2],
          [64, 8, 2],
          [67, 8, 2],
          [70, 8, 2],
          [73, 0, 2],
          [76, 0, 2],
          [79, 0, 2],
          [82, 8, 2],
          [85, 8, 2],
          [88, 8, 2],
        ],
        docs: '',
        source: 'user',
        type: [{ name: 'NYStruct', display: 'NYStruct', args: [], meta: {} }],
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

  it(`[auto generated] fake variables`, async () => {
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
    const position_0: Position = { line: 49, character: 9 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'v',
      name: 'st3',
      pos: [49, 8, 3],
      meta: {
        display: 'st3',
        isDefined: false,
        usage: [[49, 8, 3]],
        docs: '',
        source: 'user',
        type: [{ display: 'any', name: 'any', args: [], meta: {} }],
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
