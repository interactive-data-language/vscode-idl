import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { RegisterToolENVIChangeDetection } from './tools/register-tool-envi-change-detection';
import { RegisterToolOpenInENVI } from './tools/register-tool-open-in-envi';
import { RegisterToolStartENVI } from './tools/register-tool-start-envi';
import { RegisterToolStartIDL } from './tools/register-tool-start-idl';

/**
 * Helper that adds all tools to the MCP server
 */
export function RegisterAllMCPTools(messenger: VSCodeLanguageServerMessenger) {
  if (!IS_MCP_SERVER_STARTED) {
    return;
  }

  /**
   * Register all of our tools
   */
  RegisterToolENVIChangeDetection(messenger);
  RegisterToolOpenInENVI(messenger);
  RegisterToolStartENVI(messenger);
  RegisterToolStartIDL(messenger);
}
