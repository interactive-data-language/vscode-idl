/**
 * Message when query what parameters a specific ENVI Task
 */
export type MCPTool_ENVIGetToolParameters = 'get-envi-tool-parameters';

/**
 * Message when query what tasks ENVI can run
 */
export type MCPTool_ENVIListTools = 'list-envi-tools';

/**
 * MCP Tool to search for files
 */
export type MCPTool_SearchForFiles = 'search-for-files';

/**
 * List available resources
 */
export type MCPTool_ResourcesListAll = 'list-all-resources';

/**
 * Get a resource from the server
 */
export type MCPTool_ResourcesGetResource = 'get-resource';

/**
 * Search global tokens for routine
 */
export type MCPTool_ResourcesSearchForRoutine = 'search-for-routine';

/**
 * Search resources
 */
export type MCPTool_ResourcesSearchResources = 'search-resources';

/**
 * All MCP tools (some are server-only, no contact with IDL/ENVI)
 */
export type MCPToolsHTTP =
  | MCPTool_ENVIGetToolParameters
  | MCPTool_ENVIListTools
  | MCPTool_ResourcesGetResource
  | MCPTool_ResourcesListAll
  | MCPTool_ResourcesSearchForRoutine
  | MCPTool_ResourcesSearchResources
  | MCPTool_SearchForFiles;
