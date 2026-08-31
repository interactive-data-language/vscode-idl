import {
  MCPToolHTTPResponse,
  MCPToolParams,
  MCPToolParams_ParameterOverride,
  MCPTools,
  MCPTools_ParameterOverride,
} from '@idl/types/mcp';
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
    new URL(`http://localhost:${port}/mcp`),
  );

  // Create client
  MCP_CLIENT = new Client(
    {
      name: 'idl-vscode-test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    },
  );

  // Connect
  await MCP_CLIENT.connect(transport);

  // update flag
  CREATED_CLIENT = true;

  // return the client
  return MCP_CLIENT;
}

/**
 * Calls an MCP tool via HTTP and returns the response
 *
 * Manually waits for our DEBUG_PAUSE constant after the
 * tool finished running to let objects catch up and
 * synchronize with the main VSCode window
 */
export async function CallMCPTool<T extends MCPTools>(
  tool: T,
  params: T extends MCPTools_ParameterOverride
    ? MCPToolParams_ParameterOverride<T>
    : MCPToolParams<T>,
) {
  // make sure we have connected
  if (!CREATED_CLIENT) {
    throw new Error('Must create MCP client before running a tool');
  }

  // call tool and strictly type
  const result = await (MCP_CLIENT.callTool({
    name: tool,
    arguments: params as any,
  }) as Promise<MCPToolHTTPResponse<T>>);

  // return result
  return result;
}
