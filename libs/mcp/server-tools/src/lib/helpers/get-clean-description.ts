import markdownToTxt from 'markdown-to-txt';

/**
 * Strips markdown from descriptions and removes any examples (assuming they are code)
 * so that we have smalled payloads for tools
 */
export function GetCleanDescription(description: string, limit = false) {
  /** Strip out examples since they are code */
  const pos = description.toLowerCase().indexOf('## example');

  /** Get only the descriptions */
  return markdownToTxt(
    pos !== -1 ? description.substring(0, pos) : description
  ).substring(0, 1000);
}
