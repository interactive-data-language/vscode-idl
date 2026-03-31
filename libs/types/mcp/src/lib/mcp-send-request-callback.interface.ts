import {
  MCPToolParams_VSCode,
  MCPToolResponse_VSCode,
  MCPTools_VSCode,
} from './mcp-tools-vscode.interface';

/**
 * Callback for sending a request from the MCP server to something
 * that can run a tool requiring ENVI or IDL (e.g. VS Code).
 *
 * This decouples the MCP server from any specific transport mechanism
 * (like `VSCodeLanguageServerMessenger`) so the server can be reused
 * in other contexts.
 */
export type MCPSendRequestCallback = <T extends MCPTools_VSCode>(
  executionId: string,
  tool: T,
  params: MCPToolParams_VSCode<T>,
) => Promise<MCPToolResponse_VSCode<T>>;
