import { GetExtensionPath } from '@idl/idl/files';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { TaskToGlobalToken } from '@idl/parsing/tasks';
import { LoadTask } from '@idl/schemas/tasks';
import { IGlobalsToTrack } from '@idl/types/tasks';

describe(`[auto generated] Correctly parse task file`, () => {
  it(`[auto generated] idl`, async () => {
    // specify reference filepath
    const filepath = GetExtensionPath(
      'idl/test/task-parsing/addition_example.task',
    );

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // define expected local variables
    const expected: IGlobalsToTrack = {
      function: {
        type: 'f',
        name: 'idladdition_exampletask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLaddition_exampleTask',
          source: 'user',
          docs: "\nReturns the sum of a and b.\n\n### Syntax\n\n```idl\n;+\n; :Returns: IDLTask<addition_example>\n;-\nmyTask = IDLTask('addition_example')\n\n; set input parameters\nmyTask.a = value\nmyTask.b = value\n\n; run the task\nmyTask.execute\n\n; get output parameters\nc = myTask.c\n\n```\n\n\n### Input Parameters\n\n- **a**: Int\n\n  \n\n- **b**: Int\n\n  \n\n\n\n### Output Parameters\n\n- **c**: Int\n\n  \n\n",
          private: false,
          returns: [
            {
              name: 'idladdition_exampletask',
              display: 'IDLTask<addition_example>',
              serialized: 'IDLTask<addition_example>',
              args: [
                [
                  {
                    name: 'addition_example',
                    display: 'addition_example',
                    serialized: 'addition_example',
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
        name: 'idladdition_exampletask',
        pos: [0, 0, 0],
        meta: {
          display: 'IDLaddition_exampleTask',
          readableName: 'Addition Example',
          source: 'user',
          docs: 'Returns the sum of a and b.\n\n\n### Properties\n\n- **a**: Int\n\n  \n\n- **b**: Int\n\n  \n\n- **c**: Int\n\n  \n\n',
          private: false,
          inherits: ['idltask'],
          docsLookup: {},
          props: {
            a: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'a',
              readableName: 'A',
              docs: '',
              type: [
                {
                  name: 'Int',
                  display: 'Int',
                  serialized: 'Int',
                  args: [],
                  meta: {},
                },
              ],
              req: true,
            },
            b: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'in',
              private: false,
              display: 'b',
              readableName: 'B',
              docs: '',
              type: [
                {
                  name: 'Int',
                  display: 'Int',
                  serialized: 'Int',
                  args: [],
                  meta: {},
                },
              ],
              req: true,
            },
            c: {
              source: 'user',
              code: true,
              pos: [0, 0, 0],
              direction: 'out',
              private: false,
              display: 'c',
              readableName: 'C',
              docs: '',
              type: [
                {
                  name: 'Int',
                  display: 'Int',
                  serialized: 'Int',
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
