import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_DATAMANAGER_VIEW_VALIDATION: IAutoENVIModelerTest =
  {
    suiteName: 'DataManager and View node validation',
    fileName: 'datamanager-view-validation.spec.ts',
    tests: [
      {
        name: 'allows valid types for datamanager (ENVIRaster)',
        nodes: [
          {
            id: 'input_params',
            type: 'inputparameters',
            parameters: [
              {
                name: 'input_raster',
                display_name: 'Input Raster',
                description: 'A raster',
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
          },
          {
            id: 'datamanager',
            type: 'datamanager',
          },
        ],
        edges: [
          {
            from: 'input_params',
            from_parameters: ['input_raster'],
            to: 'spectral_index',
            to_parameters: ['input_raster'],
          },
          {
            from: 'spectral_index',
            from_parameters: ['output_raster'],
            to: 'datamanager',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'rejects invalid types for datamanager (String)',
        nodes: [
          {
            id: 'task1',
            type: 'task',
            task_name: 'QuerySpectralIndices',
          },
          {
            id: 'datamanager',
            type: 'datamanager',
          },
        ],
        edges: [
          {
            from: 'task1',
            from_parameters: ['index_info'],
            to: 'datamanager',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'allows valid types for view (ENVIRaster)',
        nodes: [
          {
            id: 'input_params',
            type: 'inputparameters',
            parameters: [
              {
                name: 'input_raster',
                display_name: 'Input Raster',
                description: 'A raster',
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
          },
          {
            id: 'view',
            type: 'view',
          },
        ],
        edges: [
          {
            from: 'input_params',
            from_parameters: ['input_raster'],
            to: 'spectral_index',
            to_parameters: ['input_raster'],
          },
          {
            from: 'spectral_index',
            from_parameters: ['output_raster'],
            to: 'view',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'allows String type for view',
        nodes: [
          {
            id: 'task1',
            type: 'task',
            task_name: 'QuerySpectralIndices',
          },
          {
            id: 'view',
            type: 'view',
          },
        ],
        edges: [
          {
            from: 'task1',
            from_parameters: ['index_info'],
            to: 'view',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'rejects invalid types for view (Hash)',
        nodes: [
          {
            id: 'input_params',
            type: 'inputparameters',
            parameters: [
              {
                name: 'input_raster',
                display_name: 'Input Raster',
                description: 'A raster',
                type: 'ENVIRaster',
              },
            ],
          },
          {
            id: 'raster_metadata',
            type: 'task',
            task_name: 'RasterMetadata',
          },
          {
            id: 'view',
            type: 'view',
          },
        ],
        edges: [
          {
            from: 'input_params',
            from_parameters: ['input_raster'],
            to: 'raster_metadata',
            to_parameters: ['input_raster'],
          },
          {
            from: 'raster_metadata',
            from_parameters: ['metadata'],
            to: 'view',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'allows multiple connections to datamanager',
        nodes: [
          {
            id: 'input_params',
            type: 'inputparameters',
            parameters: [
              {
                name: 'raster1',
                display_name: 'Raster 1',
                description: 'First raster',
                type: 'ENVIRaster',
              },
              {
                name: 'raster2',
                display_name: 'Raster 2',
                description: 'Second raster',
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
          },
          {
            id: 'si2',
            type: 'task',
            task_name: 'SpectralIndex',
            static_input: {
              index: 'Normalized Difference Vegetation Index',
            },
          },
          {
            id: 'datamanager',
            type: 'datamanager',
          },
        ],
        edges: [
          {
            from: 'input_params',
            from_parameters: ['raster1'],
            to: 'si1',
            to_parameters: ['input_raster'],
          },
          {
            from: 'input_params',
            from_parameters: ['raster2'],
            to: 'si2',
            to_parameters: ['input_raster'],
          },
          {
            from: 'si1',
            from_parameters: ['output_raster'],
            to: 'datamanager',
            to_parameters: [''],
          },
          {
            from: 'si2',
            from_parameters: ['output_raster'],
            to: 'datamanager',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'allows ENVIVector for datamanager',
        nodes: [
          {
            id: 'input_params',
            type: 'inputparameters',
            parameters: [
              {
                name: 'input_vector',
                display_name: 'Input Vector',
                description: 'A vector',
                type: 'ENVIVector',
              },
            ],
          },
          {
            id: 'buffer',
            type: 'task',
            task_name: 'VectorRecordsToBoundingBox',
          },
          {
            id: 'datamanager',
            type: 'datamanager',
          },
        ],
        edges: [
          {
            from: 'input_params',
            from_parameters: ['input_vector'],
            to: 'buffer',
            to_parameters: ['input_vector'],
          },
          {
            from: 'buffer',
            from_parameters: ['output_vector'],
            to: 'datamanager',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'allows numeric types for view',
        nodes: [
          {
            id: 'input_params',
            type: 'inputparameters',
            parameters: [
              {
                name: 'input_raster',
                display_name: 'Input Raster',
                description: 'A raster',
                type: 'ENVIRaster',
              },
            ],
          },
          {
            id: 'stats',
            type: 'task',
            task_name: 'CalculateRasterStatistics',
          },
          {
            id: 'view',
            type: 'view',
          },
        ],
        edges: [
          {
            from: 'input_params',
            from_parameters: ['input_raster'],
            to: 'stats',
            to_parameters: ['input_raster'],
          },
          {
            from: 'stats',
            from_parameters: ['max'],
            to: 'view',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'rejects array type for view',
        nodes: [
          {
            id: 'task1',
            type: 'task',
            task_name: 'DiceRasterByTileCount',
          },
          {
            id: 'view',
            type: 'view',
          },
        ],
        edges: [
          {
            from: 'task1',
            from_parameters: ['output_raster'],
            to: 'view',
            to_parameters: [''],
          },
        ],
      },
      {
        name: 'rejects array type for data manager',
        nodes: [
          {
            id: 'task1',
            type: 'task',
            task_name: 'DiceRasterByTileCount',
          },
          {
            id: 'dm',
            type: 'datamanager',
          },
        ],
        edges: [
          {
            from: 'task1',
            from_parameters: ['output_raster'],
            to: 'dm',
            to_parameters: [''],
          },
        ],
      },
    ],
  };
