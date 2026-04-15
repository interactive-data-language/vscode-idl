import {
  CreateENVIModelerWorkflow,
  ValidateENVIModelerNodes,
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

describe(`[auto generated] Correct output`, () => {
  it(`[auto generated] For machine learning`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'inputs',
        type: 'inputparameters',
        parameters: [
          {
            name: 'time1_raster',
            display_name: 'Time 1 Raster (August)',
            description:
              'Input raster for first time period (e.g., August 2021)',
            type: 'ENVIRaster',
          },
          {
            name: 'time2_raster',
            display_name: 'Time 2 Raster (November)',
            description:
              'Input raster for second time period (e.g., November 2021)',
            type: 'ENVIRaster',
          },
          {
            name: 'training_roi',
            display_name: 'Training ROIs',
            description: 'ROI samples for each landcover class',
            type: 'ENVIROIArray',
          },
        ],
      },
      {
        id: 'norm_stats',
        type: 'task',
        task_name: 'NormalizationStatistics',
        comment: 'Calculate min/max values for data normalization',
      },
      {
        id: 'training_data',
        type: 'task',
        task_name: 'MLTrainingDataFromROIs',
        comment: 'Extract training pixels from ROIs',
      },
      {
        id: 'train_model',
        type: 'task',
        task_name: 'TrainRandomForest',
        static_input: {
          oob_score: true,
        },
        comment: 'Train Random Forest classifier with 100 trees',
      },
      {
        id: 'classify_time1',
        type: 'task',
        display_name: 'Classify Time 1',
        task_name: 'MachineLearningClassification',
        comment: 'Classify August image',
      },
      {
        id: 'classify_time2',
        type: 'task',
        display_name: 'Classify Time 2',
        task_name: 'MachineLearningClassification',
        comment: 'Classify November image',
      },
      {
        id: 'align_images',
        type: 'task',
        task_name: 'ImageIntersection',
        comment: 'Align classifications to same extent',
      },
      {
        id: 'change_detection',
        type: 'task',
        task_name: 'ThematicChange',
        static_input: {
          merge_no_change: true,
        },
        comment: 'Detect landcover changes between time periods',
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
        from_parameters: ['time1_raster'],
        to: 'norm_stats',
        to_parameters: ['input_rasters'],
      },
      {
        from: 'inputs',
        from_parameters: ['time1_raster'],
        to: 'training_data',
        to_parameters: ['input_raster'],
      },
      {
        from: 'inputs',
        from_parameters: ['training_roi'],
        to: 'training_data',
        to_parameters: ['input_roi'],
      },
      {
        from: 'norm_stats',
        from_parameters: ['normalization'],
        to: 'training_data',
        to_parameters: ['normalize_min_max'],
      },
      {
        from: 'training_data',
        from_parameters: ['output_raster'],
        to: 'train_model',
        to_parameters: ['input_rasters'],
      },
      {
        from: 'inputs',
        from_parameters: ['time1_raster'],
        to: 'classify_time1',
        to_parameters: ['input_raster'],
      },
      {
        from: 'train_model',
        from_parameters: ['output_model'],
        to: 'classify_time1',
        to_parameters: ['input_model'],
      },
      {
        from: 'norm_stats',
        from_parameters: ['normalization'],
        to: 'classify_time1',
        to_parameters: ['normalize_min_max'],
      },
      {
        from: 'inputs',
        from_parameters: ['time2_raster'],
        to: 'classify_time2',
        to_parameters: ['input_raster'],
      },
      {
        from: 'train_model',
        from_parameters: ['output_model'],
        to: 'classify_time2',
        to_parameters: ['input_model'],
      },
      {
        from: 'norm_stats',
        from_parameters: ['normalization'],
        to: 'classify_time2',
        to_parameters: ['normalize_min_max'],
      },
      {
        from: 'classify_time1',
        from_parameters: ['output_raster'],
        to: 'align_images',
        to_parameters: ['input_raster1'],
      },
      {
        from: 'classify_time2',
        from_parameters: ['output_raster'],
        to: 'align_images',
        to_parameters: ['input_raster2'],
      },
      {
        from: 'align_images',
        from_parameters: ['output_raster1'],
        to: 'change_detection',
        to_parameters: ['input_raster1'],
      },
      {
        from: 'align_images',
        from_parameters: ['output_raster2'],
        to: 'change_detection',
        to_parameters: ['input_raster2'],
      },
      {
        from: 'change_detection',
        from_parameters: ['output_raster'],
        to: 'outputs',
        to_parameters: [''],
      },
    ];

    // validate nodes
    const errors = ValidateENVIModelerNodes(nodes, edges, registry);

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
              name: 'time1_raster',
              display_name: 'Time 1 Raster (August)',
              description:
                'Input raster for first time period (e.g., August 2021)',
              type: 'ENVIRaster',
            },
            {
              name: 'time2_raster',
              display_name: 'Time 2 Raster (November)',
              description:
                'Input raster for second time period (e.g., November 2021)',
              type: 'ENVIRaster',
            },
            {
              name: 'training_roi',
              display_name: 'Training ROIs',
              description: 'ROI samples for each landcover class',
              type: 'ENVIROIArray',
            },
          ],
        },
        {
          display_name: 'Normalization Statistics',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'NormalizationStatistics',
          },
        },
        {
          display_name: 'ML Training Data from ROIs',
          location: [1600, 1490],
          name: 'task_2',
          type: 'task',
          envitask: {
            name: 'MLTrainingDataFromROIs',
          },
        },
        {
          display_name: 'Train Random Forest',
          location: [1800, 1490],
          name: 'task_3',
          type: 'task',
          envitask: {
            name: 'TrainRandomForest',
            static_input: {
              oob_score: true,
            },
          },
        },
        {
          display_name: 'Machine Learning Classification',
          location: [2000, 1490],
          name: 'task_4',
          type: 'task',
          envitask: {
            name: 'MachineLearningClassification',
          },
        },
        {
          display_name: 'Machine Learning Classification',
          location: [2200, 1490],
          name: 'task_5',
          type: 'task',
          envitask: {
            name: 'MachineLearningClassification',
          },
        },
        {
          display_name: 'Image Intersection',
          location: [2400, 1490],
          name: 'task_6',
          type: 'task',
          envitask: {
            name: 'ImageIntersection',
          },
        },
        {
          display_name: 'Thematic Change',
          location: [2600, 1490],
          name: 'task_7',
          type: 'task',
          envitask: {
            name: 'ThematicChange',
            static_input: {
              merge_no_change: true,
            },
          },
        },
        {
          display_name: 'Output Parameters',
          location: [2800, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name: 'Calculate min/max values for data normalization',
          location: [1400, 1400],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name: 'Extract training pixels from ROIs',
          location: [1600, 1400],
          name: 'comment_2',
          type: 'comment',
        },
        {
          display_name: 'Train Random Forest classifier with 100 trees',
          location: [1800, 1400],
          name: 'comment_3',
          type: 'comment',
        },
        {
          display_name: 'Classify August image',
          location: [2000, 1400],
          name: 'comment_4',
          type: 'comment',
        },
        {
          display_name: 'Classify November image',
          location: [2200, 1400],
          name: 'comment_5',
          type: 'comment',
        },
        {
          display_name: 'Align classifications to same extent',
          location: [2400, 1400],
          name: 'comment_6',
          type: 'comment',
        },
        {
          display_name: 'Detect landcover changes between time periods',
          location: [2600, 1400],
          name: 'comment_7',
          type: 'comment',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['time1_raster'],
          to_node: 'task_1',
          to_parameters: ['input_rasters'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['time1_raster'],
          to_node: 'task_2',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['training_roi'],
          to_node: 'task_2',
          to_parameters: ['input_roi'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['normalization'],
          to_node: 'task_2',
          to_parameters: ['normalize_min_max'],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'task_3',
          to_parameters: ['input_rasters'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['time1_raster'],
          to_node: 'task_4',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_3',
          from_parameters: ['output_model'],
          to_node: 'task_4',
          to_parameters: ['input_model'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['normalization'],
          to_node: 'task_4',
          to_parameters: ['normalize_min_max'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['time2_raster'],
          to_node: 'task_5',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_3',
          from_parameters: ['output_model'],
          to_node: 'task_5',
          to_parameters: ['input_model'],
        },
        {
          from_node: 'task_1',
          from_parameters: ['normalization'],
          to_node: 'task_5',
          to_parameters: ['normalize_min_max'],
        },
        {
          from_node: 'task_4',
          from_parameters: ['output_raster'],
          to_node: 'task_6',
          to_parameters: ['input_raster1'],
        },
        {
          from_node: 'task_5',
          from_parameters: ['output_raster'],
          to_node: 'task_6',
          to_parameters: ['input_raster2'],
        },
        {
          from_node: 'task_6',
          from_parameters: ['output_raster1'],
          to_node: 'task_7',
          to_parameters: ['input_raster1'],
        },
        {
          from_node: 'task_6',
          from_parameters: ['output_raster2'],
          to_node: 'task_7',
          to_parameters: ['input_raster2'],
        },
        {
          from_node: 'task_7',
          from_parameters: ['output_raster'],
          to_node: 'parameters_2',
          to_parameters: [''],
        },
      ],
    } as Record<string, unknown>;

    // verify workflow
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(
      expectedWorkflow,
    );
  });
});
