import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find definitions for properties`, () => {
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
    const position_0: Position = { line: 64, character: 14 };

    // define expected token we extract
    const expectedFound_0 = {
      direction: 'bidirectional',
      display: 'prop1',
      code: true,
      source: 'user',
      docs: '',
      type: [{ display: 'any', name: 'any', args: [], meta: {} }],
      pos: [32, 22, 6],
      name: 'prop1',
      class: [{ name: 'NYStruct0', display: 'NYStruct0', args: [], meta: {} }],
      globalType: 's',
      globalName: 'nystruct0',
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
    const position_1: Position = { line: 67, character: 14 };

    // define expected token we extract
    const expectedFound_1 = {
      direction: 'bidirectional',
      display: 'prop2',
      code: true,
      source: 'user',
      docs: '',
      type: [{ display: 'any', name: 'any', args: [], meta: {} }],
      pos: [34, 41, 6],
      name: 'prop2',
      class: [{ name: 'NYStruct', display: 'NYStruct', args: [], meta: {} }],
      globalType: 's',
      globalName: 'nystruct',
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
    const position_0: Position = { line: 70, character: 14 };

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
