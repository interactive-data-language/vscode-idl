import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack, TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] envi`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/maskfxrasterstats.task',
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'envimaskfxrasterstatstask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVIMaskFXRasterStatsTask',
          source: 'user',
          docs: "\nSimple task that changes the VALID_DATA array of the FX raster statistics based on simple thresholding options. It returns a modified copy of the original statistics with updates segment flags.\n\n### Syntax\n\n```idl\n;+\n; :Returns: ENVITask<MaskFXRasterStats>\n;-\nmyTask = ENVITask('MaskFXRasterStats')\n\n; set input parameters\nmyTask.input_stats = value\nmyTask.mean_max = value\nmyTask.mean_min = value\nmyTask.size_max = value\nmyTask.size_min = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\noutput_stats = myTask.output_stats\n\n```\n\n\n### Input Parameters\n\n- **input_stats**: Hash\\<any\\>\n\n  Specify the previously calculated FX statistics that you want to apply masking to.\n\n- **mean_max**: Double\n\n  Specify the upper bound for the mean pixel value that can exist for each segment.\n\n- **mean_min**: Double\n\n  Specify the lower bound for the mean pixel value that can exist for each segment.\n\n- **size_max**: Double\n\n  Specify the maximum size that a segment can be. Assumed units are in m^2. If no spatial reference is present then units are assumed to be pixels.\n\n- **size_min**: Double\n\n  Specify the minimum size that a segment can be. Assumed units are in m^2. If no spatial reference is present then units are assumed to be pixels.\n\n\n\n### Output Parameters\n\n- **output_stats**: Hash\\<any\\>\n\n  A reference to the masked raster statistics.\n\n",
          private: false,
          returns: [
            {
              name: 'envimaskfxrasterstatstask',
              display: 'ENVITask<maskfxrasterstats>',
              serialized: 'ENVITask<maskfxrasterstats>',
              args: [
                [
                  {
                    name: 'maskfxrasterstats',
                    display: 'maskfxrasterstats',
                    serialized: 'maskfxrasterstats',
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
      structure: {
        type: 's',
        name: 'envimaskfxrasterstatstask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVIMaskFXRasterStatsTask',
          source: 'user',
          docs: 'Simple task that changes the VALID_DATA array of the FX raster statistics based on simple thresholding options. It returns a modified copy of the original statistics with updates segment flags.\n\n\n### Properties\n\n- **input_stats**: Hash\\<any\\>\n\n  Specify the previously calculated FX statistics that you want to apply masking to.\n\n- **mean_max**: Double\n\n  Specify the upper bound for the mean pixel value that can exist for each segment.\n\n- **mean_min**: Double\n\n  Specify the lower bound for the mean pixel value that can exist for each segment.\n\n- **output_stats**: Hash\\<any\\>\n\n  A reference to the masked raster statistics.\n\n- **size_max**: Double\n\n  Specify the maximum size that a segment can be. Assumed units are in m^2. If no spatial reference is present then units are assumed to be pixels.\n\n- **size_min**: Double\n\n  Specify the minimum size that a segment can be. Assumed units are in m^2. If no spatial reference is present then units are assumed to be pixels.\n\n',
          readableName: 'Mask FX Raster Stats',
          private: false,
          inherits: ['envitask'],
          docsLookup: {},
          props: {
            input_stats: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'input_stats',
              docs: 'Specify the previously calculated FX statistics that you want to apply masking to.',
              type: [
                {
                  name: 'Hash',
                  display: 'Hash<any>',
                  serialized: 'Hash<any>',
                  args: [
                    [
                      {
                        display: 'any',
                        name: 'any',
                        serialized: 'any',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              req: true,
            },
            mean_max: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'mean_max',
              docs: 'Specify the upper bound for the mean pixel value that can exist for each segment.',
              type: [
                {
                  name: 'Double',
                  display: 'Double',
                  serialized: 'Double',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            mean_min: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'mean_min',
              docs: 'Specify the lower bound for the mean pixel value that can exist for each segment.',
              type: [
                {
                  name: 'Double',
                  display: 'Double',
                  serialized: 'Double',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            output_stats: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'output_stats',
              docs: 'A reference to the masked raster statistics.',
              type: [
                {
                  name: 'Hash',
                  display: 'Hash<any>',
                  serialized: 'Hash<any>',
                  args: [
                    [
                      {
                        display: 'any',
                        name: 'any',
                        serialized: 'any',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              req: true,
            },
            size_max: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'size_max',
              docs: 'Specify the maximum size that a segment can be. Assumed units are in m^2. If no spatial reference is present then units are assumed to be pixels.',
              type: [
                {
                  name: 'Double',
                  display: 'Double',
                  serialized: 'Double',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
            size_min: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'size_min',
              docs: 'Specify the minimum size that a segment can be. Assumed units are in m^2. If no spatial reference is present then units are assumed to be pixels.',
              type: [
                {
                  name: 'Double',
                  display: 'Double',
                  serialized: 'Double',
                  args: [],
                  meta: {},
                },
              ],
              req: false,
            },
          },
        },
      },
    };

    // verify results
    expect(expected).toEqual(TaskToGlobalToken(task));
  });
});
