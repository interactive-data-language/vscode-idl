import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_SELECTIVE_DOWNSAMPLING: IAutoENVIModelerTest =
  {
    suiteName: 'Selective downsampling of imagery',
    fileName: 'selective-downsampling.spec.ts',
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
                description: 'Source raster to process',
                type: 'ENVIRaster',
              },
              {
                name: 'mask_roi',
                display_name: 'Mask ROI',
                description:
                  'ROI identifying the regions to selectively downsample',
                type: 'ENVIROIArray',
              },
            ],
          },
          {
            id: 'downsample',
            type: 'task',
            task_name: 'PixelScaleResampleRaster',
            static_input: {
              pixel_scale: [4, 4],
              resampling: 'Nearest Neighbor',
            },
            comment:
              'Downsample to coarse resolution to create a blocky appearance',
          },
          {
            id: 'roi_mask',
            type: 'task',
            task_name: 'ROIMaskRaster',
            static_input: {
              data_ignore_value: 0,
            },
            comment:
              'Apply ROI mask so only the target regions show the downsampled result',
          },
          {
            id: 'mosaic',
            type: 'task',
            task_name: 'BuildMosaicRaster',
            comment:
              'Composite the masked downsampled raster on top of the original; masked raster MUST be first',
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
            to: 'downsample',
            to_parameters: ['input_raster'],
          },
          {
            from: 'downsample',
            from_parameters: ['output_raster'],
            to: 'roi_mask',
            to_parameters: ['input_raster'],
          },
          {
            from: 'inputs',
            from_parameters: ['mask_roi'],
            to: 'roi_mask',
            to_parameters: ['input_mask_roi'],
          },
          {
            from: 'roi_mask',
            from_parameters: ['output_raster'],
            to: 'mosaic',
            to_parameters: ['input_rasters'],
          },
          {
            from: 'inputs',
            from_parameters: ['input_raster'],
            to: 'mosaic',
            to_parameters: ['input_rasters'],
          },
          {
            from: 'mosaic',
            from_parameters: ['output_raster'],
            to: 'outputs',
            to_parameters: [''],
          },
        ],
      },
    ],
  };
