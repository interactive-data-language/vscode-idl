import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_DATASET_INDEX: IAutoENVIModelerTest = {
  suiteName: 'Spectral index computation (dataset index)',
  fileName: 'dataset-index.spec.ts',
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
              description:
                'Multi-spectral or hyperspectral raster with wavelength metadata',
              type: 'ENVIRaster',
            },
          ],
        },
        {
          id: 'spectral_index',
          type: 'task',
          task_name: 'SpectralIndex',
          static_input: {
            index: 'Normalized Difference Vegetation Index',
          },
          comment:
            'Compute NDVI to highlight vegetation; use QuerySpectralIndices to discover available indices for your raster',
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
          to: 'spectral_index',
          to_parameters: ['input_raster'],
        },
        {
          from: 'spectral_index',
          from_parameters: ['output_raster'],
          to: 'outputs',
          to_parameters: [''],
        },
      ],
    },
  ],
};
