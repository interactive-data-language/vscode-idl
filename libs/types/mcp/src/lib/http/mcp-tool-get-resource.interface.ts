/**
 * Get a resource from the server
 */
export type MCPTool_GetResource = 'get-resource';

/**
 * Parameters for getting a resource
 */
export interface MCPToolParams_GetResource {
  /** Names of resources to return */
  names: string[];
}
