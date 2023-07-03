import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { CompletionItem } from 'vscode-languageserver/node';

import { IAutoCompleteTest } from '../tests.interface';

/**
 * Generates test to verify auto-complete works as expected
 */
export async function TestsForAutoComplete(
  name: string,
  tests: IAutoCompleteTest[],
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
  strings.push(`import { readFile } from 'fs/promises';`);
  strings.push(
    `import { CompletionItem, Position } from 'vscode-languageserver/node';`
  );
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

    // index file
    await index.indexFile(filepath);

    // specify file and index
    strings.push(`    // specify filepath`);
    strings.push(`    const filepath = GetExtensionPath('${test.file}')`);
    strings.push(``);
    strings.push(`    // add file to index`);
    strings.push(`    await index.indexFile(filepath)`);
    strings.push(``);

    // process each location
    for (let j = 0; j < test.position.length; j++) {
      let found: CompletionItem[] = await index.getAutoComplete(
        filepath,
        await readFile(filepath, 'utf-8'),
        test.position[j]
      );

      // check if we have a filter
      if (test.startsWith !== undefined) {
        found = found.filter((item) =>
          item?.label?.startsWith(test.startsWith)
        );
      }

      // specify the position to use
      strings.push(`    // define position`);
      strings.push(
        `    const position_${j}: Position = ${JSON.stringify(
          test.position[j]
        )}`
      );
      strings.push('');

      // add the start to  our tokens
      strings.push(`    // define expected token we extract`);
      strings.push(
        `    const expectedFound_${j}: CompletionItem[] = ${JSON.stringify(
          found.slice(0, 50)
        )}`
      );
      strings.push('');

      // verify results
      strings.push('    // verify results');

      // check if we have a filter
      if (test.startsWith !== undefined) {
        strings.push(
          `    expect(expectedFound_${j}).toEqual((await index.getAutoComplete(filepath,await readFile(filepath, 'utf-8'), position_${j})).filter(item => item?.label?.startsWith('${test.startsWith}')).slice(0,50))`
        );
      } else {
        strings.push(
          `    expect(expectedFound_${j}).toEqual((await index.getAutoComplete(filepath,await readFile(filepath, 'utf-8'), position_${j})).slice(0,50))`
        );
      }
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
