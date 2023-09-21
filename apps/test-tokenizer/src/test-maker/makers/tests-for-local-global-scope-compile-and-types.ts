import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ILocalGlobalScopeCompileTest } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { StringifyCode } from './stringify-code';

/**
 * Generates automated tests verifying our local, global, and compile options are set.
 *
 * As part of this, we export our local items (i.e. variables) which contains
 * type information.
 */
export async function TestsForLocalGlobalScopeAndCompile(
  name: string,
  tests: ILocalGlobalScopeCompileTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { CancellationToken } from '@idl/cancellation-tokens';`);
  strings.push(
    `import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';`
  );
  strings.push(`import { LogManager } from '@idl/logger';`);
  strings.push(
    `import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';`
  );
  strings.push(`import { ILocalTokens } from '@idl/parsing/syntax-tree';`);
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
    strings.push(`    // define expected local variables`);
    strings.push(
      `    const expectedVars: ILocalTokens = ${JSON.stringify(
        tokenized.local
      )}`
    );
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push('    expect(tokenized.local).toEqual(expectedVars)');
    strings.push('');

    // add the start to  our tokens
    strings.push(`    // define expected global variables`);
    strings.push(
      `    const expectedGlobal: GlobalTokens = ${JSON.stringify(
        tokenized.global
      )}`
    );
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push('    expect(tokenized.global).toEqual(expectedGlobal)');
    strings.push('');

    // add the start to  our tokens
    strings.push(`    // define expected compile options`);
    strings.push(
      `    const expectedCompile: ICompileOptions = ${JSON.stringify(
        tokenized.compile
      )}`
    );
    strings.push('');

    // verify results
    strings.push('    // verify results');
    strings.push('    expect(tokenized.compile).toEqual(expectedCompile)');
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
