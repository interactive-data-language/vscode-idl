import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when we want to create an IDL Notebook
 */
export type MCPTool_CreateIDLNotebook = 'create-idl-notebook';

/**
 * Parameters for creating an IDL Notebook
 */
export interface MCPToolParams_CreateIDLNotebook {
  /**
   * The notebook cells
   */
  cells: { type: 'code' | 'markdown'; content: string }[];
  /** File on disk to create */
  uri: string;
}

/**
 * Response for creating an IDL Notebook
 */
export type MCPToolResponse_CreateIDLNotebook = IMCPToolVSCode_BaseResponse;
