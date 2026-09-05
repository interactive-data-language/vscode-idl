import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_BAD_DIRECTION: IAutoENVIModelerTest = {
  suiteName: 'Bad direction',
  fileName: 'bad-direction.1.spec.ts',
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
          from_parameters: ['input_raster1'],
          to: 'layerstack_task',
          to_parameters: ['output_raster'],
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
};
