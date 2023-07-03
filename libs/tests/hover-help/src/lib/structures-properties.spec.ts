import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Provide hover help for`, () => {
  it(`[auto generated] named structure properties`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/hover-help/structures2.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 13, character: 24 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type NYStruct.prop1 = Long',
      '```',
      '',
      'Favorite property',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_1: Position = { line: 13, character: 34 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      'type NYStruct.prop2 = String',
      '```',
      '',
      'Second favorite property',
    ];

    // get hover help
    const hoverHelp_1 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_1
    );

    // verify results
    expect(expectedFound_1).toEqual(
      ((hoverHelp_1?.contents as string) || '').split(/\r?\n/gim)
    );
  });

  it(`[auto generated] anonymous structure properties`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/hover-help/structures2.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 15, character: 9 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      "var Structure.prop: String = 'string'",
      '```',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_1: Position = { line: 15, character: 25 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      'type Structure.val = Long',
      '```',
    ];

    // get hover help
    const hoverHelp_1 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_1
    );

    // verify results
    expect(expectedFound_1).toEqual(
      ((hoverHelp_1?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
