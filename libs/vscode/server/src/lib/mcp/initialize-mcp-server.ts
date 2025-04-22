import { IDL_MCP_LOG } from '@idl/logger';
import { StartMCPServer } from '@idl/mcp/server';

import { IDL_LANGUAGE_SERVER_LOGGER } from '../initialize-server';
import { RegisterENVIChangeDetectionTool } from './tools/register-envi-change-detection-tool';
import { RegisterOpenInENVITool } from './tools/register-open-in-envi-tool';
import { RegisterStartENVITool } from './tools/register-start-envi-tool';

/**
 * Starts our MCP Server
 */
export function InitializeMCPServer() {
  setTimeout(() => {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_MCP_LOG,
      type: 'info',
      content: 'Starting MCP server',
    });
  }, 1000);

  StartMCPServer((err) => {
    console.error(`Error from MCP server`, err);
  });

  // register our tools
  RegisterENVIChangeDetectionTool();
  RegisterOpenInENVITool();
  RegisterStartENVITool();
}
