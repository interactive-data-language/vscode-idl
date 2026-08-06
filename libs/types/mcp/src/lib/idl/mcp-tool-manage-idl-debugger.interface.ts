import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message for managing IDL debugger (breakpoints, stepping, etc.)
 */
export type MCPTool_ManageIDLDebugger = 'manage-idl-debugger';

/**
 * Actions available for the IDL debugger tool
 */
export type ManageIDLDebuggerAction =
  | 'set-breakpoint'
  | 'clear-breakpoint'
  | 'clear-all-breakpoints'
  | 'list-breakpoints'
  | 'continue'
  | 'step-in'
  | 'step-over'
  | 'step-out'
  | 'get-stack';

/**
 * Parameters for managing the IDL debugger
 */
export interface MCPToolParams_ManageIDLDebugger {
  /** The debugger action to perform */
  action: ManageIDLDebuggerAction;
  /** File path (required for set-breakpoint and clear-breakpoint) */
  file?: string;
  /** Line number (required for set-breakpoint and clear-breakpoint) */
  line?: number;
}

/**
 * Response for the IDL debugger tool
 */
export type MCPToolResponse_ManageIDLDebugger = IMCPToolIDL_BaseResponse<any>;
