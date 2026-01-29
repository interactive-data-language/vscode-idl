/**
 * Search resources
 */
export type MCPTool_SearchResources = 'search-resources';

/**
 * Parameters for resources we search for
 */
export interface MCPToolParams_SearchResources {
  /** Fuzzy-search queries we search by */
  queries: string[];
}
