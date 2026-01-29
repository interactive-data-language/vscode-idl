/**
 * Message when query what parameters a specific ENVI Task
 */
export type MCPTool_GetENVIToolParameters = 'get-envi-tool-parameters';

/**
 * Parameters for retrieving tool parameters
 */
export interface MCPToolParams_GetENVIToolParameters {
  /** Name of the task to get parameters for */
  taskName: string;
}
