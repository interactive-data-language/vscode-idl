import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { GetExtensionPath } from '@idl/shared';
import { GlobalTokens } from '@idl/types/core';
import { TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] envi`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/ExportRasterToCADRG.task'
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: GlobalTokens = [
      {
        type: 's',
        name: 'enviexportrastertocadrgtask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVIExportRasterToCADRGTask',
          source: 'user',
          docs: 'This task exports a 3-band, byte image to the CADRG format.',
          private: false,
          inherits: ['envitask'],
          docsLookup: {},
          props: {
            input_raster: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'input_raster',
              docs: 'Specify a 3-band, byte raster to export to the CADRG format.',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
            },
            scale: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'scale',
              docs: 'Specify the scale of the CADRG files.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            classification: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'classification',
              docs: 'Specify the classification level of the CADRG files.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            producer_code: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'producer_code',
              docs: 'Specify the producer code of the CADRG files.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            release_code: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'release_code',
              docs: 'Specify the release code of the CADRG files.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            country_code: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'country_code',
              docs: 'Specify the country code of the CADRG files.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            originating_station_id: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'originating_station_id',
              docs: 'Specify the Originating Station ID tag used by NITF.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            originator_name: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'originator_name',
              docs: "Specify the Originator's Name tag used by NITF.",
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            output_directory: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'output_directory',
              docs: 'Directory in which the resulting CADRG files will be written.',
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
            },
            output_raster: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'output_raster',
              docs: 'This is an array of one or more rasters produced by the export.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<ENVIRASTER>',
                  args: [
                    [
                      {
                        name: 'ENVIRASTER',
                        display: 'ENVIRASTER',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
            },
          },
        },
      },
      {
        type: 'f',
        name: 'enviexportrastertocadrgtask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVIExportRasterToCADRGTask',
          source: 'user',
          docs: 'This task exports a 3-band, byte image to the CADRG format.',
          private: false,
          returns: [
            {
              name: 'enviexportrastertocadrgtask',
              display: 'ENVITask<exportrastertocadrg>',
              args: [
                [
                  {
                    name: 'exportrastertocadrg',
                    display: 'exportrastertocadrg',
                    args: [],
                    meta: {},
                  },
                ],
              ],
              meta: {},
            },
          ],
          args: {},
          kws: {},
          docsLookup: {},
          struct: [],
        },
      },
    ];

    // verify results
    expect(expected).toEqual(TaskToGlobalToken(task));
  });
});
