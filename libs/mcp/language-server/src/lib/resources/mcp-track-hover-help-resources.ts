import { MCPResourceIndex } from '@idl/mcp/server-resources';
import { IDL_TRANSLATION } from '@idl/translation';

/**
 * Tracks custom hover help content as MCP resources
 */
export function MCPTrackHoverHelpResources() {
  const keys = Object.keys(IDL_TRANSLATION.hoverHelp.control);

  for (let i = 0; i < keys.length; i++) {
    MCPResourceIndex.add(
      `control-info-for-${keys[i]}`,
      IDL_TRANSLATION.hoverHelp.control[keys[i]]
    );
  }
}
