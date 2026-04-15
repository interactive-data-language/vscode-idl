import { ValidateENVIModelerNodes } from '@idl/envi/modeler';
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

describe(`[auto generated] Parameter error tests`, () => {
  it(`[auto generated] For machine learning`, () => {
    // define nodes
    const nodes: ENVIModelerNode[] = [
      {
        id: 'inputs',
        type: 'inputparameters',
        parameters: [
          {
            name: 'time1_raster',
            display_name: 'Time 1 Image',
            description: 'Pre-event raster image',
            type: 'ENVIRaster',
          },
          {
            name: 'time2_raster',
            display_name: 'Time 2 Image',
            description: 'Post-event raster image',
            type: 'ENVIRaster',
          },
          {
            name: 'training_rois',
            display_name: 'Training ROIs',
            description: 'ROIs with Background (no change) and Change classes',
            type: 'ENVIROIArray',
          },
        ],
      },
      {
        id: 'intersection',
        type: 'task',
        display_name: 'Image Intersection',
        task_name: 'ImageIntersection',
      },
      {
        id: 'bandstack',
        type: 'task',
        display_name: 'Build Band Stack',
        task_name: 'BuildBandStack',
      },
      {
        id: 'normstats',
        type: 'task',
        display_name: 'Normalization Statistics',
        task_name: 'NormalizationStatistics',
      },
      {
        id: 'trainingdata',
        type: 'task',
        display_name: 'Extract Training Data',
        task_name: 'MLTrainingDataFromROIs',
      },
      {
        id: 'trainmodel',
        type: 'task',
        display_name: 'Train Random Forest Model',
        task_name: 'TrainRandomForest',
      },
      {
        id: 'classify',
        type: 'task',
        display_name: 'ML Classification',
        task_name: 'MachineLearningClassification',
      },
      {
        id: 'smoothing',
        type: 'task',
        display_name: 'Classification Smoothing',
        task_name: 'ClassificationSmoothing',
      },
      {
        id: 'outputs',
        type: 'outputparameters',
        display_name: 'Workflow Outputs',
      },
      {
        id: 'view_result',
        type: 'view',
        display_name: 'View Result',
      },
    ];

    // define edges
    const edges: ENVIModelerEdge[] = [
      {
        from: 'inputs',
        from_parameters: ['time1_raster', 'time2_raster'],
        to: 'intersection',
        to_parameters: ['input_raster1', 'input_raster2'],
      },
      {
        from: 'intersection',
        from_parameters: ['output_raster1', 'output_raster2'],
        to: 'bandstack',
        to_parameters: ['input_raster1', 'input_raster2'],
      },
      {
        from: 'bandstack',
        from_parameters: ['output_raster'],
        to: 'normstats',
        to_parameters: ['input_raster'],
      },
      {
        from: 'bandstack',
        from_parameters: ['output_raster'],
        to: 'trainingdata',
        to_parameters: ['input_raster'],
      },
      {
        from: 'inputs',
        from_parameters: ['training_rois'],
        to: 'trainingdata',
        to_parameters: ['input_roi'],
      },
      {
        from: 'trainingdata',
        from_parameters: ['output_training_data'],
        to: 'trainmodel',
        to_parameters: ['input_training_data'],
      },
      {
        from: 'normstats',
        from_parameters: ['output_normalization_statistics'],
        to: 'trainmodel',
        to_parameters: ['input_normalization_statistics'],
      },
      {
        from: 'bandstack',
        from_parameters: ['output_raster'],
        to: 'classify',
        to_parameters: ['input_raster'],
      },
      {
        from: 'trainmodel',
        from_parameters: ['output_model'],
        to: 'classify',
        to_parameters: ['input_model'],
      },
      {
        from: 'normstats',
        from_parameters: ['output_normalization_statistics'],
        to: 'classify',
        to_parameters: ['input_normalization_statistics'],
      },
      {
        from: 'classify',
        from_parameters: ['output_raster'],
        to: 'smoothing',
        to_parameters: ['input_raster'],
      },
      {
        from: 'smoothing',
        from_parameters: ['output_raster'],
        to: 'outputs',
        to_parameters: [''],
      },
      {
        from: 'smoothing',
        from_parameters: ['output_raster'],
        to: 'view_result',
        to_parameters: ['input_raster'],
      },
    ];

    // validate nodes
    const errors = ValidateENVIModelerNodes(nodes, edges, registry);

    // define expected errors
    const expectedErrors: string[] = [
      'The "to_parameters" property on edge node 1 has problems that need resolved:',
      '  "input_raster1" is not a known parameter of "BuildBandStack"',
      '  "input_raster2" is not a known parameter of "BuildBandStack"',
      'The "to_parameters" property on edge node 2 has problems that need resolved:',
      '  "input_raster" is not a known parameter of "NormalizationStatistics"',
      'The "from_parameters" property on edge node 5 has problems that need resolved:',
      '  "output_training_data" is not a known parameter of "MLTrainingDataFromROIs"',
      'The "to_parameters" property on edge node 5 has problems that need resolved:',
      '  "input_training_data" is not a known parameter of "TrainRandomForest"',
      'The "from_parameters" property on edge node 6 has problems that need resolved:',
      '  "output_normalization_statistics" is not a known parameter of "NormalizationStatistics"',
      'The "to_parameters" property on edge node 6 has problems that need resolved:',
      '  "input_normalization_statistics" is not a known parameter of "TrainRandomForest"',
      'The "from_parameters" property on edge node 9 has problems that need resolved:',
      '  "output_normalization_statistics" is not a known parameter of "NormalizationStatistics"',
      'The "to_parameters" property on edge node 9 has problems that need resolved:',
      '  "input_normalization_statistics" is not a known parameter of "MachineLearningClassification"',
    ];

    // verify errors
    expect(errors).toEqual(expectedErrors);
  });
});
