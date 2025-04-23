import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { RegisterENVIChangeDetectionTool } from './tools/register-envi-change-detection-tool';
import { RegisterOpenInENVITool } from './tools/register-open-in-envi-tool';
import { RegisterStartENVITool } from './tools/register-start-envi-tool';

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
  RegisterENVIChangeDetectionTool(messenger);
  RegisterOpenInENVITool(messenger);
  RegisterStartENVITool(messenger);
}
