/**
 * Regex to detect ANSI codes
 *
 * https://github.com/chalk/ansi-regex
 */
function ansiRegex({ onlyFirst = false } = {}) {
  // Valid string terminator sequences are BEL, ESC\, and 0x9c
  const ST = '(?:\\u0007|\\u001B\\u005C|\\u009C)';
  const pattern = [
    `[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?${ST})`,
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

/**
 * Regex to detect ANSI codes
 */
const REGEX = ansiRegex();

/**
 * Strips ANSI characters from text
 *
 * https://github.com/chalk/strip-ansi
 */
export function StripANSI(text: string): string {
  return text.replace(REGEX, '');
}
