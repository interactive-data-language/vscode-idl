import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ITokenTest } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { StringifyCode } from './stringify-code';

/**
 * Generates tests to show that our post-processors are correctly updating/mapping
 * the syntax tree
 */
export function TestsForSyntaxPostProcessors(
  name: string,
  tests: ITokenTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { CancellationToken } from '@idl/cancellation-tokens';`);
  strings.push(`import { Parser } from '@idl/parser';`);
  strings.push(`import { SyntaxTree } from '@idl/parsing/syntax-tree';`);
  strings.push(`import { SyntaxProblems } from '@idl/types/problem-codes';`);
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

    // add the start to  our tokens
    strings.push(`    // define expected syntax tree`);
    strings.push(
      `    const expectedTree: SyntaxTree = ${JSON.stringify(tokenized.tree)}`
    );
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push('    expect(tokenized.tree).toEqual(expectedTree)');
    strings.push('');

    // add the start to  our tokens
    strings.push(`    // define expected problems`);
    strings.push(
      `    const expectedProblems: SyntaxProblems = ${JSON.stringify(
        tokenized.parseProblems.concat(tokenized.postProcessProblems)
      )}`
    );
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push(
      '    expect(tokenized.parseProblems.concat(tokenized.postProcessProblems)).toEqual(expectedProblems)'
    );

    strings.push('  })');
    strings.push(``);
  }

  // close
  strings.push(`});`);
  strings.push(``);

  // write to disk
  writeFileSync(uri, strings.join('\n'));
}
