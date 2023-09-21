import { CancellationToken } from '@idl/cancellation-tokens';
import { GenerateENVITask } from '@idl/generators/envi-task';
import { GenerateIDLTask } from '@idl/generators/idl-task';
import { GenerateTaskResult } from '@idl/generators/tasks-shared';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFileSync } from 'fs';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Don't make IDL Task`, () => {
  it(`[auto generated] because of missing PRO definition`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify type of task
    const taskType = 'idl' as string;

    // specify filepath
    const filepath = GetExtensionPath('idl/test/task-generation/empty_idl.pro');

    // add file to index
    const parsed = await index.getParsedProCode(
      filepath,
      readFileSync(filepath, 'utf-8'),
      new CancellationToken(),
      { postProcess: true }
    );

    // make our task
    const result =
      taskType === 'envi'
        ? await GenerateENVITask(filepath, parsed)
        : await GenerateIDLTask(filepath, parsed);

    // verify failure
    expect(result.success).toBeFalsy();

    // verify reason
    expect((result as GenerateTaskResult<false>).failureReason).toEqual(
      'No procedure definition found with the base name of the PRO file (required to create a task)'
    );
  });
});
