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

describe(`[auto generated] Change detection using machine learning`, () => {
  it(`[auto generated] for the happy path`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'inputs',
        type: 'inputparameters',
        parameters: [
          {
            name: 'time1_raster',
            display_name: 'Time 1 Raster',
            description: 'Raster from the earlier time period',
            type: 'ENVIRaster',
          },
          {
            name: 'time2_raster',
            display_name: 'Time 2 Raster',
            description: 'Raster from the later time period',
            type: 'ENVIRaster',
          },
          {
            name: 'training_roi',
            display_name: 'Training ROIs',
            description: 'ROIs with Background (no change) and Change classes',
            type: 'ENVIROIArray',
          },
        ],
      },
      {
        id: 'intersect',
        type: 'task',
        task_name: 'ImageIntersection',
        comment: 'Align both rasters to the same spatial extent',
      },
      {
        id: 'bandstack',
        type: 'task',
        task_name: 'BuildBandStack',
        comment:
          'Stack Time 1 and Time 2 bands into a single multi-band raster',
      },
      {
        id: 'normstats',
        type: 'task',
        task_name: 'NormalizationStatistics',
        comment:
          'Calculate min/max normalization statistics from the band stack',
      },
      {
        id: 'training_data',
        type: 'task',
        task_name: 'MLTrainingDataFromROIs',
        comment: 'Extract spectral training samples from the ROIs',
      },
      {
        id: 'train_model',
        type: 'task',
        task_name: 'TrainRandomForest',
        comment: 'Train Random Forest model to detect change vs no-change',
      },
      {
        id: 'classify',
        type: 'task',
        task_name: 'MachineLearningClassification',
        comment: 'Classify the stacked image using the trained model',
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
        to: 'intersect',
        to_parameters: ['input_raster1'],
      },
      {
        from: 'inputs',
        from_parameters: ['time2_raster'],
        to: 'intersect',
        to_parameters: ['input_raster2'],
      },
      {
        from: 'intersect',
        from_parameters: ['output_raster1', 'output_raster2'],
        to: 'bandstack',
        to_parameters: ['input_rasters'],
      },
      {
        from: 'bandstack',
        from_parameters: ['output_raster'],
        to: 'normstats',
        to_parameters: ['input_rasters'],
      },
      {
        from: 'bandstack',
        from_parameters: ['output_raster'],
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
        from: 'normstats',
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
        from: 'bandstack',
        from_parameters: ['output_raster'],
        to: 'classify',
        to_parameters: ['input_raster'],
      },
      {
        from: 'train_model',
        from_parameters: ['output_model'],
        to: 'classify',
        to_parameters: ['input_model'],
      },
      {
        from: 'normstats',
        from_parameters: ['normalization'],
        to: 'classify',
        to_parameters: ['normalize_min_max'],
      },
      {
        from: 'classify',
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
              name: 'time1_raster',
              display_name: 'Time 1 Raster',
              description: 'Raster from the earlier time period',
              type: 'ENVIRaster',
            },
            {
              name: 'time2_raster',
              display_name: 'Time 2 Raster',
              description: 'Raster from the later time period',
              type: 'ENVIRaster',
            },
            {
              name: 'training_roi',
              display_name: 'Training ROIs',
              description:
                'ROIs with Background (no change) and Change classes',
              type: 'ENVIROIArray',
            },
          ],
        },
        {
          display_name: 'Image Intersection',
          location: [1400, 1490],
          name: 'task_1',
          type: 'task',
          envitask: {
            name: 'ImageIntersection',
          },
        },
        {
          display_name: 'Aggregator',
          location: [1600, 1490],
          name: 'aggregator_1',
          type: 'aggregator',
          revision: '1.0.0',
          extract: 1,
        },
        {
          display_name: 'Build Band Stack',
          location: [1800, 1490],
          name: 'task_2',
          type: 'task',
          envitask: {
            name: 'BuildBandStack',
          },
        },
        {
          display_name: 'Normalization Statistics',
          location: [2000, 1490],
          name: 'task_3',
          type: 'task',
          envitask: {
            name: 'NormalizationStatistics',
          },
        },
        {
          display_name: 'ML Training Data from ROIs',
          location: [2200, 1490],
          name: 'task_4',
          type: 'task',
          envitask: {
            name: 'MLTrainingDataFromROIs',
          },
        },
        {
          display_name: 'Train Random Forest',
          location: [2400, 1490],
          name: 'task_5',
          type: 'task',
          envitask: {
            name: 'TrainRandomForest',
          },
        },
        {
          display_name: 'Machine Learning Classification',
          location: [2600, 1490],
          name: 'task_6',
          type: 'task',
          envitask: {
            name: 'MachineLearningClassification',
          },
        },
        {
          display_name: 'Output Parameters',
          location: [2800, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name: 'Align both rasters to the same spatial extent',
          location: [1400, 1400],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name:
            'Stack Time 1 and Time 2 bands into a single multi-band raster',
          location: [1800, 1400],
          name: 'comment_2',
          type: 'comment',
        },
        {
          display_name:
            'Calculate min/max normalization statistics from the band stack',
          location: [2000, 1400],
          name: 'comment_3',
          type: 'comment',
        },
        {
          display_name: 'Extract spectral training samples from the ROIs',
          location: [2200, 1400],
          name: 'comment_4',
          type: 'comment',
        },
        {
          display_name:
            'Train Random Forest model to detect change vs no-change',
          location: [2400, 1400],
          name: 'comment_5',
          type: 'comment',
        },
        {
          display_name: 'Classify the stacked image using the trained model',
          location: [2600, 1400],
          name: 'comment_6',
          type: 'comment',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['time1_raster'],
          to_node: 'task_1',
          to_parameters: ['input_raster1'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['time2_raster'],
          to_node: 'task_1',
          to_parameters: ['input_raster2'],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'task_3',
          to_parameters: ['input_rasters'],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'task_4',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['training_roi'],
          to_node: 'task_4',
          to_parameters: ['input_roi'],
        },
        {
          from_node: 'task_3',
          from_parameters: ['normalization'],
          to_node: 'task_4',
          to_parameters: ['normalize_min_max'],
        },
        {
          from_node: 'task_4',
          from_parameters: ['output_raster'],
          to_node: 'task_5',
          to_parameters: ['input_rasters'],
        },
        {
          from_node: 'task_2',
          from_parameters: ['output_raster'],
          to_node: 'task_6',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_5',
          from_parameters: ['output_model'],
          to_node: 'task_6',
          to_parameters: ['input_model'],
        },
        {
          from_node: 'task_3',
          from_parameters: ['normalization'],
          to_node: 'task_6',
          to_parameters: ['normalize_min_max'],
        },
        {
          from_node: 'task_6',
          from_parameters: ['output_raster'],
          to_node: 'parameters_2',
          to_parameters: [''],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster1'],
          to_node: 'aggregator_1',
          to_parameters: [''],
        },
        {
          from_node: 'task_1',
          from_parameters: ['output_raster2'],
          to_node: 'aggregator_1',
          to_parameters: [''],
        },
        {
          from_node: 'aggregator_1',
          from_parameters: ['output'],
          to_node: 'task_2',
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
