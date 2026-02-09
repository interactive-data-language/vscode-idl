import { LogManager } from '@idl/logger';
import { MCPToolHTTPResponse, MCPTools } from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { McpServer, ToolCallback } from '@modelcontextprotocol/sdk/server/mcp';
import { ZodRawShape } from 'zod';

/**
 * Callback that adds a new argument to each function so that
 * we have an ID we can send/receive progress messages on
 */
export type MCPToolCallback<
  Args extends ZodRawShape,
  Tool extends MCPTools
> = ToolCallback<Args> extends (...a: infer U) => infer R
  ? (
      id: string,
      ...a: U
    ) => MCPToolHTTPResponse<Tool> | Promise<MCPToolHTTPResponse<Tool>>
  : never;

/**
 * Parameters for registering a new tool
 */
export type MCPRegistryToolInfo<Args extends ZodRawShape> = {
  title: string;
  description: string;
  inputSchema: Args;
};

export interface IMCPHelperOptions {
  /** Log manager */
  logManager: LogManager;

  /**
   * Reference to the MCP server to we can register tools
   */
  mcpServer: McpServer;

  /** CLient messenger to talk to VSCode */
  messenger: VSCodeLanguageServerMessenger;

  /** Callback when a tool is invoked */
  toolInvokedCallback: (toolName: MCPTools) => void;
}
