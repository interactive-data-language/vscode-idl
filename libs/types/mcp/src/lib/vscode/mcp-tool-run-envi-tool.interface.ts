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
 * Response for starting ENVI
 */
export interface MCPToolResponse_RunENVITool
  extends IMCPToolVSCode_BaseResponse {
  /** output from IDL */
  idlOutput?: string;
  /** output parameters */
  outputParameters: {
    [key: string]: any;
  };
}
