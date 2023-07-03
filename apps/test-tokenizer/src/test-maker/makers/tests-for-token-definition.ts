import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { ITokenDefTest } from '../tests.interface';

/**
 * Test creation that can return the source of a token (ctrl + click) withing
 * VSCode.
 */
export async function TestsForTokenDefinition(
  name: string,
  tests: ITokenDefTest[],
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
  strings.push(`import { Position } from 'vscode-languageserver/node';`);
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
    const filepath = GetExtensionPath(test.files[0]);

    // specify file and index
    strings.push(`    // specify reference filepath`);
    strings.push(`    const filepath = GetExtensionPath('${test.files[0]}')`);
    strings.push(``);

    // process each test file
    for (let j = 0; j < test.files.length; j++) {
      // index file
      await index.indexFile(GetExtensionPath(test.files[j]));

      // specify file and index
      strings.push(`    // parse file for tests`);
      strings.push(
        `    await index.indexFile(GetExtensionPath('${test.files[j]}'))`
      );
      strings.push(``);
    }

    // process each location
    for (let j = 0; j < test.position.length; j++) {
      const found = await index.getTokenDef(
        filepath,
        await readFile(filepath, 'utf-8'),
        test.position[j]
      );

      // remove file-specific field
      if (found !== undefined) {
        delete found.file;
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
        `    const expectedFound_${j} = ${
          found !== undefined ? JSON.stringify(found) : 'undefined'
        }`
      );
      strings.push('');

      // remove filepaths
      strings.push(`    // get expected and remove file`);
      strings.push(
        `    const found_${j} = await index.getTokenDef(filepath, await readFile(filepath, 'utf-8'), position_${j})`
      );
      strings.push(`    if (found_${j} !== undefined){`);
      strings.push(`      delete found_${j}.file`);
      strings.push(`    }`);
      strings.push('');

      // verify results
      strings.push('    // verify results');
      strings.push(`    expect(expectedFound_${j}).toEqual(found_${j})`);
      strings.push('');
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
