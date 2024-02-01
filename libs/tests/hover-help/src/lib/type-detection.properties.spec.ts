import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provide hover help for`, () => {
  it(`[auto generated] first level properties that exist`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/types.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 16, character: 16 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type ENVIRaster.metadata = ENVIRasterMetadata',
      '```',
      '',
      'This property retrieves a reference to the [ENVIRasterMetadata](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIRasterMetadata/ENVIRasterMetaData.htm%22%7D) object. If METADATA and INHERITS\\_FROM are both set, the new raster will have the union of both sets of metadata. The METADATA values override those from INHERITS\\_FROM if there is a conflict.',
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

  it(`[auto generated] secondary properties that exist`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/types.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 16, character: 23 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type ENVIRasterMetadata.count = Long',
      '```',
      '',
      'A long integer that represents the number of available tags.',
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

  it(`[auto generated] first level properties that dont exist`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/types.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 19, character: 16 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type Structure.incorrect = any',
      '```',
      '',
      'Unknown property',
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

  it(`[auto generated] secondary properties that dont exist`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/types.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 22, character: 25 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type Structure.wrong = any',
      '```',
      '',
      'Unknown property',
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

  it(`[auto generated] static properties that exist`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/types.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 25, character: 16 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type ENVI.ui = ENVIUI | Null',
      '```',
      '',
      'This property retrieves a reference to the [ENVIUI](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/envi/Content/ExtendCustomize/ENVIUI/ENVIUI.htm%22%7D) object.',
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

  it(`[auto generated] static properties that dont exist`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/types.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 28, character: 22 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type Structure.why_so_serious = any',
      '```',
      '',
      'Unknown property',
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
