import { MCPToolParams, MCPToolResponse, MCPTools } from '@idl/types/mcp';
import { ExtensionContext } from 'vscode';

import { RunMCPOpenInENVI } from './tools/run-mcp-open-in-envi';
import { RunMCPStartENVI } from './tools/run-mcp-start-envi';

/**
 * Typed lookup of functions that we register for our tools
 */
export let MCP_TOOL_LOOKUP: {
  [key in MCPTools]: (
    params: MCPToolParams<key>
  ) => MCPToolResponse<key> | Promise<MCPToolResponse<key>>;
};

/**
 * Initializes our MCP event listeners from the language server
 */
export function InitializeMCPTools(ctx: ExtensionContext) {
  MCP_TOOL_LOOKUP = {
    'open-in-envi': RunMCPOpenInENVI,
    'start-envi': RunMCPStartENVI,
  };
}
