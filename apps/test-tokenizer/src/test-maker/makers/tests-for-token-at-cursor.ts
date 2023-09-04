import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { GetTokenAtCursor, RemoveScopeDetail } from '@idl/parsing/syntax-tree';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ISelectedTests } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { StringifyCode } from './stringify-code';

/**
 * Creates thats that make sure we can find the token at a given cursor position.
 */
export function TestsForTokenAtCursor(
  name: string,
  tests: ISelectedTests[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { CancellationToken } from '@idl/cancellation-tokens';`);
  strings.push(`import { Parser } from '@idl/parser';`);
  strings.push(
    `import { GetTokenAtCursor, RemoveScopeDetail } from '@idl/parsing/syntax-tree';`
  );
  strings.push(`import { Position } from 'vscode-languageserver/node';`);
  strings.push(``);
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
    const tokenized = Parser(toProcess, new CancellationToken());

    // build our code string to insert into the automated test
    const codeStr = StringifyCode(toProcess);

    // add our tokens
    strings.push(`  it(\`[auto generated] ${testName}\`, () => {`);
    strings.push(`    // test code to extract tokens from`);
    strings.push(`    const code = ${codeStr}`);
    strings.push(``);
    strings.push(`    // extract tokens`);
    strings.push(
      `    const tokenized = Parser(code, new CancellationToken());`
    );
    strings.push(``);

    // process each location
    for (let j = 0; j < test.position.length; j++) {
      const found = GetTokenAtCursor(tokenized, test.position[j]);

      // remove scope detail so we can stringify again
      RemoveScopeDetail(tokenized, new CancellationToken());

      // make a string of our token
      const str =
        found === undefined ? 'undefined' : JSON.stringify(found.token);

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
      strings.push(`    const expectedFound_${j} = ${str}`);
      strings.push('');

      // get selected
      strings.push('    // get selected');
      strings.push(
        `    const selected_${j} = GetTokenAtCursor(tokenized, position_${j})`
      );
      strings.push('');

      // add the start to  our tokens
      strings.push(`    // remove scope detail`);
      strings.push(`    RemoveScopeDetail(tokenized, new CancellationToken())`);
      strings.push('');

      // verify results
      strings.push('    // verify results');
      strings.push(
        `    expect(selected_${j}.token).toEqual(expectedFound_${j})`
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
