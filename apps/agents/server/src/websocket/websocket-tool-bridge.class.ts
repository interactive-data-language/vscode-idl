import {
  MCPToolParams_VSCode,
  MCPToolResponse_VSCode,
  MCPTools_VSCode,
} from '@idl/types/mcp';
import type { Server as HttpServer } from 'http';
import { nanoid } from 'nanoid';
import { WebSocket, WebSocketServer } from 'ws';

import {
  IPendingRequest,
  IWebSocketNotification,
  IWebSocketRequest,
  NO_WEBSOCKET_CLIENT_ERROR,
  SINGLE_CONNECTION_CLOSE_REASON,
  WebSocketToolResponse,
} from './websocket-tool-bridge.interface';

/**
 * Single-client WebSocket bridge for forwarding MCP tool execution to a
 * remote handler.
 *
 * Attaches a `WebSocketServer` to an existing `http.Server` via the `upgrade`
 * event so it can share the Express port. Only one client may be connected at
 * a time; additional connections are refused immediately with close code
 * `1013`. When no client is connected, `dispatch()` rejects synchronously so
 * the calling MCP handler surfaces a clear error to the model.
 */
export class WebSocketToolBridge {
  private client: undefined | WebSocket;
  private readonly pending = new Map<string, IPendingRequest>();
  private wss: undefined | WebSocketServer;

  /**
   * Attach the bridge to an existing HTTP server, listening for upgrade
   * requests at the given path. Safe to call once per instance.
   */
  attach(server: HttpServer, path: string): void {
    if (this.wss !== undefined) {
      throw new Error('WebSocketToolBridge is already attached');
    }

    this.wss = new WebSocketServer({ noServer: true });
    const wss = this.wss;

    server.on('upgrade', (req, socket, head) => {
      const url = req.url ?? '';
      const pathname = url.split('?')[0];
      if (pathname !== path) {
        return;
      }
      wss.handleUpgrade(req, socket, head, (ws) => {
        this.handleConnection(ws);
      });
    });
  }

  /**
   * Close the connected client (if any) and shut down the WebSocket server.
   * Rejects any pending requests. Idempotent.
   */
  async close(): Promise<void> {
    this.rejectAllPending(new Error('WebSocket bridge closing'));

    if (this.client !== undefined) {
      try {
        this.client.close(1001, 'server shutting down');
      } catch {
        // ignore
      }
      this.client = undefined;
    }

    if (this.wss !== undefined) {
      const wss = this.wss;
      this.wss = undefined;
      await new Promise<void>((resolve) => {
        wss.close(() => resolve());
      });
    }
  }

  /** True when a WebSocket client is currently connected. */
  isConnected(): boolean {
    return (
      this.client !== undefined && this.client.readyState === WebSocket.OPEN
    );
  }

  /**
   * Send a tool-execution request to the connected client and await its
   * reply. Rejects immediately if no client is connected, and rejects any
   * in-flight promise if the client disconnects before replying.
   */
  sendNotification<T extends MCPTools_VSCode>(
    tool: T,
    params: MCPToolParams_VSCode<T>,
  ): void {
    const client = this.client;
    if (client === undefined || client.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(NO_WEBSOCKET_CLIENT_ERROR)) as any;
    }

    const request: IWebSocketNotification<T> = { tool, params };
    client.send(JSON.stringify(request));
  }

  /**
   * Send a tool-execution request to the connected client and await its
   * reply. Rejects immediately if no client is connected, and rejects any
   * in-flight promise if the client disconnects before replying.
   */
  sendRequest<T extends MCPTools_VSCode>(
    tool: T,
    params: MCPToolParams_VSCode<T>,
  ): Promise<MCPToolResponse_VSCode<T>> {
    const client = this.client;
    if (client === undefined || client.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(NO_WEBSOCKET_CLIENT_ERROR));
    }

    const id = nanoid();
    const request: IWebSocketRequest<T> = { id, tool, params };

    return new Promise<MCPToolResponse_VSCode<T>>((resolve, reject) => {
      this.pending.set(id, { tool, resolve, reject });
      try {
        client.send(JSON.stringify(request));
      } catch (err) {
        this.pending.delete(id);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  /**
   * Handle a newly upgraded WebSocket connection. Enforces the
   * single-client contract and wires up message / lifecycle listeners.
   */
  private handleConnection(ws: WebSocket): void {
    if (this.isConnected()) {
      console.log(
        `Websocket already connected, so we are going to close the connection`,
      );
      ws.close(1013, SINGLE_CONNECTION_CLOSE_REASON);
      return;
    }

    this.client = ws;
    console.log('[websocket-bridge] client connected');

    ws.on('message', (raw) => {
      this.handleMessage(ws, raw.toString());
    });

    const cleanup = (reason: string) => {
      this.client = undefined;
      this.rejectAllPending(
        new Error(`WebSocket client disconnected: ${reason}`),
      );
      console.log(`[websocket-bridge] client disconnected (${reason})`);
    };

    ws.on('close', (code, reasonBuf) => {
      cleanup(`code=${code} reason=${reasonBuf.toString() || 'none'}`);
    });
    ws.on('error', (err) => {
      cleanup(err.message);
    });
  }

  /**
   * Parse an incoming client message and resolve or reject the matching
   * pending request. Malformed or unknown-id messages are logged and dropped.
   */
  private handleMessage<T extends MCPTools_VSCode>(
    ws: WebSocket,
    raw: string,
  ): void {
    let parsed: WebSocketToolResponse<T>;
    try {
      parsed = JSON.parse(raw) as WebSocketToolResponse<T>;
    } catch (err) {
      console.warn('[websocket-bridge] dropping invalid JSON message:', err);
      return;
    }

    if (typeof parsed?.id !== 'string') {
      console.warn('[websocket-bridge] dropping message without id');
      return;
    }

    const entry = this.pending.get(parsed.id);
    if (entry === undefined) {
      ws.send(JSON.stringify({ message: 'Unknown ID' }));
      console.warn(
        `[websocket-bridge] dropping response for unknown id ${parsed.id}`,
      );
      return;
    }

    this.pending.delete(parsed.id);
    entry.resolve(parsed);
  }

  /**
   * Reject every in-flight dispatch with the given error and clear the map.
   */
  private rejectAllPending(err: Error): void {
    for (const entry of this.pending.values()) {
      entry.reject(err);
    }
    this.pending.clear();
  }
}
