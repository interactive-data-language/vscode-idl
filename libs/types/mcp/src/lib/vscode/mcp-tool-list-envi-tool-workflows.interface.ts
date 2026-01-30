import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when we list known ENVI Tool workflows
 */
export type MCPTool_ListENVIToolWorkflows = 'list-envi-tool-workflows';

/**
 * Parameters for listing ENVI tool workflows
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_ListENVIToolWorkflows {}

/**
 * Response for listing ENVI Tool workflows
 */
export interface MCPToolResponse_ListENVIToolWorkflows
  extends IMCPToolVSCode_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
  /** The known workflows by name and value */
  workflows: { [key: string]: string };
}
