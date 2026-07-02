import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * Message when we run an ENVI Task
 */
export type MCPTool_RunENVITool = 'run-envi-tool';

/**
 * Payload for running an ENVI Task
 */
export interface MCPToolParams_RunENVITool {
  /** Parameters */
  inputParameters: { [key: string]: any };
  /** Show UI for user to control execution? */
  interactive: boolean;
  /**
   * Name of the task
   */
  toolName: string;
  /** Fully qualified path to the task on disk */
  uri?: string;
}

/**
 * Response for running an ENVI tool
 *
 * On success, result is a JSON object of all parameters dehydrated + stringified
 */
export type MCPToolResponse_RunENVITool = IMCPToolVSCode_BaseResponse<{
  [key: string]: any;
}>;

/**
 * Simplified output returned by the MCP tool — just the output parameters object
 */
export type MCPToolOutput_RunENVITool = MCPToolResponse_RunENVITool['result'];
