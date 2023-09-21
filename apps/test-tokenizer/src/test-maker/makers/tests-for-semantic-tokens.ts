import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ITokenTest } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { StringifyCode } from './stringify-code';

/**
 * Generates tests for our syntax validators (i.e. post-processing) to make sure
 * that problems are correctly detected and reported.
 *
 * This also uses secondary problems and parsing post-processing for additional checks.
 */
export async function TestsForSemanticTokens(
  name: string,
  tests: ITokenTest[],
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
    const code = test.code;

    // create our index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // get the code to process
    const toProcess = ArrayifyCode(code);

    // extract our tokens from the cleaned code
    const semantic = await index.getSemanticTokens(
      'not-real',
      toProcess,
      new CancellationToken()
    );

    // build our code string to insert into the automated test
    const codeStr = StringifyCode(toProcess);

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
    strings.push(`    // test code to extract tokens from`);
    strings.push(`    const code = ${codeStr}`);
    strings.push(``);
    strings.push(`    // extract tokens`);
    strings.push(
      `    const semantic = await index.getSemanticTokens('not-real', code, new CancellationToken());`
    );
    strings.push(``);

    // add the start to  our tokens
    strings.push(`    // define expected tokens`);
    strings.push(`    const expected = ${JSON.stringify(semantic.data)}`);
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push('    expect(semantic.data).toEqual(expected)');

    strings.push('  })');
    strings.push(``);
  }

  // close
  strings.push(`});`);
  strings.push(``);

  // write to disk
  writeFileSync(uri, strings.join('\n'));
}
