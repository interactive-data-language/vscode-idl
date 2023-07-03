import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Provide hover help for`, () => {
  it(`[auto generated] anonymous structures`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/structures.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 8, character: 10 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type a = Structure',
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
    const position_1: Position = { line: 9, character: 12 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      "var Structure.a: String = 'string'",
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

    // define position
    const position_2: Position = { line: 10, character: 14 };

    // define expected token we extract
    const expectedFound_2: string[] = [
      '```typescript',
      'type IDL_Variable.length = Number',
      '```',
      '',
      'The number of elements in the variable.',
    ];

    // get hover help
    const hoverHelp_2 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_2
    );

    // verify results
    expect(expectedFound_2).toEqual(
      ((hoverHelp_2?.contents as string) || '').split(/\r?\n/gim)
    );

    // define position
    const position_3: Position = { line: 11, character: 12 };

    // define expected token we extract
    const expectedFound_3: string[] = [
      '```typescript',
      'type Structure.invalid = any',
      '```',
      '',
      'Unknown property',
    ];

    // get hover help
    const hoverHelp_3 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_3
    );

    // verify results
    expect(expectedFound_3).toEqual(
      ((hoverHelp_3?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
