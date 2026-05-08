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

describe(`[auto generated] Parameters with static input`, () => {
  it(`[auto generated] for simple cases`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'input_params',
        type: 'inputparameters',
        display_name: 'Input Parameters',
        parameters: [
          {
            name: 'input_raster',
            display_name: 'NBR Difference Raster',
            description:
              'Difference between pre-fire and post-fire Normalized Burn Ratio',
            type: 'ENVIRaster',
          },
        ],
        comment: 'NBR Difference Raster (decrease = burned area)',
      },
      {
        id: 'threshold',
        type: 'task',
        display_name: 'Detect Decrease Only',
        task_name: 'ChangeThresholdClassification',
        static_input: {
          increase_threshold: 100,
          decrease_threshold: -0.1,
        },
        comment: 'Step 1: Automatic thresholding for decrease only',
      },
      {
        id: 'sieve',
        type: 'task',
        display_name: 'Remove Small Clumps',
        task_name: 'ClassificationSieving',
        static_input: {
          minimum_size: 500,
        },
        comment: 'Step 2: Remove clumps ≤500 pixels',
      },
      {
        id: 'to_shapefile',
        type: 'task',
        display_name: 'Export Decrease Class',
        task_name: 'ClassificationToShapefile',
        static_input: {
          export_classes: ['Decrease'],
        },
        comment: 'Step 4: Generate shapefile for Decrease class only',
      },
      {
        id: 'reproject',
        type: 'task',
        display_name: 'Reproject to Web Mercator',
        task_name: 'ReprojectVector',
        static_input: {
          coord_sys: {
            factory: 'CoordSys',
            coord_sys_code: 3857,
          },
        },
        comment: 'Step 5: Reproject to EPSG:3857',
      },
      {
        id: 'smooth',
        type: 'task',
        display_name: 'Smooth Boundaries',
        task_name: 'SmoothVector',
        static_input: {
          smooth_factor: 15,
        },
        comment: 'Step 6: Reduce complexity with factor 15',
      },
      {
        id: 'output_params',
        type: 'outputparameters',
        display_name: 'Final Outputs',
      },
      {
        id: 'view_shapefile',
        type: 'view',
        display_name: 'Display Result',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'input_params',
        from_parameters: ['input_raster'],
        to: 'threshold',
        to_parameters: ['input_raster'],
      },
      {
        from: 'threshold',
        from_parameters: ['output_raster'],
        to: 'sieve',
        to_parameters: ['input_raster'],
      },
      {
        from: 'sieve',
        from_parameters: ['OUTPUT_RASTER'],
        to: 'to_shapefile',
        to_parameters: ['input_raster'],
      },
      {
        from: 'to_shapefile',
        from_parameters: ['output_vector'],
        to: 'reproject',
        to_parameters: ['input_vector'],
      },
      {
        from: 'reproject',
        from_parameters: ['output_vector'],
        to: 'smooth',
        to_parameters: ['input_vector'],
      },
      {
        from: 'smooth',
        from_parameters: ['output_vector'],
        to: 'output_params',
        to_parameters: [''],
      },
      {
        from: 'smooth',
        from_parameters: ['output_vector'],
        to: 'view_shapefile',
        to_parameters: ['input_vector'],
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
              display_name: 'NBR Difference Raster',
              description:
                'Difference between pre-fire and post-fire Normalized Burn Ratio',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          display_name: 'Change Threshold Classification',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'ChangeThresholdClassification',
            static_input: {
              increase_threshold: 100,
              decrease_threshold: -0.1,
            },
          },
        },
        {
          display_name: 'Classification Sieving',
          location: [1600, 1490],
          name: 'task_2',
          type: 'task',
          envitask: {
            name: 'ClassificationSieving',
            static_input: {
              minimum_size: 500,
            },
          },
        },
        {
          display_name: 'Convert Classification to Vector Shapefile',
          location: [1800, 1490],
          name: 'task_3',
          type: 'task',
          envitask: {
            name: 'ClassificationToShapefile',
            static_input: {
              export_classes: ['Decrease'],
            },
          },
        },
        {
          display_name: 'Reproject Vector',
          location: [2000, 1490],
          name: 'task_4',
          type: 'task',
          envitask: {
            name: 'ReprojectVector',
            static_input: {
              coord_sys: {
                factory: 'CoordSys',
                coord_sys_code: 3857,
              },
            },
          },
        },
        {
          display_name: 'Smooth Vector',
          location: [2200, 1490],
          name: 'task_5',
          type: 'task',
          envitask: {
            name: 'SmoothVector',
            static_input: {
              smooth_factor: 15,
            },
          },
        },
        {
          display_name: 'Output Parameters',
          location: [2400, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name: 'View',
          location: [2400, 1640],
          name: 'view_1',
          type: 'view',
          revision: '1.0.0',
        },
        {
          display_name: 'NBR Difference Raster (decrease = burned area)',
          location: [1200, 1550],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name: 'Step 1: Automatic thresholding for decrease only',
          location: [1400, 1400],
          name: 'comment_2',
          type: 'comment',
        },
        {
          display_name: 'Step 2: Remove clumps ≤500 pixels',
          location: [1600, 1400],
          name: 'comment_3',
          type: 'comment',
        },
        {
          display_name: 'Step 4: Generate shapefile for Decrease class only',
          location: [1800, 1400],
          name: 'comment_4',
          type: 'comment',
        },
        {
          display_name: 'Step 5: Reproject to EPSG:3857',
          location: [2000, 1400],
          name: 'comment_5',
          type: 'comment',
        },
        {
          display_name: 'Step 6: Reduce complexity with factor 15',
          location: [2200, 1400],
          name: 'comment_6',
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
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'task_3',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_3',
          from_parameters: ['output_vector'],
          to_node: 'task_4',
          to_parameters: ['input_vector'],
        },
        {
          from_node: 'task_4',
          from_parameters: ['output_vector'],
          to_node: 'task_5',
          to_parameters: ['input_vector'],
        },
        {
          from_node: 'task_5',
          from_parameters: ['output_vector'],
          to_node: 'parameters_2',
          to_parameters: [''],
        },
        {
          from_node: 'task_5',
          from_parameters: ['output_vector'],
          to_node: 'view_1',
          to_parameters: ['input_vector'],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });
});
