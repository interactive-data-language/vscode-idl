import markdownToTxt from 'markdown-to-txt';

/**
 * Strips markdown from descriptions and removes any examples (assuming they are code)
 * so that we have smaller payloads for tools
 */
export function GetCleanDescription(description: string, limit = true) {
  // if we dont limit the description, just remove markdown styling
  if (!limit) {
    return markdownToTxt(description);
  }

  /** Strip out examples since they are code */
  const pos = description.toLowerCase().indexOf('## example');

  /**
   * Get only the descriptions
   *
   * 1000 character limit is to try and have a high-level description.
   *
   * In mid 2025, when Zach tried a 1:1 MCP tool to ENVI Task, there were warning
   * logs in VSCode that talked about 1000 character limits, so this was added.
   *
   * I'm not sure if it is critical still, but some tasks have a lot of content and
   * we only need a high-level description
   */
  return markdownToTxt(
    pos !== -1 ? description.substring(0, pos) : description
  ).substring(0, 1000);
}
