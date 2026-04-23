import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_SPECTRAL_INDEX_ISODATA: IAutoENVIModelerTest =
  {
    suiteName: 'Spectral index + layer stack + ISODATA classification workflow',
    fileName: 'spectral-index-isodata.spec.ts',
    tests: [
      {
        name: 'for the happy path',
        nodes: [
          {
            id: 'inputs',
            type: 'inputparameters',
            parameters: [
              {
                name: 'raster1',
                display_name: 'Raster 1',
                description:
                  'First input raster for spectral index computation',
                type: 'ENVIRaster',
              },
              {
                name: 'raster2',
                display_name: 'Raster 2',
                description:
                  'Second input raster for spectral index computation',
                type: 'ENVIRaster',
              },
              {
                name: 'raster3',
                display_name: 'Raster 3',
                description:
                  'Third input raster for spectral index computation',
                type: 'ENVIRaster',
              },
            ],
          },
          {
            id: 'si1',
            type: 'task',
            task_name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
            comment: 'Compute NDVI for Raster 1',
          },
          {
            id: 'si2',
            type: 'task',
            task_name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
            comment: 'Compute NDVI for Raster 2',
          },
          {
            id: 'si3',
            type: 'task',
            task_name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
            comment: 'Compute NDVI for Raster 3',
          },
          {
            id: 'layerstack',
            type: 'task',
            task_name: 'BuildLayerStack',
            comment:
              'Stack all three spectral index rasters into a single multi-band image',
          },
          {
            id: 'isodata',
            type: 'task',
            task_name: 'ISODATAClassification',
            comment:
              'Unsupervised classification of the stacked spectral indices',
          },
          {
            id: 'datamanager',
            type: 'datamanager',
          },
          {
            id: 'outputs',
            type: 'outputparameters',
          },
        ],
        edges: [
          {
            from: 'inputs',
            from_parameters: ['raster1'],
            to: 'si1',
            to_parameters: ['input_raster'],
          },
          {
            from: 'inputs',
            from_parameters: ['raster2'],
            to: 'si2',
            to_parameters: ['input_raster'],
          },
          {
            from: 'inputs',
            from_parameters: ['raster3'],
            to: 'si3',
            to_parameters: ['input_raster'],
          },
          {
            from: 'si1',
            from_parameters: ['output_raster'],
            to: 'layerstack',
            to_parameters: ['input_rasters'],
          },
          {
            from: 'si2',
            from_parameters: ['output_raster'],
            to: 'layerstack',
            to_parameters: ['input_rasters'],
          },
          {
            from: 'si3',
            from_parameters: ['output_raster'],
            to: 'layerstack',
            to_parameters: ['input_rasters'],
          },
          {
            from: 'layerstack',
            from_parameters: ['output_raster'],
            to: 'isodata',
            to_parameters: ['input_raster'],
          },
          {
            from: 'isodata',
            from_parameters: ['output_raster'],
            to: 'datamanager',
            to_parameters: [''],
          },
          {
            from: 'isodata',
            from_parameters: ['output_raster'],
            to: 'outputs',
            to_parameters: [''],
          },
        ],
      },
    ],
  };
