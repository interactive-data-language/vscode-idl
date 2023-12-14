import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Task auto complete`, () => {
  it(`[auto generated] as regression for task type parsing`, async () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/tasks.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 13, character: 4 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'aborted',
        insertText: 'aborted',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLTask',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean that returns `true` if the task was aborted during Execute. Not all tasks support aborting; in these cases the property always returns `false`. ',
        },
      },
      {
        label: 'description',
        insertText: 'description',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLTask',
        documentation: {
          kind: 'markdown',
          value:
            'Text describing the task. In the task template this is defined with the `"description"` key.',
        },
      },
      {
        label: 'display_name',
        insertText: 'display_name',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLTask',
        documentation: {
          kind: 'markdown',
          value:
            'The name of the task as it appears in the user interface. In the task template this is defined with the `"display_name"` key.',
        },
      },
      {
        label: 'name',
        insertText: 'name',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLTask',
        documentation: {
          kind: 'markdown',
          value:
            'The name of the task. In the task template this is defined with the `"name"` key.',
        },
      },
      {
        label: 'revision',
        insertText: 'revision',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLTask',
        documentation: {
          kind: 'markdown',
          value:
            'A string with the **semantic** revision number of the task. The `"revision"` key is for development purposes only. The revision number does not affect which task file is loaded.',
        },
      },
      {
        label: 'tags',
        insertText: 'tags',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLTask',
        documentation: {
          kind: 'markdown',
          value:
            'A scalar string or an array of strings that help categorize the task. It can be empty with a value of !NULL. In the task template this is defined with the `"tags"` key.',
        },
      },
      {
        label: 'IDLTask::addParameter',
        insertText: 'addParameter',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'IDLTask::execute',
        insertText: 'execute',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'IDLTask::removeParameter',
        insertText: 'removeParameter',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'IDLTask::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDLTask::parameter()',
        insertText: 'parameter()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDLTask::parameterNames()',
        insertText: 'parameterNames()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
    // define position
    const position_1: Position = { line: 14, character: 4 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'aborted',
        insertText: 'aborted',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A boolean that returns `true` if the task was aborted. Not all tasks support aborting; in these cases the property always returns `false`.',
        },
      },
      {
        label: 'commute_on_downsample',
        insertText: 'commute_on_downsample',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A string that defines whether the result of running the ENVITask first, then down-sampling the output raster, matches the result of down-sampling the input raster(s) first before running the ENVITask.\n\nAn ENVITask developer can use the scripts provided in More Examples below to determine the COMMUTE\\_ON\\_DOWNSAMPLE property value when creating an ENVITask.\n\nValid values are:\n\n`Yes:` Downsample the input raster(s) first, and then run the task. The resulting output raster matches the result if the task is run first, then downsample the output raster.\n\n`Approximate:` The two results look close to each other, but do not exactly match.\n\n`No:` The two results are significantly different.\n\n`Unknown:` The property value is unknown.',
        },
      },
      {
        label: 'commute_on_subset',
        insertText: 'commute_on_subset',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A string that defines whether the result of running the ENVITask first, then subsetting the output raster, matches the result of subsetting the input raster(s) first before running the ENVITask.\n\nAn ENVITask developer can use the scripts provided in More Examples below to determine the COMMUTE\\_ON\\_SUBSET property value when creating an ENVITask.\n\nValid values are:\n\n* `Yes:` Subset the input raster(s) first, and then run the task. The resulting output raster matches the result if the task is run first, then subset the output raster.\n* `Approximate:` The two results look close to each other, but do not exactly match.\n* `No:` The two results are significantly different.\n* `Unknown:` The property value is unknown.',
        },
      },
      {
        label: 'description',
        insertText: 'description',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: { kind: 'markdown', value: 'Text describing the task.' },
      },
      {
        label: 'display_name',
        insertText: 'display_name',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value: 'The name of the task as it appears in the user interface.',
        },
      },
      {
        label: 'name',
        insertText: 'name',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: { kind: 'markdown', value: 'The name of the task.' },
      },
      {
        label: 'revision',
        insertText: 'revision',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A string with the semantic revision number of the task. As the task definition evolves over time, the changes will affect how the revision number is incremented, according to [semantic versioning](https://www.nv5geospatialsoftware.com/docs/ENVI.html#API_VERS) rules.',
        },
      },
      {
        label: 'source_uri',
        insertText: 'source_uri',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'The path and filename of the `.task` file that defines the task. If the task was created programmatically using OBJ\\_NEW, then SOURCE\\_URI will be an empty string.',
        },
      },
      {
        label: 'tags',
        insertText: 'tags',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A scalar string or an array of strings that help categorize the task. It can be empty with a value of !NULL.',
        },
      },
      {
        label: 'ENVITask::addParameter',
        insertText: 'addParameter',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVITask::execute',
        insertText: 'execute',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVITask::removeParameter',
        insertText: 'removeParameter',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVITask::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::parameter()',
        insertText: 'parameter()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::parameterNames()',
        insertText: 'parameterNames()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::validate()',
        insertText: 'validate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1
        )
      ).slice(0, 50)
    );
    // define position
    const position_2: Position = { line: 15, character: 4 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'color_matching_actions',
        insertText: 'color_matching_actions',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            "Set this property to an array of strings that indicates how each element of the INPUT\\_RASTERS array should be treated with regard to color matching: as a reference image, an adjusted image, or no color matching. The number of elements in this array must match the number of input scenes in the INPUT\\_RASTERS array. Valid strings are as follows; these are not case-sensitive.\n\nBy default, the first scene in the INPUT\\_RASTERS array is set to the reference image. All other images are set to `Adjust`.\n\n* `Adjust`: Scenes that will be color-matched to the scene marked as `Reference`.\n* `None`: Scenes that will not be color-matched.\n* `Reference`: The scene whose statistics form the basis of color matching for all scenes marked as `Adjust`. You must set one, and only one, scene to `Reference`.\n\nSuppose that you define an array of input scenes as follows:\n\nscenes = [raster1, raster2, raster3, raster4]\n\nIf you want `raster2` to be the reference image, set this property as follows:\n\nTask.COLOR_MATCHING_ACTIONS = ['Adjust', 'Reference', 'Adjust', 'Adjust']",
        },
      },
      {
        label: 'color_matching_method',
        insertText: 'color_matching_method',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a string that indicates the color matching method to perform.\n\n* `Histogram Matching`: Map discrete greyscale levels from the histogram of the adjusted scenes to the corresponding greyscale levels in the reference scene. This helps to minimize the tonal differences across multiple scenes.\n* `None` (default): Do not perform color matching.',
        },
      },
      {
        label: 'color_matching_statistics',
        insertText: 'color_matching_statistics',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to one of the following strings indicating what parts of the reference and adjusted images are used to compute statistics for color matching, if COLOR\\_MATCHING\\_METHOD is set to `Histogram Matching`. \n\n* `Overlapping Area` (default): Compute statistics from areas where the reference image overlaps with adjusted images. If there is at least 10% overlap between scenes, histogram matching based on statistics from overlapping areas performs better than statistics from the entire scene. If there are no overlapping regions, then this property will be set to `Entire Scene`.\n* `Entire Scene`: Compute statistics from the entire image.',
        },
      },
      {
        label: 'data_ignore_value',
        insertText: 'data_ignore_value',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            "Set this property to a pixel value that will be used to fill areas where no valid data appear in the output raster. The following rules apply:\n\n* The value must be within the range of the input scenes' data type (e.g., floating-point, byte, integer, etc.)\n* For scenes that are in [ENVI raster format](https://www.nv5geospatialsoftware.com/docs/ENVIImageFiles.html): if all scenes have the same data ignore value defined in their associated headers, that value will be the default output data ignore value.\n* For mosaics exported to ENVI raster format, the data ignore value is written to the `data ignore value` field in the associated header file. If you do not set a data ignore value, this field will not be added to the header file.\n* When the input scenes have a floating-point or double-precision floating-point data type, be sure to specify a double-precision value (for example, 100D).\n\nYou can set the data ignore value to an NaN (not a number) value as follows:\n\n```idl\n  Task.data_ignore_value = !values.f_nan\n```",
        },
      },
      {
        label: 'feathering_distance',
        insertText: 'feathering_distance',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to an array of integers indicating the number of pixels used for edge or seamline feathering for each INPUT\\_RASTER. The number of elements in this array must match the number of input scenes in the INPUT\\_RASTER array. Set values to 1 or greater.',
        },
      },
      {
        label: 'feathering_method',
        insertText: 'feathering_method',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to one of the following strings that indicates the feathering method to use:\n\n* `None`: (default) No feathering.\n* `Edge`: Edge feathering blends the pixels inside of each footprint boundary with underlying scenes that are within the FEATHERING\\_DISTANCE value that you set.\n* `Seamline`: Seamline feathering blends the pixels on both sides of an auto-generated seamline with the underlying scenes.\n\nIf you set this property to a value other than `None`, you must also specify FEATHERING\\_DISTANCE. If you set this property to `Seamline`, you must also set the SEAMLINE\\_METHOD property.',
        },
      },
      {
        label: 'input_rasters',
        insertText: 'input_rasters',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value: 'Specify an array of rasters to mosaic.',
        },
      },
      {
        label: 'output_raster',
        insertText: 'output_raster',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            'This is a reference to the output raster of filetype ENVI.\n\nIf you use the [Export method](https://www.nv5geospatialsoftware.com/docs/ENVIRaster__Export.html) to save a multi-band mosaic to disk, the output mosaic will have a band-interleaved-by-pixel (BIP) interleave format. This ensures optimal performance during the export step.',
        },
      },
      {
        label: 'output_raster_uri',
        insertText: 'output_raster_uri',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            'Specify a string with the fully qualified filename and path to export the associated OUTPUT\\_RASTER.\n\n* If you set this property to an asterisk symbol (\\*), the output raster will be virtual and not written to disk.\n* If you do not specify this property, or set it to an exclamation symbol (!), a temporary file will be created.',
        },
      },
      {
        label: 'resampling',
        insertText: 'resampling',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            'Specify the resampling method:\n\n* `Nearest Neighbor`: (default) Uses the nearest pixel without any interpolation to create the image.\n* `Bilinear`: Performs a linear interpolation using four pixels to resample the image.\n* `Cubic`: Uses 16 pixels to approximate the sinc function using cubic polynomials to resample the image. Cubic convolution resampling is significantly slower than the other methods.',
        },
      },
      {
        label: 'seamline_method',
        insertText: 'seamline_method',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVIBuildMosaicRasterTask',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a string that indicates the method used to automatically generate seamlines:\n\n* `Geometry`: Seamline generation that is based on the use of seamline networks by area Voroni diagrams with overlap (Pan et al., 2009). See [Add Seamlines](https://www.nv5geospatialsoftware.com/docs/MosaicSeamless.html#Add) for more information.\n* `None`: (default) No seamline generation.\n\nIf SEAMLINE\\_METHOD is set to `Geometry`, then FEATHERING\\_METHOD must be set to `Seamline`.\n\n**Reference**: Pan, J., M. Wang, D. Li, and J. Li. "Automatic Generation of Seamline Network Using the Area Voronoi Diagram with Overlap." _IEEE Transactions on Geoscience and Remote Sensing_ 47, No. 6 (2009): 1737-174.',
        },
      },
      {
        label: 'aborted',
        insertText: 'aborted',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A boolean that returns `true` if the task was aborted. Not all tasks support aborting; in these cases the property always returns `false`.',
        },
      },
      {
        label: 'commute_on_downsample',
        insertText: 'commute_on_downsample',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A string that defines whether the result of running the ENVITask first, then down-sampling the output raster, matches the result of down-sampling the input raster(s) first before running the ENVITask.\n\nAn ENVITask developer can use the scripts provided in More Examples below to determine the COMMUTE\\_ON\\_DOWNSAMPLE property value when creating an ENVITask.\n\nValid values are:\n\n`Yes:` Downsample the input raster(s) first, and then run the task. The resulting output raster matches the result if the task is run first, then downsample the output raster.\n\n`Approximate:` The two results look close to each other, but do not exactly match.\n\n`No:` The two results are significantly different.\n\n`Unknown:` The property value is unknown.',
        },
      },
      {
        label: 'commute_on_subset',
        insertText: 'commute_on_subset',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A string that defines whether the result of running the ENVITask first, then subsetting the output raster, matches the result of subsetting the input raster(s) first before running the ENVITask.\n\nAn ENVITask developer can use the scripts provided in More Examples below to determine the COMMUTE\\_ON\\_SUBSET property value when creating an ENVITask.\n\nValid values are:\n\n* `Yes:` Subset the input raster(s) first, and then run the task. The resulting output raster matches the result if the task is run first, then subset the output raster.\n* `Approximate:` The two results look close to each other, but do not exactly match.\n* `No:` The two results are significantly different.\n* `Unknown:` The property value is unknown.',
        },
      },
      {
        label: 'description',
        insertText: 'description',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: { kind: 'markdown', value: 'Text describing the task.' },
      },
      {
        label: 'display_name',
        insertText: 'display_name',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value: 'The name of the task as it appears in the user interface.',
        },
      },
      {
        label: 'name',
        insertText: 'name',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: { kind: 'markdown', value: 'The name of the task.' },
      },
      {
        label: 'revision',
        insertText: 'revision',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A string with the semantic revision number of the task. As the task definition evolves over time, the changes will affect how the revision number is incremented, according to [semantic versioning](https://www.nv5geospatialsoftware.com/docs/ENVI.html#API_VERS) rules.',
        },
      },
      {
        label: 'source_uri',
        insertText: 'source_uri',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'The path and filename of the `.task` file that defines the task. If the task was created programmatically using OBJ\\_NEW, then SOURCE\\_URI will be an empty string.',
        },
      },
      {
        label: 'tags',
        insertText: 'tags',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVITask',
        documentation: {
          kind: 'markdown',
          value:
            'A scalar string or an array of strings that help categorize the task. It can be empty with a value of !NULL.',
        },
      },
      {
        label: 'ENVITask::addParameter',
        insertText: 'addParameter',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVITask::execute',
        insertText: 'execute',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVITask::removeParameter',
        insertText: 'removeParameter',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'ENVITask::dehydrate()',
        insertText: 'dehydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::hydrate()',
        insertText: 'hydrate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::parameter()',
        insertText: 'parameter()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::parameterNames()',
        insertText: 'parameterNames()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVITask::validate()',
        insertText: 'validate()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_2).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_2
        )
      ).slice(0, 50)
    );
  });
});
