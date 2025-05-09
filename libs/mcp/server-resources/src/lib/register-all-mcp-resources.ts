import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { RegisterResourceIDLOperators } from './resources/register-resource-idl-operators';

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
   * TODO:
   * operators (< vs lt)
   * no double backslashes in IDL unless you use backticks
   * Running IDL code
   */

  /**
   * Register all of our resources
   */
  RegisterResourceIDLOperators(messenger);

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;
}
