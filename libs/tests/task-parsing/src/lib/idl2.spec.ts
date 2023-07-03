import { GlobalTokens } from '@idl/data-types/core';
import { TaskToGlobalToken } from '@idl/data-types/tasks';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { GetExtensionPath } from '@idl/shared';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] idl`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/QueryAllTasks.task'
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: GlobalTokens = [
      {
        type: 's',
        name: 'idlqueryalltaskstask',
        pos: [0, 0, 0],
        meta: {
          display: 'idlqueryalltaskstask',
          source: 'user',
          docs: "This task returns a hash where each key is the task name and each task name key contains a hash of the task's properties.",
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
                  args: [
                    [{ name: 'String', display: 'String', args: [], meta: {} }],
                  ],
                  meta: {},
                },
              ],
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
                  args: [],
                  meta: {},
                },
              ],
            },
          },
        },
      },
      {
        type: 'f',
        name: 'idlqueryalltaskstask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLQueryAllTasksTask',
          source: 'user',
          docs: "This task returns a hash where each key is the task name and each task name key contains a hash of the task's properties.",
          private: false,
          returns: [
            {
              name: 'idlqueryalltaskstask',
              display: 'IDLTask<queryalltasks>',
              args: [
                [
                  {
                    name: 'queryalltasks',
                    display: 'queryalltasks',
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
