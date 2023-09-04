import { CancellationToken } from '@idl/cancellation-tokens';
import { TOKEN_NAMES, TOKEN_TYPES, Tokenizer } from '@idl/parsing/tokenizer';
import deepCopy from 'fast-copy';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { ITokenTest } from '../tests.interface';
import { ArrayifyCode } from './arrayify-code';
import { PrepareString, StringifyCode } from './stringify-code';

/**
 * Tests that verify we can perform basic (i.e. flat) parsing of IDL code
 */
export function TestsForTokenizer(
  name: string,
  tests: ITokenTest[],
  uri = join(process.cwd(), 'tokens.ts')
) {
  // track our strings
  const strings: string[] = [];

  // add imports
  strings.push(`import { CancellationToken } from '@idl/cancellation-tokens';`);
  strings.push(
    `import { IBaseToken, StripIDs, TOKEN_NAMES, TOKEN_TYPES, Tokenizer,TokenName } from '@idl/parsing/tokenizer';`
  );
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
    const tokenized = Tokenizer(toProcess, new CancellationToken());

    // build our code string to insert into the automated test
    const codeStr = StringifyCode(toProcess);

    // add our tokens
    strings.push(`  it(\`[auto generated] ${testName}\`, () => {`);
    strings.push(`    // test code to extract tokens from`);
    strings.push(`    const code = ${codeStr}`);
    strings.push(``);
    strings.push(`    // extract tokens`);
    strings.push(
      `    const tokenized = Tokenizer(code, new CancellationToken())`
    );
    strings.push(``);

    // add the start to  our tokens
    strings.push(`    // define expected tokens`);
    strings.push(`    const expected: IBaseToken<TokenName>[] = [`);

    // copy our tokens
    const testTokens = deepCopy(tokenized.tokens);

    // get token type lookup
    const typeKeys = Object.keys(TOKEN_TYPES);
    const typeValues = Object.values(TOKEN_TYPES);

    // get the keys and values from the token lookup
    const tokenKeys = Object.keys(TOKEN_NAMES);
    const tokenValues = Object.values(TOKEN_NAMES);

    // process all of our tokens
    for (let j = 0; j < testTokens.length; j++) {
      // extract our token
      const token = testTokens[j];

      // delete ID
      delete (token as any)._id;

      // update strings
      strings.push(`      {`);

      // get the string for our token
      const idxType = typeValues.indexOf(token.type);

      // process token
      if (idxType !== -1) {
        strings.push(`        type: TOKEN_TYPES.${typeKeys[idxType]},`);
      } else {
        strings.push(`        type: '${token.type}',`);
      }

      // get the string for our token
      const idxName = tokenValues.indexOf(token.name);

      // process token
      if (idxName !== -1) {
        strings.push(`        name: TOKEN_NAMES.${tokenKeys[idxName]},`);
      } else {
        strings.push(`        name: '${token.name}',`);
      }

      // build our matches string
      let matchesStr = '[';
      for (let z = 0; z < token.matches.length; z++) {
        matchesStr += `\`${PrepareString(token.matches[z])}\`,`;
      }
      matchesStr += ']';

      // add remaining properties
      strings.push(
        `        pos: ${JSON.stringify(token.pos).replace(/"/gim, '')},`
      );
      strings.push(`        matches: ${matchesStr}`);

      // close object
      strings.push(`      },`);
    }

    // close
    strings.push(`    ]`);
    strings.push('');

    // verify results
    strings.push('    expect(StripIDs(tokenized.tokens)).toEqual(expected)');

    strings.push('  })');
    strings.push(``);
  }

  // close
  strings.push(`});`);
  strings.push(``);

  // write to disk
  writeFileSync(uri, strings.join('\n'));
}
