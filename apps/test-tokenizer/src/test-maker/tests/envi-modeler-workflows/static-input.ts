import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_STATIC_INPUT: IAutoENVIModelerTest = {
  suiteName: 'Parameters with static input',
  fileName: 'static-input.1.spec.ts',
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
              name: 'input_raster',
              display_name: 'NBR Difference Raster',
              description:
                'Difference between pre-fire and post-fire Normalized Burn Ratio',
              type: 'ENVIRaster',
            },
          ],
          comment: 'NBR Difference Raster (decrease = burned area)',
        },
        {
          id: 'threshold',
          type: 'task',
          display_name: 'Detect Decrease Only',
          task_name: 'ChangeThresholdClassification',
          static_input: { increase_threshold: 100, decrease_threshold: -0.1 },
          comment: 'Step 1: Automatic thresholding for decrease only',
        },
        {
          id: 'sieve',
          type: 'task',
          display_name: 'Remove Small Clumps',
          task_name: 'ClassificationSieving',
          static_input: { minimum_size: 500 },
          comment: 'Step 2: Remove clumps ≤500 pixels',
        },
        {
          id: 'to_shapefile',
          type: 'task',
          display_name: 'Export Decrease Class',
          task_name: 'ClassificationToShapefile',
          static_input: { export_classes: ['Decrease'] },
          comment: 'Step 4: Generate shapefile for Decrease class only',
        },
        {
          id: 'reproject',
          type: 'task',
          display_name: 'Reproject to Web Mercator',
          task_name: 'ReprojectVector',
          static_input: {
            coord_sys: { factory: 'CoordSys', coord_sys_code: 3857 },
          },
          comment: 'Step 5: Reproject to EPSG:3857',
        },
        {
          id: 'smooth',
          type: 'task',
          display_name: 'Smooth Boundaries',
          task_name: 'SmoothVector',
          static_input: { smooth_factor: 15 },
          comment: 'Step 6: Reduce complexity with factor 15',
        },
        {
          id: 'output_params',
          type: 'outputparameters',
          display_name: 'Final Outputs',
        },
        {
          id: 'view_shapefile',
          type: 'view',
          display_name: 'Display Result',
        },
      ],
      edges: [
        {
          from: 'input_params',
          from_parameters: ['input_raster'],
          to: 'threshold',
          to_parameters: ['input_raster'],
        },
        {
          from: 'threshold',
          from_parameters: ['output_raster'],
          to: 'sieve',
          to_parameters: ['input_raster'],
        },
        {
          from: 'sieve',
          from_parameters: ['OUTPUT_RASTER'],
          to: 'to_shapefile',
          to_parameters: ['input_raster'],
        },
        {
          from: 'to_shapefile',
          from_parameters: ['output_vector'],
          to: 'reproject',
          to_parameters: ['input_vector'],
        },
        {
          from: 'reproject',
          from_parameters: ['output_vector'],
          to: 'smooth',
          to_parameters: ['input_vector'],
        },
        {
          from: 'smooth',
          from_parameters: ['output_vector'],
          to: 'output_params',
          to_parameters: [''],
        },
        {
          from: 'smooth',
          from_parameters: ['output_vector'],
          to: 'view_shapefile',
          to_parameters: ['input_vector'],
        },
      ],
    },
  ],
};
