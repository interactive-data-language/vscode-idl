import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { TaskToGlobalToken } from '@idl/parsing/tasks';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task without displayName`, () => {
  it(`[auto generated] envi`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/test_task_no_display_name_legacy.task',
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'envimylegacytesttasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVIMyLegacyTestTaskTask',
          source: 'user',
          docs: "\nA test legacy ENVI task without displayName to verify fallback logic.\n\n### Syntax\n\n```idl\n;+\n; :Returns: ENVITask<MyLegacyTestTask>\n;-\nmyTask = ENVITask('MyLegacyTestTask')\n\n; set input parameters\nmyTask.input_value = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\n\n```\n\n\n### Input Parameters\n\n- **input_value**: String\n\n  A test input parameter.\n\n",
          private: false,
          returns: [
            {
              name: 'envimylegacytesttasktask',
              display: 'ENVITask<mylegacytesttask>',
              serialized: 'ENVITask<mylegacytesttask>',
              args: [
                [
                  {
                    name: 'mylegacytesttask',
                    display: 'mylegacytesttask',
                    serialized: 'mylegacytesttask',
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
        name: 'envimylegacytesttasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'ENVIMyLegacyTestTaskTask',
          source: 'user',
          docs: 'A test legacy ENVI task without displayName to verify fallback logic.\n\n\n### Properties\n\n- **input_value**: String\n\n  A test input parameter.\n\n',
          readableName: 'My Legacy Test Task',
          private: false,
          inherits: ['envitask'],
          docsLookup: {},
          props: {
            input_value: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'input_value',
              docs: 'A test input parameter.',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
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
