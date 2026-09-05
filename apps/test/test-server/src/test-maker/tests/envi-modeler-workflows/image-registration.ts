import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_IMAGE_REGISTRATION: IAutoENVIModelerTest = {
  suiteName: 'Generic image registration workflow',
  fileName: 'image-registration.spec.ts',
  tests: [
    {
      name: 'for the happy path',
      nodes: [
        {
          id: 'inputs',
          type: 'inputparameters',
          parameters: [
            {
              name: 'base_raster',
              display_name: 'Base Raster (Reference)',
              description: 'Reference image with accurate georeferencing',
              type: 'ENVIRaster',
            },
            {
              name: 'warp_raster',
              display_name: 'Warp Raster',
              description: 'Image to be aligned to the base raster',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          id: 'gen_tiepoints',
          type: 'task',
          task_name: 'GenerateTiePointsByCrossCorrelation',
          comment: 'Automatically match features between base and warp images',
        },
        {
          id: 'filter_tiepoints',
          type: 'task',
          task_name: 'FilterTiePointsByGlobalTransform',
          comment: 'Remove outlier tie points using global transform',
        },
        {
          id: 'register',
          type: 'task',
          task_name: 'ImageToImageRegistration',
          static_input: {
            warping: 'Triangulation',
          },
          comment:
            'Warp the image to align with the base raster using Triangulation',
        },
        {
          id: 'outputs',
          type: 'outputparameters',
        },
      ],
      edges: [
        {
          from: 'inputs',
          from_parameters: ['base_raster'],
          to: 'gen_tiepoints',
          to_parameters: ['input_raster1'],
        },
        {
          from: 'inputs',
          from_parameters: ['warp_raster'],
          to: 'gen_tiepoints',
          to_parameters: ['input_raster2'],
        },
        {
          from: 'gen_tiepoints',
          from_parameters: ['output_tiepoints'],
          to: 'filter_tiepoints',
          to_parameters: ['input_tiepoints'],
        },
        {
          from: 'filter_tiepoints',
          from_parameters: ['output_tiepoints'],
          to: 'register',
          to_parameters: ['input_tiepoints'],
        },
        {
          from: 'register',
          from_parameters: ['output_raster'],
          to: 'outputs',
          to_parameters: [''],
        },
      ],
    },
  ],
};
