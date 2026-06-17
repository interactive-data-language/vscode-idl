/**
 * Semantic search across ENVI tools
 */
export type MCPTool_SearchENVITools = 'search-envi-tools';

/**
 * Parameters for semantic tool search
 */
export interface MCPToolParams_SearchENVITools {
  /** Natural language description of the desired ENVI tool */
  query: string;
}
