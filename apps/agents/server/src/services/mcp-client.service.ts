import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

/**
 * Thin wrapper around the MCP SDK HTTP client for use in the LangChain engine.
 * Connects to the co-hosted Express MCP endpoint at `http://localhost:{port}/mcp`.
 */
export class MCPClient {
  private client: Client | undefined;
  private readonly port: number;

  constructor(config: { port?: number }) {
    this.port = config.port || 3000;
  }

  /**
   * Connect to the local MCP HTTP server. Safe to call multiple times — only
   * the first call establishes the connection.
   */
  async connect(): Promise<void> {
    if (this.client !== undefined) {
      return;
    }

    const transport = new StreamableHTTPClientTransport(
      new URL(`http://localhost:${this.port}/mcp`),
    );

    this.client = new Client(
      { name: 'idl-langchain-client', version: '1.0.0' },
      { capabilities: {} },
    );

    await this.client.connect(transport);
  }

  /**
   * Disconnect and discard the current client instance.
   */
  async disconnect(): Promise<void> {
    if (this.client === undefined) {
      return;
    }
    try {
      await this.client.close();
    } finally {
      this.client = undefined;
    }
  }

  /**
   * Return the underlying SDK `Client` instance.
   * @throws if `connect()` has not been called yet.
   */
  getClient(): Client {
    if (this.client === undefined) {
      throw new Error('[MCPClient] Not connected — call connect() first');
    }
    return this.client;
  }
}
