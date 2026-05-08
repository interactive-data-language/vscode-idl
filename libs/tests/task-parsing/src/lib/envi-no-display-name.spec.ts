import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { TaskToGlobalToken } from '@idl/parsing/tasks';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task without display_name`, () => {
  it(`[auto generated] envi`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/test_task_no_display_name_envi.task',
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'envimy_envi_test_tasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVImy_envi_test_taskTask',
          source: 'user',
          docs: "\nA test ENVI task without display_name to verify fallback logic.\n\n### Syntax\n\n```idl\n;+\n; :Returns: ENVITask<my_envi_test_task>\n;-\nmyTask = ENVITask('my_envi_test_task')\n\n; set input parameters\nmyTask.input_raster = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\n\n```\n\n\n### Input Parameters\n\n- **input_raster**: ENVIRaster\n\n  A test input raster parameter.\n\n",
          private: false,
          returns: [
            {
              name: 'envimy_envi_test_tasktask',
              display: 'ENVITask<my_envi_test_task>',
              serialized: 'ENVITask<my_envi_test_task>',
              args: [
                [
                  {
                    name: 'my_envi_test_task',
                    display: 'my_envi_test_task',
                    serialized: 'my_envi_test_task',
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
        name: 'envimy_envi_test_tasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVImy_envi_test_taskTask',
          readableName: 'My Envi Test Task',
          source: 'user',
          docs: 'A test ENVI task without display_name to verify fallback logic.\n\n\n### Properties\n\n- **input_raster**: ENVIRaster\n\n  A test input raster parameter.\n\n',
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
              docs: 'A test input raster parameter.',
              type: [
                {
                  name: 'ENVIRaster',
                  display: 'ENVIRaster',
                  serialized: 'ENVIRaster',
                  args: [],
                  meta: {},
                },
              ],
              req: true,
            },
          },
        },
      },
    };

    // verify results
    expect(expected).toEqual(TaskToGlobalToken(task));
  });
});
