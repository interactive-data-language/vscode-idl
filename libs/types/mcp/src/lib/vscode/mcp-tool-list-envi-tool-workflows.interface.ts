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
 *
 * On success, lists workflows by name and then
 * the content for the workflows
 */
export type MCPToolResponse_ListENVIToolWorkflows =
  IMCPToolVSCode_BaseResponse<{ [key: string]: string }>;
