import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Task type hover help`, () => {
  it(`[auto generated] as regression for task type parsing and serialization`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/tasks.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 13, character: 14 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type IDLTask<any>.name = String',
      '```',
      '',
      'The name of the task. In the task template this is defined with the `"name"` key.',
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
    const position_1: Position = { line: 14, character: 14 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      'type ENVITask<any>.name = String',
      '```',
      '',
      'The name of the task.',
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
    const position_2: Position = { line: 15, character: 14 };

    // define expected token we extract
    const expectedFound_2: string[] = [
      '```typescript',
      'type ENVITask<BuildMosaicRaster>.input_rasters = Array<ENVIRaster>',
      '```',
      '',
      'Specify an array of rasters to mosaic.',
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
  });
});
