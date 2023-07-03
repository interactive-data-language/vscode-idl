/**
 * Regex for escaped underscores, a valid IDL character
 */
const ESCAPE_REGEX = /\\_/gim;

/**
 * Removes escaped underscores from Markdown content
 */
export function UnescapeMarkdown(str: string) {
  return str.replace(ESCAPE_REGEX, '_');
}
