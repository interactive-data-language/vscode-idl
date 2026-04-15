import markdownToTxt from 'markdown-to-txt';

/**
 * Regex to detect task syntax block
 */
const TASK_SYNTAX = /(?<=result\s*=\s*(?:ENVI|IDL)Task\('[^']+'\)\s*)^/im;

/**
 * Regex to detect properties blocks
 */
const PARAMETER_SYNTAX =
  /#+\s*(?:input\s*parameters|output\s*parameters)(?:.*\n+)*/gim;

/** Syntax blocks that we add automatically for custom tasks (not native to ENVI) */
const CUSTOM_TASK_SYNTAX = /###\s*Syntax[\s\S]*?```[\s\S]*?```/gim;

/**
 * Regex to find text where examples happen
 */
const EXAMPLES_REGEX = /#+\s*example/im;

/**
 * Wrapper to remove markdonw
 */
export function StripMarkdown(markdown: string) {
  return markdownToTxt(
    markdown.replace(/!\[([^\]]*)\]\([^)]+\)/g, '[removed image]'), // Remove images ![alt](url)
  ).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove [text](url) -> text
}

/**
 * Strips markdown from descriptions and removes any examples (assuming they are code)
 * so that we have smaller payloads for tools
 *
 * Turns markdown into plain text and completely removes links
 */
export function GetCleanDescription(description: string, limit = true) {
  /** Strip out examples since they are code */
  const exMatch = EXAMPLES_REGEX.exec(description);
  if (exMatch !== null && limit) {
    description = description.substring(0, exMatch.index - 1);
  }

  /** String custom syntax blocks */
  description = description.replace(CUSTOM_TASK_SYNTAX, '');

  /** Strip out parameters (task descriptions include "### Input Parameters" */
  description = description.replace(PARAMETER_SYNTAX, '');

  // convert to text
  description = StripMarkdown(description);

  /**
   * Reasync move task syntax block
   */
  const match = TASK_SYNTAX.exec(description);

  // clean up if we have it
  if (match !== null) {
    description = description.substring(match.index);
  }

  // make sure we are trimmed
  description = description.trim();

  // if we dont limit the description, just remove markdown styling
  if (!limit) {
    return description;
  }

  /**
   * Flag for if we keep or toss invidialual lines
   */
  let keep = true;

  /**
   * Get only the descriptions - First sentence
   *
   * 1000 character limit is to try and have a high-level description.
   *
   * In mid 2025, when Zach tried a 1:1 MCP tool to ENVI Task, there were warning
   * logs in VSCode that talked about 1000 character limits, so this was added.
   *
   * I'm not sure if it is critical still, but some tasks have a lot of content and
   * we only need a high-level description
   */
  return description
    .split(/\r?\n/gim)
    .map((item) => item.trim())
    .filter((item) => {
      // when we find an empty line, turn off keeping content
      if (!item && keep) {
        keep = false;
      }
      return keep;
    })
    .join(`\n`)
    .substring(0, 1000);
}
