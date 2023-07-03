import { GlobalTokens } from '@idl/data-types/core';
import { TaskToGlobalToken } from '@idl/data-types/tasks';
import { ResetGlobalDisplayNames } from '@idl/parsing/index';
import { LoadTask } from '@idl/schemas/tasks';
import { GetExtensionPath } from '@idl/shared';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ITaskParsingTest } from '../tests.interface';

/**
 * Generates automated tests verifying our local, global, and compile options are set.
 *
 * As part of this, we export our local items (i.e. variables) which contains
 * type information.
 */
export async function TestsForTaskParsing(
  name: string,
  tests: ITaskParsingTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { GlobalTokens } from '@idl/data-types/core';`);
  strings.push(`import { TaskToGlobalToken } from '@idl/data-types/tasks';`);
  strings.push(`import { ResetGlobalDisplayNames } from '@idl/parsing/index';`);
  strings.push(`import { LoadTask } from '@idl/schemas/tasks';`);
  strings.push(`import { GetExtensionPath } from '@idl/shared';`);
  strings.push(``);

  // add the basic code for our test
  strings.push(`describe(\`[auto generated] ${name}\`, () => {`);

  // process each test
  for (let i = 0; i < tests.length; i++) {
    // extract information about our test
    const test = tests[i];
    const testName = test.name;
    strings.push(`  it(\`[auto generated] ${testName}\`, async () => {`);

    // get fully-qualified filepath
    const filepath = GetExtensionPath(test.file);

    // specify file and index
    strings.push(`    // specify reference filepath`);
    strings.push(`    const filepath = GetExtensionPath('${test.file}')`);
    strings.push(``);

    // reset global display names
    ResetGlobalDisplayNames();

    // load our task
    const task = await LoadTask(filepath);

    // convert to global tokens
    const global: GlobalTokens = TaskToGlobalToken(task);

    strings.push(`    // reset global display names`);
    strings.push(`    ResetGlobalDisplayNames();`);
    strings.push(``);

    strings.push(`    // load our task`);
    strings.push(`    const task = await LoadTask(filepath);`);
    strings.push(``);

    // add the start to  our tokens
    strings.push(`    // define expected local variables`);
    strings.push(
      `    const expected: GlobalTokens = ${JSON.stringify(global)}`
    );
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push('    expect(expected).toEqual(TaskToGlobalToken(task))');
    strings.push('');

    strings.push('  })');
    strings.push(``);
  }

  // close
  strings.push(`});`);
  strings.push(``);

  // write to disk
  writeFileSync(uri, strings.join('\n'));
}
