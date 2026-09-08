import { ImageContent, TextContent } from '@modelcontextprotocol/sdk/types.js';

/**
 * Extracts text content from MCP tool response content array.
 *
 * Since content can be either TextContent or ImageContent, this helper
 * performs proper type narrowing to access the .text property safely.
 *
 * @param content The content array from an MCP tool response
 * @param index The index of the content item to extract (defaults to 0)
 * @returns The text content as a string
 * @throws Error if the content at the specified index is not TextContent or index is out of bounds
 */
export function GetTextContent(
  content: (ImageContent | TextContent)[],
  index = 0,
): string {
  // Check bounds
  if (index < 0 || index >= content.length) {
    throw new Error(
      `Content index ${index} out of bounds. Content length: ${content.length}`,
    );
  }

  // Get the content item
  const item = content[index];

  // Type guard: check if it's TextContent
  if (item.type !== 'text') {
    throw new Error(
      `Expected TextContent at index ${index}, but got ${item.type}`,
    );
  }

  // TypeScript now knows item is TextContent
  return item.text;
}
