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

describe(`[auto generated] Image classification using machine learning`, () => {
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
            description: 'Raster to classify into thematic categories',
            type: 'ENVIRaster',
          },
          {
            name: 'training_roi',
            display_name: 'Training ROIs',
            description:
              'ENVI ROI file with labeled training samples for each class',
            type: 'ENVIROIArray',
          },
        ],
      },
      {
        id: 'normstats',
        type: 'task',
        task_name: 'NormalizationStatistics',
        comment: 'Calculate min/max normalization statistics from the raster',
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
        comment: 'Train Random Forest classifier from labeled samples',
      },
      {
        id: 'classify',
        type: 'task',
        task_name: 'MachineLearningClassification',
        comment: 'Apply the trained model to classify the entire image',
      },
      {
        id: 'smooth',
        type: 'task',
        task_name: 'ClassificationSmoothing',
        comment: 'Remove salt-and-pepper noise from the classification result',
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
        to: 'normstats',
        to_parameters: ['input_rasters'],
      },
      {
        from: 'inputs',
        from_parameters: ['input_raster'],
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
        from: 'inputs',
        from_parameters: ['input_raster'],
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
        to: 'smooth',
        to_parameters: ['input_raster'],
      },
      {
        from: 'smooth',
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
              description: 'Raster to classify into thematic categories',
              type: 'ENVIRaster',
            },
            {
              name: 'training_roi',
              display_name: 'Training ROIs',
              description:
                'ENVI ROI file with labeled training samples for each class',
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
          display_name: 'Classification Smoothing',
          location: [2200, 1490],
          name: 'task_5',
          type: 'task',
          envitask: {
            name: 'ClassificationSmoothing',
          },
        },
        {
          display_name: 'Output Parameters',
          location: [2400, 1490],
          name: 'parameters_2',
          type: 'outputparameters',
        },
        {
          display_name:
            'Calculate min/max normalization statistics from the raster',
          location: [1400, 1400],
          name: 'comment_1',
          type: 'comment',
        },
        {
          display_name: 'Extract spectral training samples from the ROIs',
          location: [1600, 1400],
          name: 'comment_2',
          type: 'comment',
        },
        {
          display_name: 'Train Random Forest classifier from labeled samples',
          location: [1800, 1400],
          name: 'comment_3',
          type: 'comment',
        },
        {
          display_name: 'Apply the trained model to classify the entire image',
          location: [2000, 1400],
          name: 'comment_4',
          type: 'comment',
        },
        {
          display_name:
            'Remove salt-and-pepper noise from the classification result',
          location: [2200, 1400],
          name: 'comment_5',
          type: 'comment',
        },
      ],
      edges: [
        {
          from_node: 'parameters_1',
          from_parameters: ['input_raster'],
          to_node: 'task_1',
          to_parameters: ['input_rasters'],
        },
        {
          from_node: 'parameters_1',
          from_parameters: ['input_raster'],
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
          from_parameters: ['input_raster'],
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
          from_node: 'task_4',
          from_parameters: ['output_raster'],
          to_node: 'task_5',
          to_parameters: ['input_raster'],
        },
        {
          from_node: 'task_5',
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
