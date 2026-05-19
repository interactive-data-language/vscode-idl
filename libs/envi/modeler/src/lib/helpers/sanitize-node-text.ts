import { ENVIModelerNode } from '@idl/types/envi/modeler';
import emojiRegex from 'emoji-regex';

/**
 * Regular expression to match control characters that should be removed from text.
 * Matches U+0000-U+001F (C0 controls) and U+007F-U+009F (DEL + C1 controls).
 */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_REGEX = /[\x00-\x1F\x7F-\x9F]/g;

/**
 * Cached emoji regex instance for performance.
 */
const EMOJI_REGEX = emojiRegex();

/**
 * Cleans a string by removing emojis and control characters.
 * Preserves undefined values and trims whitespace after sanitization.
 *
 * @param text Text to clean (or undefined)
 * @returns Cleaned text with emojis and control characters removed, or undefined
 */
function CleanText(text: string): string {
  return text.replace(EMOJI_REGEX, '').replace(CONTROL_CHARS_REGEX, '').trim();
}

/**
 * Sanitizes all text properties in ENVI Modeler nodes by removing emojis and
 * control characters. Mutates nodes in place.
 *
 * Text properties sanitized:
 * - node.display_name
 * - node.comment
 * - node.parameters[].display_name (for inputparameters nodes)
 * - node.parameters[].description (for inputparameters nodes)
 *
 * This prevents issues with special characters in the generated ENVI Modeler
 * workflow JSON and ensures clean display in the ENVI Modeler UI.
 *
 */
export function SanitizeNodeText(nodes: ENVIModelerNode[]): void {
  for (const node of nodes) {
    // Sanitize node-level text properties
    if (node.display_name !== undefined) {
      node.display_name = CleanText(node.display_name);
    }
    if (node.comment !== undefined) {
      node.comment = CleanText(node.comment);
    }

    // Sanitize inputparameters text properties
    if (node.parameters !== undefined) {
      for (const param of node.parameters) {
        if (param.display_name !== undefined) {
          param.display_name = CleanText(param.display_name);
        }
        if (param.description !== undefined) {
          param.description = CleanText(param.description);
        }
      }
    }
  }
}
