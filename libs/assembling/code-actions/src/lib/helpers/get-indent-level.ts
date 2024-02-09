/** Regex to get first non-space character */
const INDENT_REGEX = /[^\s]/;

/**
 * Gets indentation level for a line
 */
export function GetIndentLevel(text: string) {
  let indent = '';
  const match = INDENT_REGEX.exec(text);
  if (match !== null) {
    indent = new Array(match.index).fill(' ').join('');
  }
  return indent;
}
