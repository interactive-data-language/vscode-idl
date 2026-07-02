/**
 * Save an ENVI Tool Workflow to disk for re-use
 */
export type MCPTool_SaveENVIToolWorkflow = 'save-envi-tool-workflow';

/**
 * Parameters for Save ENVI Tool Workflow
 */
export interface MCPToolParams_SaveENVIToolWorkflow {
  /** The full markdown content describing the workflow steps and instructions */
  workflowContent: string;
  /** The name of the workflow to save (used as the file name) */
  workflowName: string;
}

/**
 * Response for Save ENVI Tool Workflow
 */
export interface MCPToolResponse_SaveENVIToolWorkflow {
  /** The absolute path to the saved workflow file */
  filePath?: string;
}
