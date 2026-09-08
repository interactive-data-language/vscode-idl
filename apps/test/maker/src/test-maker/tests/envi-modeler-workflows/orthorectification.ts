import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_ORTHORECTIFICATION: IAutoENVIModelerTest = {
  suiteName: 'Generic orthorectification workflow',
  fileName: 'orthorectification.spec.ts',
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
              description: 'RPC-based raster to orthorectify',
              type: 'ENVIRaster',
            },
            {
              name: 'dem_raster',
              display_name: 'DEM Raster',
              description: 'Digital elevation model for terrain correction',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          id: 'ortho',
          type: 'task',
          task_name: 'RPCOrthorectification',
          comment:
            'Remove terrain-induced distortions using RPC metadata and DEM',
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
          to: 'ortho',
          to_parameters: ['input_raster'],
        },
        {
          from: 'inputs',
          from_parameters: ['dem_raster'],
          to: 'ortho',
          to_parameters: ['dem_raster'],
        },
        {
          from: 'ortho',
          from_parameters: ['output_raster'],
          to: 'outputs',
          to_parameters: [''],
        },
      ],
    },
  ],
};
