import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find definitions for keywords`, () => {
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
    const position_0: Position = { line: 52, character: 7 };

    // define expected token we extract
    const expectedFound_0 = {
      docs: '',
      private: false,
      source: 'internal',
      type: [{ name: 'any', display: 'any', args: [], meta: {} }],
      direction: 'bidirectional',
      req: false,
      display: 'kw',
      code: true,
      pos: [25, 10, 2],
      name: 'kw',
      globalType: 'p',
      globalName: 'pro3',
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
    const position_0: Position = { line: 52, character: 16 };

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

    // define position
    const position_1: Position = { line: 55, character: 8 };

    // define expected token we extract
    const expectedFound_1 = undefined;

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

  it(`[auto generated] real binary`, async () => {
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
    const position_0: Position = { line: 52, character: 30 };

    // define expected token we extract
    const expectedFound_0 = {
      docs: '',
      private: false,
      source: 'internal',
      type: [{ name: 'any', display: 'any', args: [], meta: {} }],
      direction: 'bidirectional',
      req: false,
      display: 'kwb',
      code: true,
      pos: [25, 19, 3],
      name: 'kwb',
      globalType: 'p',
      globalName: 'pro3',
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

  it(`[auto generated] fake binary`, async () => {
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
    const position_0: Position = { line: 52, character: 37 };

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
