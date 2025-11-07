import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { TrackServerResource } from '@idl/mcp/server-tools';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

/**
 * Track if we registered our tools or not
 */
let REGISTERED = false;

/**
 * Helper that adds all tools to the MCP server
 */
export function RegisterAllMCPResources(
  messenger: VSCodeLanguageServerMessenger
) {
  if (!IS_MCP_SERVER_STARTED) {
    return;
  }
  if (REGISTERED) {
    return;
  }

  /**
   * Test resource to register
   */
  TrackServerResource(
    'about-extension',
    'Basic information about the extension and high level features',
    'Find all information on the official docs page: https://interactive-data-language.github.io/vscode-idl/'
  );

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;
}
