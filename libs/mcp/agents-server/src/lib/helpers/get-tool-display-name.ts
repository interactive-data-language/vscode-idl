import { IDL_TRANSLATION } from '@idl/translation';

import { GITHUB_TOOL_DISPLAY_NAMES } from './get-tool-display-names.interface';

/**
 * Gets the display name of our tool from translation or an internal lookup
 *
 * If we don't have a display name, we return the tool name
 */
export function GetToolDisplayName(toolName: string): string {
  switch (true) {
    case toolName in GITHUB_TOOL_DISPLAY_NAMES:
      return (GITHUB_TOOL_DISPLAY_NAMES as any)[toolName];
    case toolName in IDL_TRANSLATION.mcp.tools.displayNames:
      return (IDL_TRANSLATION.mcp.tools.displayNames as any)[toolName];
    default:
      return toolName;
      break;
  }
}
