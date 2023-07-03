import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly provide hover help for keywords`, () => {
  it(`[auto generated] in method calls`, async () => {
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
    const filepath = GetExtensionPath('idl/test/hover-help/types_keywords.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 10, character: 27 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type sub_rect = Array<Number>',
      '```',
      '',
      'Set this keyword to a four-element array expressing the spatial range (in pixels) of the data. The array is of the form \\[_x1_, _y1_, _x2_, _y2_\\], where:',
      '',
      '_x1_ \\= First pixel of the columns dimension',
      '',
      '_y1_ \\= First pixel of the rows dimension',
      '',
      '_x2_ \\= Last pixel of the columns dimension',
      '',
      '_y2_ \\= Last pixel of the rows dimension',
      '',
      'Pixel coordinates are zero-based.',
      '',
      'If you want to use a subset of the input data for image processing, consider using the [ENVISubsetRaster](https://www.nv5geospatialsoftware.com/docs/ENVISubsetRaster.html) function instead.',
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
    const position_1: Position = { line: 12, character: 19 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      'type bands = Array<any>',
      '```',
      '',
      'An array of integer indices that define the spectral subset to be set. The indices are sequential and zero-based (Band 1 = 0, Band 2 = 1, and so on). By default, all bands are included.',
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
    const position_2: Position = { line: 12, character: 27 };

    // define expected token we extract
    const expectedFound_2: string[] = [
      'A variable of type _Undefined_. The value of !NULL can be:',
      '',
      '* Assigned to another variable: `var = !NULL`',
      '* Used to test whether a variable exists: `IF var NE !NULL THEN...`',
      '',
      'In addition, variables with the value !NULL are ignored when added to an array. That is:',
      '',
      '```idl',
      '  array = [1, !null, 2, !null, 3]',
      '```',
      '',
      'is the same as',
      '',
      '```idl',
      '  array = [1, 2, 3]',
      '```',
      '',
      'See [The Null Variable](https://www.nv5geospatialsoftware.com/docs/The_Null_Variable.html#constants_818058343_695602) for additional information.',
      '',
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
