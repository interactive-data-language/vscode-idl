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
 *
 * On success, returns notes for ENVI Tasks and IDL Tasks by task name
 */
export type MCPToolResponse_ReturnNotes = IMCPToolVSCode_BaseResponse<{
  envi: { [key: string]: string[] };
  idl: { [key: string]: string[] };
}>;
