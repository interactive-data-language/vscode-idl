import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Complex real world test`, () => {
  it(`[auto generated] with past failure in complex docs`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [
      `;h+`,
      `; Copyright (c) 2018 Harris Geospatial Solutions, Inc.`,
      `; `,
      `; Licensed under MIT. See LICENSE.txt for additional details and information.`,
      `;h-`,
      ``,
      ``,
      ``,
      `;+`,
      `; :Description:`,
      `;    Tool for determining the intersection between two rasters based on their`,
      `;    spatial reference and spatial extent. Both rasters will also contain only`,
      `;    the valid pixels from each scene for  analysis. In other words, if a pixel`,
      `;    is \`off\` in the first image and not the second, it will be turned \`off\` in`,
      `;    each of the output rasters for consistency. If one of the rasters does not`,
      `;    have a data ignore value, then a pixel state mask is automatically generated`,
      `;    so that you can mask the output rasters if needed.`,
      `;    `,
      `;    The pixel size of the output rasters will be the smallest x and y`,
      `;    pixel size from each raster.`,
      `;`,
      `;`,
      `;`,
      `; :Examples:`,
      `;    \`\`\`idl`,
      `;    ;start ENVI`,
      `;    e = envi(/HEADLESS)`,
      `;    `,
      `;    ;make sure we have access to our ENVI tasks`,
      `;    awesomeENVIAlgorithms, /INIT`,
      `;    `,
      `;    ;specify two rasters to process`,
      `;    raster1 = e.openRaster(file1)`,
      `;    raster2 = e.openRaster(file2)`,
      `;    `,
      `;    ;get our task`,
      `;    task = ENVITask('AwesomeRasterIntersection')`,
      `;    task.INPUT_RASTER1 = raster1`,
      `;    task.INPUT_RASTER2 = raster2`,
      `;    task.execute`,
      `;    `,
      `;    ;print our output locations`,
      `;    print, task.OUTPUT_RASTER1_URI`,
      `;    print, task.OUTPUT_RASTER2_URI`,
      `;    \`\`\``,
      `;`,
      `; :Keywords:`,
      `;    DEBUG: in, optional, type=boolean, private`,
      `;      If set, errors are stopped on.`,
      `;      Add a link to make sure it doesn't get picked up`,
      `;        https://en.wikipedia.org/wiki/Haversine_formula`,
      `;        http://en.wikipedia.org/wiki/Haversine_formula`,
      `;        ftp://en.wikipedia.org/wiki/Haversine_formula`,
      `;        s3://en.wikipedia.org/wiki/Haversine_formula`,
      `;        file://en.wikipedia.org/wiki/Haversine_formula`,
      `;    DATA_IGNORE_VALUE: in, optional, type=number`,
      `;      If one or both of your input rasters do not have`,
      `;      a data ignore value metadata item, you can specify`,
      `;    GENERATE_PIXEL_STATE_MASK: in, optional, type=boolean`,
      `;      If set, then an addititonal output raster is created`,
      `;      that represents which pixels can be processed or not.`,
      `;      `,
      `;      This will automatically be generated if one of the input`,
      `;      images does not have a data ignore value.`,
      `;    INPUT_RASTER1: in, required, type=ENVIRaster`,
      `;      Specify the first raster to use for intersection.`,
      `;    INPUT_RASTER2: in, required, type=ENVIRaster`,
      `;      Specify the second raster to use for intersection`,
      `;    OUTPUT_GRID_DEFINITION: out, optional, type=ENVIGridDefinition`,
      `;      Optionally return the ENVIGridDefinition object used to get the intersection`,
      `;      of the two scenes.`,
      `;    OUTPUT_RASTER1_URI: in, optional, type=string`,
      `;      Optionally specify the fully-qualified filepath`,
      `;      for the location of the first intersect raster.`,
      `;    OUTPUT_RASTER2_URI: in, optional, type=string`,
      `;      Optionally specify the fully-qualified filepath`,
      `;      for the location of the second intersect raster.`,
      `;    OUTPUT_MASK_RASTER_URI: in, optional, type=string`,
      `;      Optionally specify the fully-qualified filepath`,
      `;      for the location of the pixel state mask. Only applies`,
      `;      when \`GENERATE_PIXEL_STATE_MASK\` is set or one of the `,
      `;      input rasters does not have a data ignore value.`,
      `;    RESAMPLING: in, optional, type=string`,
      `;      Optionally return the ENVIGridDefinition object used to get the intersection`,
      `;      of the two scenes. Specify one of the following options:`,
      `;      - Nearest Neighbor`,
      `;      - Bilinear`,
      `;      - Cubic Convolution`,
      `;`,
      `; :Tooltip:`,
      `;    Calculates the intersection of two rasters such that both`,
      `;    have the same spatial extent and spatial dimensions`,
      `;`,
      `; :Author: Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)`,
      `;-`,
      `pro awesomeRasterIntersection, $`,
      `  DEBUG = debug,$`,
      `  DATA_IGNORE_VALUE = data_ignore_value,$`,
      `  GENERATE_PIXEL_STATE_MASK = generate_pixel_state_mask,$`,
      `  INPUT_RASTER1 = input_raster1,$`,
      `  INPUT_RASTER2 = input_raster2,$`,
      `  OUTPUT_MASK_RASTER_URI = output_mask_raster_uri,$`,
      `  OUTPUT_GRID_DEFINITION = output_grid_definition,$`,
      `  OUTPUT_RASTER1_URI = output_raster1_uri,$`,
      `  OUTPUT_RASTER2_URI = output_raster2_uri,$`,
      `  RESAMPLING = resampling`,
      `  compile_opt idl2, hidden`,
      `end`,
      ``,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: {
        awesomerasterintersection: {
          debug: {
            type: 'v',
            name: 'debug',
            pos: [96, 10, 5],
            meta: {
              display: 'debug',
              isDefined: true,
              usage: [[96, 10, 5]],
              docs: "If set, errors are stopped on.\nAdd a link to make sure it doesn't get picked up\n  https://en.wikipedia.org/wiki/Haversine_formula\n  http://en.wikipedia.org/wiki/Haversine_formula\n  ftp://en.wikipedia.org/wiki/Haversine_formula\n  s3://en.wikipedia.org/wiki/Haversine_formula\n  file://en.wikipedia.org/wiki/Haversine_formula",
              source: 'user',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
            },
          },
          data_ignore_value: {
            type: 'v',
            name: 'data_ignore_value',
            pos: [97, 22, 17],
            meta: {
              display: 'data_ignore_value',
              isDefined: true,
              usage: [[97, 22, 17]],
              docs: 'If one or both of your input rasters do not have\na data ignore value metadata item, you can specify',
              source: 'user',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
            },
          },
          generate_pixel_state_mask: {
            type: 'v',
            name: 'generate_pixel_state_mask',
            pos: [98, 30, 25],
            meta: {
              display: 'generate_pixel_state_mask',
              isDefined: true,
              usage: [[98, 30, 25]],
              docs: 'If set, then an addititonal output raster is created\nthat represents which pixels can be processed or not.\n\nThis will automatically be generated if one of the input\nimages does not have a data ignore value.',
              source: 'user',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
            },
          },
          input_raster1: {
            type: 'v',
            name: 'input_raster1',
            pos: [99, 18, 13],
            meta: {
              display: 'input_raster1',
              isDefined: true,
              usage: [[99, 18, 13]],
              docs: 'Specify the first raster to use for intersection.',
              source: 'user',
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
          input_raster2: {
            type: 'v',
            name: 'input_raster2',
            pos: [100, 18, 13],
            meta: {
              display: 'input_raster2',
              isDefined: true,
              usage: [[100, 18, 13]],
              docs: 'Specify the second raster to use for intersection',
              source: 'user',
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
          output_mask_raster_uri: {
            type: 'v',
            name: 'output_mask_raster_uri',
            pos: [101, 27, 22],
            meta: {
              display: 'output_mask_raster_uri',
              isDefined: true,
              usage: [[101, 27, 22]],
              docs: 'Optionally specify the fully-qualified filepath\nfor the location of the pixel state mask. Only applies\nwhen `GENERATE_PIXEL_STATE_MASK` is set or one of the\ninput rasters does not have a data ignore value.',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          output_grid_definition: {
            type: 'v',
            name: 'output_grid_definition',
            pos: [102, 27, 22],
            meta: {
              display: 'output_grid_definition',
              isDefined: true,
              usage: [[102, 27, 22]],
              docs: 'Optionally return the ENVIGridDefinition object used to get the intersection\nof the two scenes.',
              source: 'user',
              type: [
                {
                  name: 'ENVIGridDefinition',
                  display: 'ENVIGridDefinition',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          output_raster1_uri: {
            type: 'v',
            name: 'output_raster1_uri',
            pos: [103, 23, 18],
            meta: {
              display: 'output_raster1_uri',
              isDefined: true,
              usage: [[103, 23, 18]],
              docs: 'Optionally specify the fully-qualified filepath\nfor the location of the first intersect raster.',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          output_raster2_uri: {
            type: 'v',
            name: 'output_raster2_uri',
            pos: [104, 23, 18],
            meta: {
              display: 'output_raster2_uri',
              isDefined: true,
              usage: [[104, 23, 18]],
              docs: 'Optionally specify the fully-qualified filepath\nfor the location of the second intersect raster.',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
          resampling: {
            type: 'v',
            name: 'resampling',
            pos: [105, 15, 10],
            meta: {
              display: 'resampling',
              isDefined: true,
              usage: [[105, 15, 10]],
              docs: 'Optionally return the ENVIGridDefinition object used to get the intersection\nof the two scenes. Specify one of the following options:\n- Nearest Neighbor\n- Bilinear\n- Cubic Convolution',
              source: 'user',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
          },
        },
      },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'awesomerasterintersection',
        pos: [95, 4, 25],
        meta: {
          source: 'user',
          args: {},
          docs: "\n```idl\nawesomeRasterIntersection, $\n [ /DEBUG ], $\n [ DATA_IGNORE_VALUE = Number ], $\n [ /GENERATE_PIXEL_STATE_MASK ], $\n INPUT_RASTER1 = ENVIRaster, $\n INPUT_RASTER2 = ENVIRaster, $\n [ OUTPUT_GRID_DEFINITION = ENVIGridDefinition ], $\n [ OUTPUT_RASTER1_URI = String ], $\n [ OUTPUT_RASTER2_URI = String ], $\n [ OUTPUT_MASK_RASTER_URI = String ], $\n [ RESAMPLING = String ]\n```\n\nTool for determining the intersection between two rasters based on their\nspatial reference and spatial extent. Both rasters will also contain only\nthe valid pixels from each scene for  analysis. In other words, if a pixel\nis `off` in the first image and not the second, it will be turned `off` in\neach of the output rasters for consistency. If one of the rasters does not\nhave a data ignore value, then a pixel state mask is automatically generated\nso that you can mask the output rasters if needed.\n\nThe pixel size of the output rasters will be the smallest x and y\npixel size from each raster.\n\n#### Keywords\n\n- **DEBUG**: in, optional, Boolean\n\n    If set, errors are stopped on.\n    Add a link to make sure it doesn't get picked up\n      https://en.wikipedia.org/wiki/Haversine_formula\n      http://en.wikipedia.org/wiki/Haversine_formula\n      ftp://en.wikipedia.org/wiki/Haversine_formula\n      s3://en.wikipedia.org/wiki/Haversine_formula\n      file://en.wikipedia.org/wiki/Haversine_formula\n\n- **DATA_IGNORE_VALUE**: in, optional, Number\n\n    If one or both of your input rasters do not have\n    a data ignore value metadata item, you can specify\n\n- **GENERATE_PIXEL_STATE_MASK**: in, optional, Boolean\n\n    If set, then an addititonal output raster is created\n    that represents which pixels can be processed or not.\n    \n    This will automatically be generated if one of the input\n    images does not have a data ignore value.\n\n- **INPUT_RASTER1**: in, required, ENVIRaster\n\n    Specify the first raster to use for intersection.\n\n- **INPUT_RASTER2**: in, required, ENVIRaster\n\n    Specify the second raster to use for intersection\n\n- **OUTPUT_GRID_DEFINITION**: out, optional, ENVIGridDefinition\n\n    Optionally return the ENVIGridDefinition object used to get the intersection\n    of the two scenes.\n\n- **OUTPUT_RASTER1_URI**: in, optional, String\n\n    Optionally specify the fully-qualified filepath\n    for the location of the first intersect raster.\n\n- **OUTPUT_RASTER2_URI**: in, optional, String\n\n    Optionally specify the fully-qualified filepath\n    for the location of the second intersect raster.\n\n- **OUTPUT_MASK_RASTER_URI**: in, optional, String\n\n    Optionally specify the fully-qualified filepath\n    for the location of the pixel state mask. Only applies\n    when `GENERATE_PIXEL_STATE_MASK` is set or one of the\n    input rasters does not have a data ignore value.\n\n- **RESAMPLING**: in, optional, String\n\n    Optionally return the ENVIGridDefinition object used to get the intersection\n    of the two scenes. Specify one of the following options:\n    - Nearest Neighbor\n    - Bilinear\n    - Cubic Convolution\n\n\n### Examples\n\n```idl\n;start ENVI\ne = envi(/HEADLESS)\n\n;make sure we have access to our ENVI tasks\nawesomeENVIAlgorithms, /INIT\n\n;specify two rasters to process\nraster1 = e.openRaster(file1)\nraster2 = e.openRaster(file2)\n\n;get our task\ntask = ENVITask('AwesomeRasterIntersection')\ntask.INPUT_RASTER1 = raster1\ntask.INPUT_RASTER2 = raster2\ntask.execute\n\n;print our output locations\nprint, task.OUTPUT_RASTER1_URI\nprint, task.OUTPUT_RASTER2_URI\n```\n### Author\n\nZachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)",
          docsLookup: {
            default:
              'Tool for determining the intersection between two rasters based on their\nspatial reference and spatial extent. Both rasters will also contain only\nthe valid pixels from each scene for  analysis. In other words, if a pixel\nis `off` in the first image and not the second, it will be turned `off` in\neach of the output rasters for consistency. If one of the rasters does not\nhave a data ignore value, then a pixel state mask is automatically generated\nso that you can mask the output rasters if needed.\n\nThe pixel size of the output rasters will be the smallest x and y\npixel size from each raster.',
            examples:
              "```idl\n;start ENVI\ne = envi(/HEADLESS)\n\n;make sure we have access to our ENVI tasks\nawesomeENVIAlgorithms, /INIT\n\n;specify two rasters to process\nraster1 = e.openRaster(file1)\nraster2 = e.openRaster(file2)\n\n;get our task\ntask = ENVITask('AwesomeRasterIntersection')\ntask.INPUT_RASTER1 = raster1\ntask.INPUT_RASTER2 = raster2\ntask.execute\n\n;print our output locations\nprint, task.OUTPUT_RASTER1_URI\nprint, task.OUTPUT_RASTER2_URI\n```",
            tooltip:
              'Calculates the intersection of two rasters such that both\nhave the same spatial extent and spatial dimensions',
            author:
              'Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)',
          },
          display: 'awesomeRasterIntersection',
          kws: {
            debug: {
              docs: "If set, errors are stopped on.\nAdd a link to make sure it doesn't get picked up\n  https://en.wikipedia.org/wiki/Haversine_formula\n  http://en.wikipedia.org/wiki/Haversine_formula\n  ftp://en.wikipedia.org/wiki/Haversine_formula\n  s3://en.wikipedia.org/wiki/Haversine_formula\n  file://en.wikipedia.org/wiki/Haversine_formula",
              direction: 'in',
              source: 'internal',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
              private: true,
              req: false,
              display: 'DEBUG',
              code: true,
              pos: [96, 2, 5],
            },
            data_ignore_value: {
              docs: 'If one or both of your input rasters do not have\na data ignore value metadata item, you can specify',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'Number', display: 'Number', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'DATA_IGNORE_VALUE',
              code: true,
              pos: [97, 2, 17],
            },
            generate_pixel_state_mask: {
              docs: 'If set, then an addititonal output raster is created\nthat represents which pixels can be processed or not.\n\nThis will automatically be generated if one of the input\nimages does not have a data ignore value.',
              direction: 'in',
              source: 'internal',
              type: [
                { name: 'Boolean', display: 'Boolean', args: [], meta: {} },
              ],
              private: false,
              req: false,
              display: 'GENERATE_PIXEL_STATE_MASK',
              code: true,
              pos: [98, 2, 25],
            },
            input_raster1: {
              docs: 'Specify the first raster to use for intersection.',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'INPUT_RASTER1',
              code: true,
              pos: [99, 2, 13],
            },
            input_raster2: {
              docs: 'Specify the second raster to use for intersection',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'INPUT_RASTER2',
              code: true,
              pos: [100, 2, 13],
            },
            output_grid_definition: {
              docs: 'Optionally return the ENVIGridDefinition object used to get the intersection\nof the two scenes.',
              direction: 'out',
              source: 'internal',
              type: [
                {
                  name: 'ENVIGridDefinition',
                  display: 'ENVIGridDefinition',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: false,
              display: 'OUTPUT_GRID_DEFINITION',
              code: true,
              pos: [102, 2, 22],
            },
            output_raster1_uri: {
              docs: 'Optionally specify the fully-qualified filepath\nfor the location of the first intersect raster.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'OUTPUT_RASTER1_URI',
              code: true,
              pos: [103, 2, 18],
            },
            output_raster2_uri: {
              docs: 'Optionally specify the fully-qualified filepath\nfor the location of the second intersect raster.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'OUTPUT_RASTER2_URI',
              code: true,
              pos: [104, 2, 18],
            },
            output_mask_raster_uri: {
              docs: 'Optionally specify the fully-qualified filepath\nfor the location of the pixel state mask. Only applies\nwhen `GENERATE_PIXEL_STATE_MASK` is set or one of the\ninput rasters does not have a data ignore value.',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'OUTPUT_MASK_RASTER_URI',
              code: true,
              pos: [101, 2, 22],
            },
            resampling: {
              docs: 'Optionally return the ENVIGridDefinition object used to get the intersection\nof the two scenes. Specify one of the following options:\n- Nearest Neighbor\n- Bilinear\n- Cubic Convolution',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
              private: false,
              req: false,
              display: 'RESAMPLING',
              code: true,
              pos: [105, 2, 10],
            },
          },
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { awesomerasterintersection: ['idl2', 'hidden'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
