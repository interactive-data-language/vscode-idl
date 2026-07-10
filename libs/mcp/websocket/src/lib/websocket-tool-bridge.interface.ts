import {
  MCPToolParams,
  MCPToolResponse_VSCode,
  MCPTools_VSCode,
} from '@idl/types/mcp';

/**
 * Error message returned when a tool dispatch is attempted with no
 * connected WebSocket client.
 */
export const NO_WEBSOCKET_CLIENT_ERROR = 'No WebSocket client connected';

/**
 * WebSocket close reason sent to a second client attempting to connect while
 * one is already attached. Used with close code `1013` (Try Again Later).
 */
export const SINGLE_CONNECTION_CLOSE_REASON =
  'server busy: single connection only';

/**
 * Shape of an outgoing tool-dispatch request sent to the WS client.
 */
export interface IWebSocketNotification<T extends MCPTools_VSCode> {
  /** Typed tool parameters for the dispatched tool. */
  params: MCPToolParams<T>;
  /** MCP tool name being dispatched. */
  tool: T;
}

/**
 * Shape of an outgoing tool-dispatch request sent to the WS client.
 */
export interface IWebSocketRequest<T extends MCPTools_VSCode>
  extends IWebSocketNotification<T> {
  /** Correlation id (server-generated UUID). */
  id: string;
}

/**
 * Shape of an incoming reply from the WS client. Discriminated on `succeeded`.
 * The bridge translates this `IENVISuccess` wire shape to
 * `IMCPToolVSCode_BaseResponse` before resolving the dispatch promise.
 *
 * The `payload` field should match the corresponding `IENVIPayload_*` interface
 * from `@idl/types/mcp` for the tool being invoked. See `envi-payload.interface.ts`
 * for the expected payload shapes per tool.
 */
export type WebSocketToolResponse<T extends MCPTools_VSCode> = {
  id: string;
} & MCPToolResponse_VSCode<T>;

/**
 * Pending in-flight request awaiting a response from the WS client.
 */
export interface IPendingRequest {
  /** Rejects the `dispatch()` promise. */
  reject: (err: Error) => void;
  /** Resolves the `dispatch()` promise with the translated MCP result. */
  resolve: (result: any) => void;
  /** MCP tool name — retained for error messages on disconnect. */
  tool: string;
}
