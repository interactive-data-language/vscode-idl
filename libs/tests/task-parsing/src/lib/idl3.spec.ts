import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack, TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] idl`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath('idl/test/task-parsing/QueryTask.task');

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'idlquerytasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLQueryTaskTask',
          source: 'user',
          docs: "\nThis task returns a hash that describes the properties of an IDL task.\n\n### Syntax\n\n```idl\n;+\n; :Returns: IDLTask<QueryTask>\n;-\nmyTask = IDLTask('QueryTask')\n\n; set input parameters\nmyTask.task_name = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\ndefinition = myTask.definition\n\n```\n\n\n### Input Parameters\n\n- **task_name**: String\n\n  The name of a task that will be queried for its definition.\n\n\n\n### Output Parameters\n\n- **definition**: IDLTASKINFO\n\n  An IDLTaskInfo hash that describes the properties of an IDL task.\n\n",
          private: false,
          returns: [
            {
              name: 'idlquerytasktask',
              display: 'IDLTask<querytask>',
              serialized: 'IDLTask<querytask>',
              args: [
                [
                  {
                    name: 'querytask',
                    display: 'querytask',
                    serialized: 'querytask',
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
        name: 'idlquerytasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLQueryTaskTask',
          source: 'user',
          docs: 'This task returns a hash that describes the properties of an IDL task.\n\n\n### Properties\n\n- **task_name**: String\n\n  The name of a task that will be queried for its definition.\n\n- **definition**: IDLTASKINFO\n\n  An IDLTaskInfo hash that describes the properties of an IDL task.\n\n',
          private: false,
          inherits: ['idltask'],
          docsLookup: {},
          props: {
            task_name: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'task_name',
              docs: 'The name of a task that will be queried for its definition.',
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
            definition: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'definition',
              docs: 'An IDLTaskInfo hash that describes the properties of an IDL task.',
              type: [
                {
                  name: 'IDLTASKINFO',
                  display: 'IDLTASKINFO',
                  serialized: 'IDLTASKINFO',
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
