import { IAutoENVIModelerTest } from '../tests.interface';

/**
 * Automated tests for ENVI Modeler validation and workflow creation.
 *
 * Populate this array with test suites. Each suite will generate a spec file
 * in libs/tests/envi-modeler/src/lib/ via the test-tokenizer generator.
 */
export const AUTO_ENVI_MODELER_TESTS: IAutoENVIModelerTest[] = [
  {
    suiteName: 'Add aggregators',
    fileName: 'aggregator.1.spec.ts',
    tests: [
      {
        name: 'for simple cases',
        nodes: [
          {
            id: 'input_params',
            type: 'inputparameters',
            display_name: 'Input Parameters',
            parameters: [
              {
                name: 'input_raster1',
                display_name: 'First Input Raster',
                description: 'First raster for image intersection',
                type: 'ENVIRaster',
              },
              {
                name: 'input_raster2',
                display_name: 'Second Input Raster',
                description: 'Second raster for image intersection',
                type: 'ENVIRaster',
              },
            ],
          },
          {
            id: 'intersection_task',
            type: 'task',
            display_name: 'Image Intersection',
            task_name: 'ImageIntersection',
            comment: 'Finds the overlapping area between two input rasters',
          },
          {
            id: 'layerstack_task',
            type: 'task',
            display_name: 'Build Layer Stack',
            task_name: 'BuildLayerStack',
            comment:
              'Stacks the two intersection results into a single multi-band raster',
          },
          {
            id: 'output_params',
            type: 'outputparameters',
            display_name: 'Output Parameters',
          },
        ],
        edges: [
          {
            from: 'input_params',
            from_parameters: ['input_raster1'],
            to: 'intersection_task',
            to_parameters: ['input_raster1'],
          },
          {
            from: 'input_params',
            from_parameters: ['input_raster2'],
            to: 'intersection_task',
            to_parameters: ['input_raster2'],
          },
          {
            from: 'intersection_task',
            from_parameters: ['output_raster1', 'output_raster2'],
            to: 'layerstack_task',
            to_parameters: ['input_rasters'],
          },
          {
            from: 'layerstack_task',
            from_parameters: ['output_raster'],
            to: 'output_params',
            to_parameters: [''],
          },
        ],
      },
    ],
  },
  {
    suiteName: 'Bad Edges',
    fileName: 'bad-edges.1.spec.ts',
    tests: [
      {
        name: 'for simple cases',
        nodes: [
          {
            id: 'input_params',
            type: 'inputparameters',
            display_name: 'Input Parameters',
            parameters: [
              {
                name: 'input_raster1',
                display_name: 'First Input Raster',
                description: 'First raster for image intersection',
                type: 'ENVIRaster',
              },
              {
                name: 'input_raster2',
                display_name: 'Second Input Raster',
                description: 'Second raster for image intersection',
                type: 'ENVIRaster',
              },
            ],
          },
          {
            id: 'intersection_task',
            type: 'task',
            display_name: 'Image Intersection',
            task_name: 'ImageIntersection',
            comment: 'Finds the overlapping area between two input rasters',
          },
          {
            id: 'layerstack_task',
            type: 'task',
            display_name: 'Build Layer Stack',
            task_name: 'BuildLayerStack',
            comment:
              'Stacks the two intersection results into a single multi-band raster',
          },
          {
            id: 'output_params',
            type: 'outputparameters',
            display_name: 'Output Parameters',
          },
        ],
        edges: [
          {
            from: 'input_params12',
            from_parameters: ['input_raster1'],
            to: 'intersection_task12',
            to_parameters: ['input_raster1'],
          },
          {
            from: 'input_params',
            from_parameters: ['input_raster2'],
            to: 'intersection_task',
            to_parameters: ['input_raster2'],
          },
          {
            from: 'intersection_task',
            from_parameters: ['output_raster1', 'output_raster2'],
            to: 'layerstack_task',
            to_parameters: ['input_rasters'],
          },
          {
            from: 'layerstack_task',
            from_parameters: ['output_raster'],
            to: 'output_params',
            to_parameters: [''],
          },
        ],
      },
    ],
  },
  {
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
  },
  {
    suiteName: 'Parameter error tests',
    fileName: 'params-bad.1.spec.ts',
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
                description:
                  'ROIs with Background (no change) and Change classes',
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
          { id: 'view_result', type: 'view', display_name: 'View Result' },
        ],
        edges: [
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
        ],
      },
    ],
  },
];
