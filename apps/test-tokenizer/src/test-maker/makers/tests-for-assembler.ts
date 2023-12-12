import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDLIndex } from '@idl/parsing/index';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { IAssemblerTest } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { StringifyCode } from './stringify-code';

/**
 * Generates tests for the assembler
 *
 * None of these tests honor "autoFix" because there is a secondary test
 * that makes sure our formatted code is the same as the original.
 */
export async function TestsForAssembler(
  name: string,
  tests: IAssemblerTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { Assembler } from '@idl/assembler';`);
  strings.push(`import { CancellationToken } from '@idl/cancellation-tokens';`);
  strings.push(`import { LogManager } from '@idl/logger';`);
  strings.push(`import { GetTokenNames } from '@idl/parser';`);
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

    // get the code to process
    const toProcess = ArrayifyCode(code);

    // make formatted code an array of strings
    const codeStr = StringifyCode(toProcess);

    // create our index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // tokenize
    const tokenized = await index.getParsedProCode(
      'my_file.pro',
      code,
      new CancellationToken(),
      {
        postProcess: true,
      }
    );

    // update test config
    test.config = {
      ...(test.config || {}),
      autoFix: false,
      formatter: 'fiddle',
    };

    // format
    const formatted = Assembler(
      tokenized,
      new CancellationToken(),
      test.config
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
    strings.push(`    // test code to extract tokens from`);
    strings.push(`    const code = ${codeStr}`);
    strings.push(``);
    strings.push(`    // extract tokens`);
    strings.push(
      `    const tokenized = await index.getParsedProCode('my_file.pro', code, new CancellationToken(), {postProcess: true});`
    );
    strings.push(``);
    strings.push(`    // extract token names`);
    strings.push(`    const tokenizedNames = GetTokenNames(tokenized);`);
    strings.push(``);
    strings.push(`    // format code`);
    if (test.config !== undefined) {
      strings.push(
        `    const formatted = Assembler(tokenized, new CancellationToken(), ${JSON.stringify(
          test.config
        )});`
      );
      strings.push(``);
    } else {
      strings.push(
        `    const formatted = Assembler(tokenized, new CancellationToken(), { formatter: 'fiddle' });`
      );
      strings.push(``);
    }
    strings.push('    // verify formatting');
    strings.push('    if (formatted === undefined){');
    strings.push('      expect(formatted).toEqual(undefined)');
    strings.push('    } else {');

    let expectedString = '[]';

    // check if we have nothing to format because of syntax errors
    if (formatted !== undefined) {
      // make formatted code an array of strings
      const formattedArray = ArrayifyCode(formatted);

      // make formatted code an array of strings
      expectedString = StringifyCode(formattedArray);
    }

    // add the start to  our tokens
    strings.push(`      // define expected problems`);
    strings.push(
      `      const expectedFormatting: string[] = ${expectedString}`
    );
    strings.push('');

    // verify results
    strings.push('      // verify formatting');
    strings.push(
      '      expect(formatted.split(`\\n`)).toEqual(expectedFormatting)'
    );
    strings.push('');
    strings.push('      // parse formatted code');
    strings.push(
      `      const reParsed = await index.getParsedProCode('my_file.pro', formatted, new CancellationToken(), {postProcess: true});`
    );
    strings.push('');
    strings.push(
      '      // make sure the syntax trees are the same as they were before'
    );
    strings.push(
      '      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames)'
    );
    strings.push('    }');
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
    strings.push('    // verify problems');
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
