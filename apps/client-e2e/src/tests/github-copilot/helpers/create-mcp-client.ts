import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

/**
 * Flag if we created a client
 */
export let CREATED_CLIENT = false;

/**
 * Reference to the client
 */
export let MCP_CLIENT: Client;

/**
 * Create a client connection to the MCP server
 *
 * Create and re-use one
 */
export async function CreateMCPClient(port: number) {
  if (CREATED_CLIENT) {
    return MCP_CLIENT;
  }

  // Create transport
  const transport = new StreamableHTTPClientTransport(
    new URL(`http://localhost:${port}/mcp`)
  );

  // Create client
  MCP_CLIENT = new Client(
    {
      name: 'idl-vscode-test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  // Connect
  await MCP_CLIENT.connect(transport);

  // update flag
  CREATED_CLIENT = true;

  // return the client
  return MCP_CLIENT;
}
