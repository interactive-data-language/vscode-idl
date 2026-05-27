import { IAutoENVIModelerTest } from '../../tests.interface';

/**
 * Automated tests for the "generic change detection workflow".
 *
 * Covers the happy-path spectral-angle-difference pipeline:
 *   ImageIntersection → SAMImageDifference → outputparameters
 */
export const AUTO_ENVI_MODELER_TEST_CHANGE_DETECTION: IAutoENVIModelerTest = {
  suiteName: 'Generic change detection workflow',
  fileName: 'change-detection.spec.ts',
  tests: [
    {
      name: 'for the happy path',
      nodes: [
        {
          id: 'inputs',
          type: 'inputparameters',
          parameters: [
            {
              name: 'before_raster',
              display_name: 'Before Raster (Time 1)',
              description: 'Raster from the earlier time period',
              type: 'ENVIRaster',
            },
            {
              name: 'after_raster',
              display_name: 'After Raster (Time 2)',
              description: 'Raster from the later time period',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          id: 'intersect',
          type: 'task',
          task_name: 'ImageIntersection',
          comment: 'Clip both images to the same spatial extent and pixel grid',
        },
        {
          id: 'sam_diff',
          type: 'task',
          task_name: 'SAMImageDifference',
          comment:
            'Compute spectral-angle difference; smaller angle = less change',
        },
        {
          id: 'outputs',
          type: 'outputparameters',
        },
      ],
      edges: [
        {
          from: 'inputs',
          from_parameters: ['before_raster'],
          to: 'intersect',
          to_parameters: ['input_raster1'],
        },
        {
          from: 'inputs',
          from_parameters: ['after_raster'],
          to: 'intersect',
          to_parameters: ['input_raster2'],
        },
        {
          from: 'intersect',
          from_parameters: ['output_raster1'],
          to: 'sam_diff',
          to_parameters: ['input_raster1'],
        },
        {
          from: 'intersect',
          from_parameters: ['output_raster2'],
          to: 'sam_diff',
          to_parameters: ['input_raster2'],
        },
        {
          from: 'sam_diff',
          from_parameters: ['output_raster'],
          to: 'outputs',
          to_parameters: [''],
        },
      ],
    },
  ],
};
