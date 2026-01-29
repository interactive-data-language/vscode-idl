import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when we return notes for IDL and ENVI Tasks
 */
export type MCPTool_ReturnNotes = 'return-notes';

/**
 * Parameters for running IDL code
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_ReturnNotes {}

/**
 * Response for running IDL code
 */
export interface MCPToolResponse_ReturnNotes
  extends IMCPToolVSCode_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
  /** The notes for tasks */
  notes: {
    envi: { [key: string]: string[] };
    idl: { [key: string]: string[] };
  };
}
