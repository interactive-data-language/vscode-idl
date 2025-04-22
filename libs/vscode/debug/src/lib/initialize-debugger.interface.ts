import { MCPTools } from '@idl/types/mcp';
import {
  MCP_LSP_MessagePayload,
  MCP_LSP_MessageResponse,
} from '@idl/vscode/events/messages';

import { IDLDebugAdapter } from './idl-debug-adapter.class';
import { IDLDebugStatusBar } from './idl-debug-status-bar';

/**
 * Results from initializing debugger
 */
export interface IInitializeDebuggerResult {
  /** Debug adapter for IDL */
  adapter: IDLDebugAdapter;
  /** Handler for MCP callbacks */
  mcpHandler: (
    payload: MCP_LSP_MessagePayload<MCPTools>
  ) => Promise<MCP_LSP_MessageResponse<MCPTools>>;
  /** Status bar tied into debugging */
  statusBar: IDLDebugStatusBar;
}
