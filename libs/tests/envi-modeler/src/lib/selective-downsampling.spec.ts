import {
  CreateENVIModelerWorkflow,
  ValidateENVIModelerWorkflow,
} from '@idl/envi/modeler';
import { LogManager } from '@idl/logger';
import { MCPTaskRegistry } from '@idl/mcp/tasks';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/idl-data-types';
import { ENVIModelerEdge, ENVIModelerNode } from '@idl/types/mcp';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';

IDL_INDEX_OPTIONS.IS_TEST = true;

// create log manager
const logManager = new LogManager({
  alert: () => {
    // do nothing
  },
});

// create index
const index = new IDLIndex(logManager, 1, false);

// load global tokens
index.loadGlobalTokens(DEFAULT_IDL_EXTENSION_CONFIG);

// create registry
const registry = new MCPTaskRegistry(logManager);

// populate registry
registry.registerTasksFromGlobalTokens(
  index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.FUNCTION],
  index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE],
);

describe(`[auto generated] Selective downsampling of imagery`, () => {
  it(`[auto generated] for the happy path`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'inputs',
        type: 'inputparameters',
        parameters: [
          {
            name: 'input_raster',
            display_name: 'Input Raster',
            description: 'Source raster to process',
            type: 'ENVIRaster',
          },
          {
            name: 'mask_roi',
            display_name: 'Mask ROI',
            description:
              'ROI identifying the regions to selectively downsample',
            type: 'ENVIROIArray',
          },
        ],
      },
      {
        id: 'downsample',
        type: 'task',
        task_name: 'PixelScaleResampleRaster',
        static_input: {
          pixel_scale: [4, 4],
          resampling: 'Nearest Neighbor',
        },
        comment:
          'Downsample to coarse resolution to create a blocky appearance',
      },
      {
        id: 'roi_mask',
        type: 'task',
        task_name: 'ROIMaskRaster',
        static_input: {
          data_ignore_value: 0,
        },
        comment:
          'Apply ROI mask so only the target regions show the downsampled result',
      },
      {
        id: 'mosaic',
        type: 'task',
        task_name: 'BuildMosaicRaster',
        comment:
          'Composite the masked downsampled raster on top of the original; masked raster MUST be first',
      },
      {
        id: 'outputs',
        type: 'outputparameters',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'inputs',
        from_parameters: ['input_raster'],
        to: 'downsample',
        to_parameters: ['input_raster'],
      },
      {
        from: 'downsample',
        from_parameters: ['output_raster'],
        to: 'roi_mask',
        to_parameters: ['input_raster'],
      },
      {
        from: 'inputs',
        from_parameters: ['mask_roi'],
        to: 'roi_mask',
        to_parameters: ['input_mask_roi'],
      },
      {
        from: 'roi_mask',
        from_parameters: ['output_raster'],
        to: 'mosaic',
        to_parameters: ['input_rasters'],
      },
      {
        from: 'inputs',
        from_parameters: ['input_raster'],
        to: 'mosaic',
        to_parameters: ['input_rasters'],
      },
      {
        from: 'mosaic',
        from_parameters: ['output_raster'],
        to: 'outputs',
        to_parameters: [''],
      },
    ];

    // validate nodes
    const errors = ValidateENVIModelerWorkflow(nodes, edges, registry);

    // define expected errors
    const expectedErrors: string[] = [];

    // verify errors
    expect(errors).toEqual(expectedErrors);

    // define expected workflow
    const expectedWorkflow = {
      schema: 'envimodel_1.0',
      nodes: [
        {
          display_name: 'Input Parameters',
          location: [1200, 1640],
          name: 'parameters_1',
          type: 'inputparameters',
          parameters: [
            {
              name: 'input_raster',
              display_name: 'Input Raster',
              description: 'Source raster to process',
              type: 'ENVIRaster',
            },
            {
              name: 'mask_roi',
              display_name: 'Mask ROI',
              description:
                'ROI identifying the regions to selectively downsample',
              type: 'ENVIROIArray',
            },
          ],
        },
        {
          display_name: 'Resample Raster by Pixel Scale',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'PixelScaleResampleRaster',
            static_input: {
              pixel_scale: [4, 4],
              resampling: 'Nearest Neighbor',
            },
          },
        },
        {
          display_name: 'Mask Raster by ROI',
          location: [1600, 1490],
          name: 'task_2',
          type: 'task',
          envitask: {
            name: 'ROIMaskRaster',
            static_input: {
              data_ignore_value: 0,
            },
          },
        },
        {
          display_name: 'Aggregator',
          location: [1800, 1490],
          name: 'aggregator_1',
          type: 'aggregator',
          revision: '1.0.0',
          extract: 1,
        },
        {
          display_name: 'Build Mosaic Raster',
          location: [2000, 1490],
          name: 'task_3',
          type: 'task',
          envitask: {
            name: 'BuildMosaicRaster',
          },
        },
        {
          display_name: 'Output Parameters',
          location: [2200, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name:
            'Downsample to coarse resolution to create a blocky appearance',
          location: [1400, 1400],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name:
            'Apply ROI mask so only the target regions show the downsampled result',
          location: [1600, 1400],
          name: 'comment_2',
          type: 'comment',
        },
        {
          display_name:
            'Composite the masked downsampled raster on top of the original; masked raster MUST be first',
          location: [2000, 1400],
          name: 'comment_3',
          type: 'comment',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['input_raster'],
          to_node: 'task_1',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster'],
          to_node: 'task_2',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['mask_roi'],
          to_node: 'task_2',
          to_parameters: ['input_mask_roi'],
        },
        {
          from_node: 'task_3',
          from_parameters: ['output_raster'],
          to_node: 'parameters_2',
          to_parameters: [''],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'aggregator_1',
          to_parameters: [''],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['input_raster'],
          to_node: 'aggregator_1',
          to_parameters: [''],
        },
        {
          from_node: 'aggregator_1',
          from_parameters: ['output'],
          to_node: 'task_3',
          to_parameters: ['input_rasters'],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });
});
