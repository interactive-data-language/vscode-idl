/**
 * MCP Tool to create a folder
 */
export type MCPTool_CreateFolder = 'create-folder';

/**
 * Parameters for creating a folder
 */
export interface MCPToolParams_CreateFolder {
  /** The fully qualified path of the folder to create */
  folder: string;
}
