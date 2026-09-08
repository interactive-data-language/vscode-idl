import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_CHANGE_DETECTION_ML: IAutoENVIModelerTest =
  {
    suiteName: 'Change detection using machine learning',
    fileName: 'change-detection-ml.spec.ts',
    tests: [
      {
        name: 'for the happy path',
        nodes: [
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
                description:
                  'ROIs with Background (no change) and Change classes',
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
        ],
        edges: [
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
        ],
      },
    ],
  };
