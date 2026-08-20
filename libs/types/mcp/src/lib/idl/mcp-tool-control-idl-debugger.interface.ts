import { IMCPToolIDL_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message for controlling IDL debugger (breakpoints, stepping, etc.)
 */
export type MCPTool_ControlIDLDebugger = 'control-idl-debugger';

/**
 * Actions available for the IDL debugger tool
 */
export type ControlIDLDebuggerAction =
  | 'clear-all-breakpoints'
  | 'clear-breakpoint'
  | 'continue'
  | 'list-breakpoints'
  | 'set-breakpoint'
  | 'step-in'
  | 'step-out'
  | 'step-over';

/**
 * Parameters for controlling the IDL debugger
 */
export interface MCPToolParams_ControlIDLDebugger {
  /** The debugger action to perform */
  action: ControlIDLDebuggerAction;
  /** File path (required for set-breakpoint and clear-breakpoint) */
  file?: string;
  /** Line number (required for set-breakpoint and clear-breakpoint) */
  line?: number;
}

/**
 * Response for the IDL debugger tool
 */
export type MCPToolResponse_ControlIDLDebugger = IMCPToolIDL_BaseResponse<any>;
