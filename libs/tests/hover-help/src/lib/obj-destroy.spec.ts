import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find find definition from obj destroy`, () => {
  it(`[auto generated] case 1`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/obj_destroy.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 23, character: 8 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22pm%22,%22name%22:%22TestClass::Cleanup%22%7D)',
      '',
      '```idl',
      'TestClass.Cleanup, $',
      '  keyword = value',
      '```',
      '',
      '',
      '#### Keywords',
      '',
      '- **keyword**: bidirectional, optional, any',
      '',
      '    ',
      '',
      '',
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
  });

  it(`[auto generated] keywords`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/obj_destroy.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 23, character: 24 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type keyword = any',
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
  });
});
