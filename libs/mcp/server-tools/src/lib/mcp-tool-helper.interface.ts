import { LogManager } from '@idl/logger';
import {
  MCPToolHTTPResponse,
  MCPToolInvokedCallback,
  MCPTools,
} from '@idl/types/mcp';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { ShapeOutput } from '@modelcontextprotocol/sdk/server/zod-compat';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol';
import {
  ServerNotification,
  ServerRequest,
} from '@modelcontextprotocol/sdk/types';
import { ZodRawShape } from 'zod';

/**
 * Callback that adds a new argument to each function so that
 * we have an ID we can send/receive progress messages on
 *
 * Note: We define this directly instead of inferring from ToolCallback<Args>
 * to avoid TypeScript's recursive type detection which can be triggered
 * when using nested conditional types with inference.
 */
export type MCPToolCallback<Args extends ZodRawShape, Tool extends MCPTools> = (
  id: string,
  args: ShapeOutput<Args>,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
) => MCPToolHTTPResponse<Tool> | Promise<MCPToolHTTPResponse<Tool>>;

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
  toolInvokedCallback: MCPToolInvokedCallback<MCPTools>;
}
