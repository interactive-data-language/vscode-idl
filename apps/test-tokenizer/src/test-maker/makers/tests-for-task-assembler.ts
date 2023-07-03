import { TaskAssembler } from '@idl/assembler';
import { LoadTask } from '@idl/schemas/tasks';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ITaskAssemblerTest } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { StringifyCode } from './stringify-code';

/**
 * Generates tests for the assembler
 *
 * None of these tests honor "autoFix" because there is a secondary test
 * that makes sure our formatted code is the same as the original.
 */
export async function TestsForTaskAssembler(
  name: string,
  tests: ITaskAssemblerTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { TaskAssembler } from '@idl/assembler';`);
  strings.push(`import { LoadTask } from '@idl/schemas/tasks';`);
  strings.push(``);

  // add the basic code for our test
  strings.push(`describe(\`[auto generated] ${name}\`, () => {`);

  // process each test
  for (let i = 0; i < tests.length; i++) {
    // extract information about our test
    const test = tests[i];
    const testName = test.name;
    const code = test.code;

    // make formatted code an array of strings
    const codeStr = StringifyCode(code);

    // tokenize
    const parsed = await LoadTask('my_file.task', code.join(''));

    // update test config
    test.config = {
      ...(test.config || {}),
      autoFix: false,
      formatter: 'fiddle',
    };

    // format
    const formatted = TaskAssembler(parsed, test.config);

    // add our tokens
    strings.push(`  it(\`[auto generated] ${testName}\`, async () => {`);
    strings.push(`    // test code to extract tokens from`);
    strings.push(`    const code = ${codeStr}`);
    strings.push(``);
    strings.push(`    // extract tokens`);
    strings.push(
      `    const parsed = await LoadTask('my_file.task', code.join(''));`
    );
    strings.push(``);
    strings.push(`    // format code`);
    if (test.config !== undefined) {
      strings.push(
        `    const formatted = TaskAssembler(parsed, ${JSON.stringify(
          test.config
        )});`
      );
      strings.push(``);
    } else {
      strings.push(
        `    const formatted = TaskAssembler(parsed, { formatter: 'fiddle' });`
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
    strings.push('    }');
    strings.push('  })');
    strings.push(``);
  }

  // close
  strings.push(`});`);
  strings.push(``);

  // write to disk
  writeFileSync(uri, strings.join('\n'));
}
