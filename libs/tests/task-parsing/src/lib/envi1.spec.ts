import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { GetExtensionPath } from '@idl/shared';
import { GlobalTokens } from '@idl/types/core';
import { TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] envi`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/BuildMosaicRaster.task'
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: GlobalTokens = [
      {
        type: 's',
        name: 'envibuildmosaicrastertask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVIBuildMosaicRasterTask',
          source: 'user',
          docs: 'This task builds a mosaic raster based on a set of input rasters.',
          private: false,
          inherits: ['envitask'],
          docsLookup: {},
          props: {
            input_rasters: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'input_rasters',
              docs: 'Specify an array of ENVIRasters that comprise the mosaic raster. Each file must have the same number of bands and the same data type.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ENVIRaster>',
                  args: [
                    [
                      {
                        name: 'ENVIRaster',
                        display: 'ENVIRaster',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
            resampling: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'resampling',
              docs: 'Specify the resampling method. Nearest Neighbor: Uses the nearest pixel without any interpolation. Bilinear: Performs a linear interpolation using four pixels to resample, Cubic Convolution: Uses 16 pixels to approximate the sinc function using cubic polynomials to resample the image.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            color_matching_method: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'color_matching_method',
              docs: 'Set this property to a string that indicates the color matching method to perform. Histogram Matching: Map discrete greyscale levels from the histogram of an adjusted scene to the corresponding greyscale levels in the reference scenes. This helps to minimize the tonal differences across multiple scenes. None: Do not perform color matching.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            color_matching_actions: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'color_matching_actions',
              docs: 'Set this property to an an array of strings that indicates how each element of the INPUT_RASTERS array should be treated with regard to color matching: as a reference image, an adjusted image, or no color matching. The number of elements in this array must match the number of input scenes in the INPUT_RASTERS array. Valid strings are as follows: Adjust: Scenes that will be color-matched to the scene marked as Reference. None: Scenes that will not be color matched. Reference: The scene whose statistics form the basis of color matching for all scenes marked as Adjust. You must set one, and only one, scene to Reference. By default, the first scene in the INPUT_RASTERS array is set to the reference image.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
            },
            color_matching_statistics: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'color_matching_statistics',
              docs: 'Set this property to a string that indicates what parts of the reference and adjusted images are used to compute statistics for color matching, if COLOR_MATCHING_METHOD is set to a value other than None.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            feathering_method: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'feathering_method',
              docs: 'Set this property to a string that indicates the feathering method to use. None: No feathering. Edge: Edge feathering blends the pixels inside of each footprint boundary with the underlying scenes that are within the feathering distance. Seamline: Seaming feathering blends the pixels on both sides of an auto-generated seamline with the underlying scenes. If this property is set to a value other than None, FEATHERING_DISTANCE must also be specified.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            feathering_distance: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'feathering_distance',
              docs: 'Set this property to an array of integers indicating the number of pixels used for edge or seamline feathering for each INPUT_RASTER. The number of elements in this array must match the number of input scenes in the INPUT_RASTERS array. Values must be set to 1 or greater.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<Int>',
                  args: [[{ name: 'Int', display: 'Int', args: [], meta: {} }]],
                  meta: {},
                },
              ],
            },
            seamline_method: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'seamline_method',
              docs: 'Set this property to a string that indicates the method used to automatically generate seamlines. Geometry: Seamline generation that is based on the use of seamline networks by area Voroni diagrams with overlap. None: No Seamline generation. If SEAMLINE_METHOD is set to Geometry, then FEATHERING_METHOD must be set to Seamline.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            data_ignore_value: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'data_ignore_value',
              docs: 'Specify a unique data value for pixels in the output raster that have a non-zero pixel state value (transparent pixels).',
              type: [{ name: 'Double', display: 'Double', args: [], meta: {} }],
            },
            background: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'background',
              docs: 'Same parameter as DATA_IGNORE_VALUE, left here for backward compatibility purposes.',
              type: [{ name: 'Double', display: 'Double', args: [], meta: {} }],
            },
            output_raster_uri: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'output_raster_uri',
              docs: 'Specify a string with the fully qualified filename and path to export the associated OUTPUT_RASTER. If you set this property to an asterisk symbol (*), the output raster will be virtual and not written to disk. If you do not specify this property, or set it to an exclamation symbol (!), a temporary file will be created.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            output_raster: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'output_raster',
              docs: 'This is a reference to the output mosaic raster of filetype ENVI.',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
        },
      },
      {
        type: 'f',
        name: 'envibuildmosaicrastertask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVIBuildMosaicRasterTask',
          source: 'user',
          docs: 'This task builds a mosaic raster based on a set of input rasters.',
          private: false,
          returns: [
            {
              name: 'envibuildmosaicrastertask',
              display: 'ENVITask<buildmosaicraster>',
              args: [
                [
                  {
                    name: 'buildmosaicraster',
                    display: 'buildmosaicraster',
                    args: [],
                    meta: {},
                  },
                ],
              ],
              meta: {},
            },
          ],
          args: {},
          kws: {},
          docsLookup: {},
          struct: [],
        },
      },
    ];

    // verify results
    expect(expected).toEqual(TaskToGlobalToken(task));
  });
});
