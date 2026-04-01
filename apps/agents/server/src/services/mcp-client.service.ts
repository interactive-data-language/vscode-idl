import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type {
  CallToolResult,
  ListToolsResult,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * Configuration for MCPClient
 */
export interface MCPClientConfig {
  /** MCP server host (default: localhost) */
  host?: string;
  /** MCP server port (default: 9194) */
  port?: number;
}

/**
 * Wrapper class for MCP SDK Client that manages connection lifecycle
 * and provides convenient methods for tool interaction
 */
export class MCPClient {
  private client: Client;
  private config: Required<MCPClientConfig>;
  private connected = false;
  private toolCache: Tool[] = [];
  private transport: StreamableHTTPClientTransport;

  constructor(config: MCPClientConfig = {}) {
    this.config = {
      host: config.host || 'localhost',
      port: config.port || 9194,
    };

    const url = `http://${this.config.host}:${this.config.port}/mcp`;
    this.transport = new StreamableHTTPClientTransport(new URL(url));

    this.client = new Client(
      {
        name: 'idl-chat-agent',
        version: '1.0.0',
      },
      {
        capabilities: {},
        listChanged: {
          tools: {
            onChanged: async (error, tools) => {
              if (error) {
                console.error('[MCPClient] Error in tool list change:', error);
                return;
              }
              if (tools) {
                this.toolCache = tools;
                console.log(
                  `[MCPClient] Tool list updated: ${tools.length} tools`,
                );
              } else {
                // If tools is undefined, refresh manually
                await this.refreshTools();
              }
            },
          },
        },
      },
    );
  }

  /**
   * Call a tool on the MCP server
   *
   * @param toolName - Name of the tool to call
   * @param args - Arguments to pass to the tool
   * @returns Tool execution result
   */
  async callTool(
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<CallToolResult> {
    if (!this.connected) {
      throw new Error('MCPClient is not connected');
    }

    try {
      console.log(`[MCPClient] Calling tool: ${toolName}`);
      const result = await this.client.callTool({
        name: toolName,
        arguments: args,
      });
      return result as CallToolResult;
    } catch (error) {
      console.error(`[MCPClient] Failed to call tool ${toolName}:`, error);
      throw error;
    }
  }

  /**
   * Connect to the MCP server and fetch initial tool list
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    try {
      await this.client.connect(this.transport);
      this.connected = true;
      console.log(
        `[MCPClient] Connected to MCP server at ${this.config.host}:${this.config.port}`,
      );

      // Fetch initial tool list
      await this.refreshTools();
    } catch (error) {
      console.error('[MCPClient] Failed to connect to MCP server:', error);
      throw new Error(
        `Failed to connect to MCP server at ${this.config.host}:${this.config.port}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Close the connection to the MCP server
   */
  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    try {
      await this.client.close();
      this.connected = false;
      console.log('[MCPClient] Disconnected from MCP server');
    } catch (error) {
      console.error('[MCPClient] Error during disconnect:', error);
    }
  }

  /**
   * Get the underlying MCP SDK Client instance
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * Get the current list of available tools
   */
  getTools(): Tool[] {
    return [...this.toolCache];
  }

  /**
   * Check if the client is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Refresh the cached tool list from the MCP server
   */
  async refreshTools(): Promise<void> {
    if (!this.connected) {
      throw new Error('MCPClient is not connected');
    }

    try {
      const result: ListToolsResult = await this.client.listTools();
      this.toolCache = result.tools;
      console.log(
        `[MCPClient] Loaded ${this.toolCache.length} tools from MCP server`,
      );
    } catch (error) {
      console.error('[MCPClient] Failed to refresh tools:', error);
      throw error;
    }
  }
}
