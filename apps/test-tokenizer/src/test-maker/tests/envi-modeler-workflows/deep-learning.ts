import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_DEEP_LEARNING: IAutoENVIModelerTest = {
  suiteName: 'Deep learning pixel classification',
  fileName: 'deep-learning.spec.ts',
  tests: [
    {
      name: 'for the happy path',
      nodes: [
        {
          id: 'inputs',
          type: 'inputparameters',
          parameters: [
            {
              name: 'input_raster',
              display_name: 'Input Raster',
              description: 'Raster to classify',
              type: 'ENVIRaster',
            },
            {
              name: 'input_model',
              display_name: 'Deep Learning Model',
              description:
                'Trained ENVI ONNX pixel segmentation model (.envi.onnx)',
              type: 'ENVIVIRTUALIZABLEURI',
            },
          ],
        },
        {
          id: 'classify',
          type: 'task',
          task_name: 'DeepLearningPixelClassification',
          comment: 'Apply ONNX pixel-segmentation model to the input raster',
        },
        {
          id: 'outputs',
          type: 'outputparameters',
        },
      ],
      edges: [
        {
          from: 'inputs',
          from_parameters: ['input_raster'],
          to: 'classify',
          to_parameters: ['input_raster'],
        },
        {
          from: 'inputs',
          from_parameters: ['input_model'],
          to: 'classify',
          to_parameters: ['input_model'],
        },
        {
          from: 'classify',
          from_parameters: ['output_classification_raster'],
          to: 'outputs',
          to_parameters: [''],
        },
      ],
    },
  ],
};
