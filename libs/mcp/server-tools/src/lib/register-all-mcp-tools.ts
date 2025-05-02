import { IS_MCP_SERVER_STARTED } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

import { RegisterToolENVIChangeDetection } from './tools/register-tool-envi-change-detection';
import { RegisterToolExecuteIDLCode } from './tools/register-tool-execute-idl-code';
import { RegisterToolOpenInENVI } from './tools/register-tool-open-in-envi';
import { RegisterToolStartENVI } from './tools/register-tool-start-envi';
import { RegisterToolStartIDL } from './tools/register-tool-start-idl';

/**
 * Track if we registered our tools or not
 */
let REGISTERED = false;

/**
 * Helper that adds all tools to the MCP server
 */
export function RegisterAllMCPTools(messenger: VSCodeLanguageServerMessenger) {
  if (!IS_MCP_SERVER_STARTED) {
    return;
  }
  if (REGISTERED) {
    return;
  }

  /**
   * Register all of our tools
   */
  RegisterToolENVIChangeDetection(messenger);
  RegisterToolExecuteIDLCode(messenger);
  RegisterToolOpenInENVI(messenger);
  RegisterToolStartENVI(messenger);
  RegisterToolStartIDL(messenger);

  // update flag that we registered our tools (duplicated throw errors)
  REGISTERED = true;
}
