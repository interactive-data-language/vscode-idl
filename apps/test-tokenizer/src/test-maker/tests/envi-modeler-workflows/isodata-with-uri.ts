import { IAutoENVIModelerTest } from '../../tests.interface';

export const AUTO_ENVI_MODELER_TEST_ISODATA_WITH_URI: IAutoENVIModelerTest = {
  suiteName: 'ISODATA classification with output URI',
  fileName: 'isodata-with-uri.spec.ts',
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
                'Raster to classify using ISODATA unsupervised method',
              type: 'ENVIRaster',
            },
            {
              name: 'output_raster_uri',
              display_name: 'Output Raster URI',
              description:
                'Fully-qualified path for the output classification raster',
              type: 'String',
            },
          ],
        },
        {
          id: 'isodata',
          type: 'task',
          task_name: 'ISODATAClassification',
          comment:
            'Cluster pixels into classes using the ISODATA unsupervised algorithm',
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
          to: 'isodata',
          to_parameters: ['input_raster'],
        },
        {
          from: 'inputs',
          from_parameters: ['output_raster_uri'],
          to: 'isodata',
          to_parameters: ['output_raster_uri'],
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
