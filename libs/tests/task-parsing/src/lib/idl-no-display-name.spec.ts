import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { TaskToGlobalToken } from '@idl/parsing/tasks';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task without display_name`, () => {
  it(`[auto generated] idl`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/test_task_no_display_name_idl.task',
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'idlmy_test_tasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLmy_test_taskTask',
          source: 'user',
          docs: "\nA test task without display_name to verify fallback logic.\n\n### Syntax\n\n```idl\n;+\n; :Returns: IDLTask<my_test_task>\n;-\nmyTask = IDLTask('my_test_task')\n\n; set input parameters\nmyTask.input_value = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\n\n```\n\n\n### Input Parameters\n\n- **input_value**: String\n\n  A test input parameter.\n\n",
          private: false,
          returns: [
            {
              name: 'idlmy_test_tasktask',
              display: 'IDLTask<my_test_task>',
              serialized: 'IDLTask<my_test_task>',
              args: [
                [
                  {
                    name: 'my_test_task',
                    display: 'my_test_task',
                    serialized: 'my_test_task',
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
        name: 'idlmy_test_tasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLmy_test_taskTask',
          readableName: 'My Test Task',
          source: 'user',
          docs: 'A test task without display_name to verify fallback logic.\n\n\n### Properties\n\n- **input_value**: String\n\n  A test input parameter.\n\n',
          private: false,
          inherits: ['idltask'],
          docsLookup: {},
          props: {
            input_value: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'input_value',
              readableName: 'Input Value',
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
