/**
 * Message when get one or more known workflow from ENVI
 */
export type MCPTool_GetENVIToolWorkflow = 'get-envi-tool-workflow';

/**
 * Parameters for getting one or more known workflows from ENVI
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_GetENVIToolWorkflows {
  /** Name of the workflow to return */
  name: string;
}
