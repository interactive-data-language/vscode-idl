import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { SanitizeAllProblems } from '@idl/tests/helpers';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { IGlobalProblemTest } from '../tests.interface';

/**
 * Generates tests to check the logic for global problems
 * being detected correctly.
 */
export async function TestsForGlobalProblems(
  name: string,
  tests: IGlobalProblemTest[],
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
  strings.push(`import { SanitizeAllProblems } from '@idl/tests/helpers';`);
  strings.push(`import { SyntaxProblems } from '@idl/types/problem-codes';`);

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
        case 'remove':
          strings.push(`    // remove file from index`);
          strings.push(`    index.removeFile(filepath_${j})`);
          index.removeFile(filepath);
          break;
        default:
          break;
      }
      strings.push(``);

      // get syntax problems
      const problems = index.getGlobalTokenSyntaxProblems();

      // specify the position to use
      strings.push(`    // define expected problems`);
      strings.push(
        `    const problems_${j}: {[key:string]: SyntaxProblems} = ${JSON.stringify(
          SanitizeAllProblems(problems, workspace)
        )}`
      );
      strings.push('');

      // verify results
      strings.push('    // verify results');
      strings.push(
        `    expect(problems_${j}).toEqual(SanitizeAllProblems(index.getGlobalTokenSyntaxProblems(), '${workspace}'))`
      );
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
