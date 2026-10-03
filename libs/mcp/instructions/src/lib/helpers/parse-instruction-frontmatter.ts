import * as YAML from 'yaml';

import { IInstructionMetadata } from '../mcp-instructions-registry.interface';

/**
 * Parsed result containing extracted content and frontmatter metadata.
 */
export interface IParsedInstruction {
  /**
   * Markdown body content with frontmatter header stripped
   */
  content: string;

  /**
   * Frontmatter metadata extracted from the header
   */
  metadata: IInstructionMetadata;
}

/**
 * Regex matching YAML frontmatter blocks delimited by `---` at the start of a document.
 */
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

/**
 * Parses GitHub Copilot-style YAML frontmatter header from markdown instruction text.
 * Strips the frontmatter block from the body content and returns normalized metadata.
 */
export function ParseInstructionFrontmatter(
  rawContent: string,
  defaultId: string,
): IParsedInstruction {
  const match = rawContent.match(FRONTMATTER_REGEX);

  // init metadata
  const metadata: IInstructionMetadata = {
    id: defaultId.toLowerCase(),
    name: defaultId,
    description: '',
    includes: [],
    hidden: false,
  };

  // if no fontmatter, then return
  if (!match) {
    return {
      content: rawContent,
      metadata,
    };
  }

  // attempt to parse and replace values in metadata
  try {
    Object.assign(metadata, YAML.parse(match[1]) || {});
  } catch {
    // If parsing fails, fall back to empty metadata object
  }

  // normalize `includes` to an array since frontmatter may specify a single string
  const includes = Array.isArray(metadata.includes)
    ? metadata.includes
    : metadata.includes
      ? [metadata.includes]
      : [];

  return {
    content: rawContent.substring(match[0].length),
    metadata: {
      ...metadata,
      includes: includes.map((item: string) => item.toLowerCase()),
    },
  };
}
