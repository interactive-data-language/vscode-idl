import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import * as express from 'express';

import {
  MCP_MESSAGE_ENDPOINT,
  MCP_SERVER_CONFIG,
} from './mcp-server.interface';

/**
 * Check if server is started or not
 */
let IS_MCP_SERVER_STARTED = false;

/**
 * MCP server instance
 */
export let MCP_SERVER: McpServer;

/**
 * Starts an express server for to serve up static docs content
 */
export function StartMCPServer(
  failCallback: (err: any) => void,
  port = MCP_SERVER_CONFIG.PORT
) {
  /**
   * Return if already started
   */
  if (IS_MCP_SERVER_STARTED) {
    return;
  }

  // Initialize MCP server
  MCP_SERVER = new McpServer({
    name: 'My SSE MCP Server',
    version: '1.0.0',
  });

  /** Create express app */
  const app = express();

  /**
   * handle exceptions
   */
  process.on('uncaughtException', (err) => {
    if (err.message.includes('EADDRINUSE')) {
      failCallback(err);
    } else {
      console.error(err);
    }
  });

  // from : https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#server-side-compatibility

  // Store transports for each session type
  const transports: { [key: string]: SSEServerTransport } = {};

  // Legacy SSE endpoint for older clients
  app.get('/sse', async (req, res) => {
    // Create SSE transport for legacy clients
    const transport = new SSEServerTransport(MCP_MESSAGE_ENDPOINT, res);
    transports[transport.sessionId] = transport;

    res.on('close', () => {
      delete transports[transport.sessionId];
    });

    await MCP_SERVER.connect(transport);
  });

  // Legacy message endpoint for older clients
  app.post(MCP_MESSAGE_ENDPOINT, async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).send('No transport found for sessionId');
    }
  });

  /** Listen on the port */
  app.listen(port);

  /** update flag that the server started */
  IS_MCP_SERVER_STARTED = true;
}
