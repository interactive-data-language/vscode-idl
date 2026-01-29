/**
 * MCP Tool to search for files
 */
export type MCPTool_SearchForFiles = 'search-for-files';

/**
 * Parameters for searching for files
 */
export interface MCPToolParams_SearchForFiles {
  /** File extensions to look for */
  extensions?: string[];
  /** Folder to search */
  folder: string;
  /** Recursively search for files or not */
  recursive: boolean;
}
