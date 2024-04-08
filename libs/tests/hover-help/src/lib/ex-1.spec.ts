import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly identifies search terms from syntax tree`, () => {
  it(`[auto generated] extract correct tokens and handle undefined`, async () => {
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
    const filepath = GetExtensionPath(
      'idl/test/hover-help/awesomerasterintersection.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 87, character: 10 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22p%22,%22name%22:%22awesomeRasterIntersection%22%7D)',
      '',
      '```idl',
      'awesomeRasterIntersection, $',
      '  /debug, $',
      '  data_ignore_value = value, $',
      '  /generate_pixel_state_mask, $',
      '  input_raster1 = value, $',
      '  input_raster2 = value, $',
      '  output_grid_definition = value, $',
      '  output_raster1_uri = value, $',
      '  output_raster2_uri = value, $',
      '  output_mask_raster_uri = value, $',
      '  resampling = value',
      '```',
      '',
      'Tool for determining the intersection between two rasters based on their',
      'spatial reference and spatial extent. Both rasters will also contain only',
      'the valid pixels from each scene for  analysis. In other words, if a pixel',
      'is `off` in the first image and not the second, it will be turned `off` in',
      'each of the output rasters for consistency. If one of the rasters does not',
      'have a data ignore value, then a pixel state mask is automatically generated',
      'so that you can mask the output rasters if needed.',
      '',
      'The pixel size of the output rasters will be the smallest x and y',
      'pixel size from each raster.',
      '',
      '',
      '#### Keywords',
      '',
      '- **debug**: in, optional, Boolean',
      '',
      '    If set, errors are stopped on.',
      '',
      '- **data_ignore_value**: in, optional, Number',
      '',
      '    If one or both of your input rasters do not have',
      '    a data ignore value metadata item, you can specify',
      '',
      '- **generate_pixel_state_mask**: in, optional, Boolean',
      '',
      '    If set, then an addititonal output raster is created',
      '    that represents which pixels can be processed or not.',
      '    ',
      '    This will automatically be generated if one of the input',
      '    images does not have a data ignore value.',
      '',
      '- **input_raster1**: in, required, ENVIRaster',
      '',
      '    Specify the first raster to use for intersection.',
      '',
      '- **input_raster2**: in, required, ENVIRaster',
      '',
      '    Specify the second raster to use for intersection',
      '',
      '- **output_grid_definition**: out, optional, ENVIGridDefinition',
      '',
      '    Optionally return the ENVIGridDefinition object used to get the intersection',
      '    of the two scenes.',
      '',
      '- **output_raster1_uri**: in, optional, String',
      '',
      '    Optionally specify the fully-qualified filepath',
      '    for the location of the first intersect raster.',
      '',
      '- **output_raster2_uri**: in, optional, String',
      '',
      '    Optionally specify the fully-qualified filepath',
      '    for the location of the second intersect raster.',
      '',
      '- **output_mask_raster_uri**: in, optional, String',
      '',
      '    Optionally specify the fully-qualified filepath',
      '    for the location of the pixel state mask. Only applies',
      '    when `GENERATE_PIXEL_STATE_MASK` is set or one of the',
      '    input rasters does not have a data ignore value.',
      '',
      '- **resampling**: in, optional, String',
      '',
      '    Optionally return the ENVIGridDefinition object used to get the intersection',
      '    of the two scenes. Specify one of the following options:',
      '    - Nearest Neighbor',
      '    - Bilinear',
      '    - Cubic Convolution',
      '',
      '',
      '',
      '### Examples',
      '',
      '```idl',
      ';start ENVI',
      'e = envi(/HEADLESS)',
      '',
      ';make sure we have access to our ENVI tasks',
      'awesomeENVIAlgorithms, /INIT',
      '',
      ';specify two rasters to process',
      'raster1 = e.openRaster(file1)',
      'raster2 = e.openRaster(file2)',
      '',
      ';get our task',
      "task = ENVITask('AwesomeRasterIntersection')",
      'task.INPUT_RASTER1 = raster1',
      'task.INPUT_RASTER2 = raster2',
      'task.execute',
      '',
      ';print our output locations',
      'print, task.OUTPUT_RASTER1_URI',
      'print, task.OUTPUT_RASTER2_URI',
      '```',
      '',
      '### Author',
      '',
      'Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)',
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
    const position_1: Position = { line: 90, character: 7 };

    // define expected token we extract
    const expectedFound_1: string[] = [
      '```typescript',
      'type generate_pixel_state_mask = Boolean',
      '```',
      '',
      'If set, then an addititonal output raster is created',
      'that represents which pixels can be processed or not.',
      '',
      'This will automatically be generated if one of the input',
      'images does not have a data ignore value.',
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
    const position_2: Position = { line: 91, character: 25 };

    // define expected token we extract
    const expectedFound_2: string[] = [
      '```typescript',
      'type input_raster1 = ENVIRaster',
      '```',
      '',
      'Specify the first raster to use for intersection.',
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
