import { CancellationToken } from '@idl/cancellation-tokens';
import {
  GenerateENVITask,
  GenerateENVITaskMainLevelProgram,
} from '@idl/generators/envi-task';
import {
  GenerateIDLTask,
  GenerateIDLTaskMainLevelProgram,
} from '@idl/generators/idl-task';
import { GenerateTaskResult } from '@idl/generators/tasks-shared';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { ITaskGenerationTest } from '../tests.interface';

/**
 * Generates tests to verify hover help works as expected
 */
export async function TestsForTaskGeneration(
  name: string,
  tests: ITaskGenerationTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { CancellationToken } from '@idl/cancellation-tokens';`);
  strings.push(
    `import { GenerateENVITask, GenerateENVITaskMainLevelProgram, } from '@idl/generators/envi-task';`
  );
  strings.push(
    `import { GenerateIDLTask, GenerateIDLTaskMainLevelProgram, } from '@idl/generators/idl-task';`
  );
  strings.push(
    `import { GenerateTaskResult } from '@idl/generators/tasks-shared';`
  );
  strings.push(`import { LogManager } from '@idl/logger';`);
  strings.push(
    `import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';`
  );
  strings.push(`import { LoadTask } from '@idl/schemas/tasks';`);
  strings.push(`import { GetExtensionPath } from '@idl/shared';`);
  strings.push(`import { readFileSync } from 'fs';`);
  strings.push(``);
  strings.push(`IDL_INDEX_OPTIONS.IS_TEST = true;`);
  strings.push(``);

  // add the basic code for our test
  strings.push(`describe(\`[auto generated] ${name}\`, () => {`);

  // process each test
  for (let i = 0; i < tests.length; i++) {
    // extract information about our test
    const test = tests[i];
    const testName = test.name;

    // create our index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // add our tokens
    strings.push(`  it(\`[auto generated] ${testName}\`, async () => {`);
    strings.push(`    // create index`);
    strings.push(`    const index = new IDLIndex(`);
    strings.push(`      new LogManager({`);
    strings.push(`        alert: () => {`);
    strings.push(`          // do nothing`);
    strings.push(`        },`);
    strings.push(`      }),`);
    strings.push(`      0`);
    strings.push(`    );`);
    strings.push(``);

    // get fully-qualified filepath
    const filepath = GetExtensionPath(test.file);

    // tokenize
    const parsed = await index.getParsedProCode(
      filepath,
      readFileSync(filepath, 'utf-8'),
      new CancellationToken(),
      { postProcess: true }
    );

    strings.push(`    // specify type of task`);
    strings.push(`    const taskType = '${test.type}' as string`);
    strings.push(``);

    // specify file and index
    strings.push(`    // specify filepath`);
    strings.push(`    const filepath = GetExtensionPath('${test.file}')`);
    strings.push(``);
    strings.push(`    // add file to index`);
    strings.push(
      `    const parsed = await index.getParsedProCode(filepath, readFileSync(filepath, 'utf-8'), new CancellationToken(), {postProcess: true});`
    );
    strings.push(``);

    /**
     * Make our task
     */
    const result =
      test.type === 'envi'
        ? await GenerateENVITask(filepath, parsed)
        : await GenerateIDLTask(filepath, parsed);

    strings.push(`    // make our task`);
    strings.push(
      `    const result = taskType === 'envi' ? await GenerateENVITask(filepath, parsed) : await GenerateIDLTask(filepath, parsed)`
    );
    strings.push(``);

    // determine how to generate our tasks
    if (result.success) {
      strings.push(`    // verify success`);
      strings.push(`    expect(result.success).toBeTruthy()`);
      strings.push(``);

      /** Get actual task */
      const task = (result as GenerateTaskResult<true>).task;

      strings.push(`    // define expected task`);
      strings.push(`    const expectedTask = ${JSON.stringify(task)}`);
      strings.push(``);
      strings.push(`    // verify results`);
      strings.push(
        `    expect((result as GenerateTaskResult<true>).task).toEqual(expectedTask)`
      );
      strings.push(``);

      // make main level program
      const mainAdd =
        test.type === 'envi'
          ? GenerateENVITaskMainLevelProgram(result as GenerateTaskResult<true>)
          : GenerateIDLTaskMainLevelProgram(result as GenerateTaskResult<true>);

      strings.push(`    // define expected main`);
      strings.push(
        `    const expectedMain = ${JSON.stringify(mainAdd.split('\n'))}`
      );
      strings.push(``);
      strings.push(`    // make our main level program`);
      strings.push(
        `    const mainAdd = taskType === 'envi' ? GenerateENVITaskMainLevelProgram(result as GenerateTaskResult<true>) : GenerateIDLTaskMainLevelProgram(result as GenerateTaskResult<true>)`
      );
      strings.push(``);
      strings.push(`    // verify result`);
      strings.push(`    expect(mainAdd.split('\\n')).toEqual(expectedMain)`);
      strings.push(``);
      strings.push(`    // verify we can parse our created task`);
      strings.push(
        `   await LoadTask('mytask.task', (result as GenerateTaskResult<true>).formattedTask)`
      );
    } else {
      strings.push(`    // verify failure`);
      strings.push(`    expect(result.success).toBeFalsy()`);
      strings.push(``);
      strings.push(`    // verify reason`);
      strings.push(
        `    expect((result as GenerateTaskResult<false>).failureReason).toEqual('${
          (result as GenerateTaskResult<false>).failureReason
        }')`
      );
    }

    strings.push('  })');
    strings.push(``);
  }

  // close
  strings.push(`});`);
  strings.push(``);

  // write to disk
  writeFileSync(uri, strings.join('\n'));
}
