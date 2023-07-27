import { TextMateParse } from '@idl/test-helpers';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ITokenTest } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { StringifyCode } from './stringify-code';

/**
 * Using the same tests as tokenizing, we parse using some
 * textmate language to have a snapshot of behavior.
 *
 * These tests are never ran, just present to alert developers
 * that parsing behaviors have changed.
 */
export async function TestsForTextMateTokenizer(
  name: string,
  tests: ITokenTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { TextMateParse } from '@idl/test-helpers';`);
  strings.push(``);

  // add the basic code for our test
  strings.push(`describe(\`[auto generated] ${name}\`, () => {`);

  // process each test
  for (let i = 0; i < tests.length; i++) {
    // extract information about our test
    const test = tests[i];
    const testName = test.name;
    const code = test.code;

    // get the code to process
    const toProcess = ArrayifyCode(code);

    // extract our tokens from the cleaned code
    const tokenized = await TextMateParse(toProcess);

    // build our code string to insert into the automated test
    const codeStr = StringifyCode(toProcess);

    // add our tokens
    strings.push(`  it(\`[auto generated] ${testName}\`, async () => {`);
    strings.push(`    // test code to extract tokens from`);
    strings.push(`    const code = ${codeStr}`);
    strings.push(``);
    strings.push(`    // extract tokens`);
    strings.push(`    const tokenized = await TextMateParse(code)`);
    strings.push(``);

    // add the start to  our tokens
    strings.push(`    // define expected tokens`);
    strings.push(`    const expected = ${JSON.stringify(tokenized)}`);

    // verify results
    strings.push('    expect(expected).toEqual(tokenized)');

    strings.push('  })');
    strings.push(``);
  }

  // close
  strings.push(`});`);
  strings.push(``);

  // write to disk
  writeFileSync(uri, strings.join('\n'));
}
