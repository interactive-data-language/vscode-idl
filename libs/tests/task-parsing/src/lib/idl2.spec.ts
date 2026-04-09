import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack, TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] idl`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/QueryAllTasks.task',
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'idlqueryalltaskstask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLQueryAllTasksTask',
          source: 'user',
          docs: "\nThis task returns a hash where each key is the task name and each task name key contains a hash of the task's properties.\n\n### Syntax\n\n```idl\n;+\n; :Returns: IDLTask<QueryAllTasks>\n;-\nmyTask = IDLTask('QueryAllTasks')\n\n; set input parameters\nmyTask.filter_tags = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\ntask_definitions = myTask.task_definitions\n\n```\n\n\n### Input Parameters\n\n- **filter_tags**: Array\\<String\\>\n\n  An array of tags to filter the tasks to query on. Only tasks that have all tags set in this array will be returned. The search is case-insensitive. Default is to perform no filtering.\n\n\n\n### Output Parameters\n\n- **task_definitions**: IDLTASKCATALOG\n\n  An IDLTaskCatalog hash that describes all tasks and their properties for each task.\n\n",
          private: false,
          returns: [
            {
              name: 'idlqueryalltaskstask',
              display: 'IDLTask<queryalltasks>',
              serialized: 'IDLTask<queryalltasks>',
              args: [
                [
                  {
                    name: 'queryalltasks',
                    display: 'queryalltasks',
                    serialized: 'queryalltasks',
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
        name: 'idlqueryalltaskstask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLQueryAllTasksTask',
          source: 'user',
          docs: "This task returns a hash where each key is the task name and each task name key contains a hash of the task's properties.\n\n\n### Properties\n\n- **filter_tags**: Array\\<String\\>\n\n  An array of tags to filter the tasks to query on. Only tasks that have all tags set in this array will be returned. The search is case-insensitive. Default is to perform no filtering.\n\n- **task_definitions**: IDLTASKCATALOG\n\n  An IDLTaskCatalog hash that describes all tasks and their properties for each task.\n\n",
          private: false,
          inherits: ['idltask'],
          docsLookup: {},
          props: {
            filter_tags: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'filter_tags',
              docs: 'An array of tags to filter the tasks to query on. Only tasks that have all tags set in this array will be returned. The search is case-insensitive. Default is to perform no filtering.',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: { dimensions: ['*'] },
                },
              ],
              req: false,
            },
            task_definitions: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'task_definitions',
              docs: 'An IDLTaskCatalog hash that describes all tasks and their properties for each task.',
              type: [
                {
                  name: 'IDLTASKCATALOG',
                  display: 'IDLTASKCATALOG',
                  serialized: 'IDLTASKCATALOG',
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
