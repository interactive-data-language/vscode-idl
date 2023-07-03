import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { IConfigTest } from '../tests.interface';

/**
 * Generates tests to make sure our config files are properly resolved
 */
export async function TestsForConfigFileResolving(
  name: string,
  tests: IConfigTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { LogManager } from '@idl/logger';`);
  strings.push(
    `import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';`
  );
  strings.push(`import { GetExtensionPath } from '@idl/shared';`);

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
    const workspace = test.workspace;

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

    // process each location
    for (let j = 0; j < test.actions.length; j++) {
      // get our action
      const action = test.actions[j];

      // get the filepath
      const filepath = GetExtensionPath(workspace + '/' + action.file);

      // specify the position to use
      strings.push(`    // specify filepath`);
      strings.push(
        `    const filepath_${j} = GetExtensionPath('${workspace}/${action.file}')`
      );
      strings.push(``);

      // determine how to proceed
      switch (action.action) {
        case 'add':
          strings.push(`    // add file to index`);
          strings.push(`    await index.indexFile(filepath_${j})`);
          await index.indexFile(filepath);
          break;
        case 'get': {
          // get config
          const config = index.getConfigForFile(filepath);

          // verify results
          strings.push('    // verify results');
          strings.push(
            `    expect(${JSON.stringify(
              config
            )}).toEqual(index.getConfigForFile(filepath_${j}))`
          );
          break;
        }
        default:
          break;
      }
      strings.push(``);
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
