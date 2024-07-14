import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { GetExtensionPath } from '@idl/shared';
import { GlobalTokens } from '@idl/types/core';
import { TaskToGlobalToken } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] idl`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath('idl/test/task-parsing/QueryTask.task');

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: GlobalTokens = [
      {
        type: 's',
        name: 'idlquerytasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLQueryTaskTask',
          source: 'user',
          docs: 'This task returns a hash that describes the properties of an IDL task.',
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
              type: [{ name: 'String', display: 'String', args: [], meta: {} }],
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
        name: 'idlquerytasktask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLQueryTaskTask',
          source: 'user',
          docs: 'This task returns a hash that describes the properties of an IDL task.',
          private: false,
          returns: [
            {
              name: 'idlquerytasktask',
              display: 'IDLTask<querytask>',
              args: [
                [
                  {
                    name: 'querytask',
                    display: 'querytask',
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
