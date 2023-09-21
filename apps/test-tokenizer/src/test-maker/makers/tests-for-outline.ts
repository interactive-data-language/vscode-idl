import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { IOutlineTest } from '../tests.interface';

/**
 * Generates tests to make sure we can get the outline for a file
 */
export async function TestsForOutline(
  name: string,
  tests: IOutlineTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { CancellationToken } from '@idl/cancellation-tokens';`);
  strings.push(`import { LogManager } from '@idl/logger';`);
  strings.push(
    `import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';`
  );
  strings.push(`import { GetExtensionPath } from '@idl/shared';`);
  strings.push(`import { readFile } from 'fs/promises';`);
  strings.push(`import { DocumentSymbol } from 'vscode-languageserver/node';`);
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

    // get global tokens
    const outline = await index.getOutline(
      filepath,
      await readFile(filepath, 'utf-8'),
      new CancellationToken()
    );

    // specify file and index
    strings.push(`    // specify filepath`);
    strings.push(`    const filepath = GetExtensionPath('${test.file}')`);
    strings.push(``);
    strings.push(`    // add file to index`);
    strings.push(`    await index.indexFile(filepath)`);
    strings.push(``);

    // add the start to  our tokens
    strings.push(`    // define outline we expect to extract`);
    strings.push(
      `    const expected: DocumentSymbol[] = ${JSON.stringify(outline)}`
    );
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push(
      `    expect(expected).toEqual(await index.getOutline(filepath, await readFile(filepath, 'utf-8'), new CancellationToken()))`
    );
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
