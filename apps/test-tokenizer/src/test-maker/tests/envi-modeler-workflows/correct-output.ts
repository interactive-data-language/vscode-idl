import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_CORRECT_OUTPUT: IAutoENVIModelerTest = {
  suiteName: 'Correct output',
  fileName: 'correct-output.1.spec.ts',
  tests: [
    {
      name: 'For machine learning',
      nodes: [
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
          static_input: { oob_score: true },
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
          static_input: { merge_no_change: true },
          comment: 'Detect landcover changes between time periods',
        },
        { id: 'outputs', type: 'outputparameters' },
      ],
      edges: [
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
      ],
    },
  ],
};
