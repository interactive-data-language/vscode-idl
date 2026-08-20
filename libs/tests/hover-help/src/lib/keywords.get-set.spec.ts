import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provide hover help for`, () => {
  it(`[auto generated] keywords in get/set`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // specify filepath
    const filepath = GetExtensionPath(
      'idl/test/auto-complete/get_set_methods.pro',
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 4, character: 23 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```idl',
      'kw entity_type: Long',
      '```',
      '',
      'An integer representing the entity type code for the entities contained in the Shapefile object. Returns -1 if unknown. When setting, specifies the entity type for a new Shapefile.',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0,
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim),
    );

    // define position
    const position_1: Position = { line: 5, character: 23 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```idl',
      'kw entity_type: Long',
      '```',
      '',
      'An integer representing the entity type code for the entities contained in the Shapefile object. Returns -1 if unknown. When setting, specifies the entity type for a new Shapefile.',
    ];

    // get hover help
    const hoverHelp_1 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_1,
    );

    // verify results
    expect(expectedFound_1).toEqual(
      ((hoverHelp_1?.contents as string) || '').split(/\r?\n/gim),
    );
  });
});
