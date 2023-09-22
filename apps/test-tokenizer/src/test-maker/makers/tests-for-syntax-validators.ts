import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ISyntaxValidatorTest } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { StringifyCode } from './stringify-code';

/**
 * Generates tests for our syntax validators (i.e. post-processing) to make sure
 * that problems are correctly detected and reported.
 *
 * This also uses secondary problems and parsing post-processing for additional checks.
 */
export async function TestsForSyntaxValidators(
  name: string,
  tests: ISyntaxValidatorTest[],
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
  strings.push(`import { SyntaxProblems } from '@idl/parsing/problem-codes';`);
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

    /**
     * Parsing config
     */
    const parseConfig = Object.assign(
      { postProcess: true },
      test.config !== undefined ? test.config : {}
    );

    // extract our tokens from the cleaned code
    const tokenized = await index.getParsedProCode(
      'not-real',
      toProcess,
      new CancellationToken(),
      parseConfig
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
      `    const tokenized = await index.getParsedProCode('not-real', code, new CancellationToken(), ${JSON.stringify(
        parseConfig
      )});`
    );
    strings.push(``);

    // add the start to  our tokens
    strings.push(`    // define expected tokens`);
    strings.push(
      `    const expected: SyntaxProblems = ${JSON.stringify(
        tokenized.parseProblems.concat(tokenized.postProcessProblems)
      )}`
    );
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push(
      '    expect(tokenized.parseProblems.concat(tokenized.postProcessProblems)).toEqual(expected)'
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
