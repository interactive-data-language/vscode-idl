/**
 * Makes code expressions nicely into a string.
 *
 * Preserves backticks, as we use backticks in our auto-test code, and
 * makes sure the expressions in literal strings are properly escaped
 */
export function PrepareString(str: string) {
  // debug
  // console.log(JSON.stringify(str));
  // console.log(str);
  str = str
    .replace(/\\/gim, '\\\\')
    .replace(/`/gim, '\\`')
    .replace(/\$\{/gim, '\\${');
  // debug
  // console.log(JSON.stringify(str));
  // console.log(str);

  return str;
}

/**
 * Converts a string array of code to a single line that
 * can be inserted into automated tests
 */
export function StringifyCode(code: string[]): string {
  // initialize result
  let codeStr = '[';

  // process each line and use backticks for consistency
  for (let z = 0; z < code.length; z++) {
    codeStr += `\`${PrepareString(code[z])}\`,`;
  }

  // close code
  codeStr += ']';

  // return
  return codeStr;
}
