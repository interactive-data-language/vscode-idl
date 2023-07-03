import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly display help for literal types`, () => {
  it(`[auto generated] for numbers and strings`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/literal_types.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 1, character: 2 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'var var1: Long = 5',
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
    const position_1: Position = { line: 2, character: 2 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      "var var2: String = 'awesome sauce'",
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
    const position_2: Position = { line: 3, character: 2 };

    // define expected token we extract
    const expectedFound_2: string[] = [
      '```typescript',
      "var var3: String = 'supercool'",
      '```',
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
    const position_3: Position = { line: 4, character: 2 };

    // define expected token we extract
    const expectedFound_3: string[] = [
      '```typescript',
      "var var4: String = 'stringy'",
      '```',
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

    // define position
    const position_4: Position = { line: 5, character: 2 };

    // define expected token we extract
    const expectedFound_4: string[] = [
      '```typescript',
      'var var5: Float = 1e6',
      '```',
    ];

    // get hover help
    const hoverHelp_4 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_4
    );

    // verify results
    expect(expectedFound_4).toEqual(
      ((hoverHelp_4?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
