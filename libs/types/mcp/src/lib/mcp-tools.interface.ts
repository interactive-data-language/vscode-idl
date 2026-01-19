import {
  MCPTool_ENVIGetToolParameters,
  MCPTool_ENVIListTools,
  MCPTool_ResourcesGetResource,
  MCPTool_ResourcesListAll,
  MCPTool_ResourcesSearchForRoutine,
  MCPTool_ResourcesSearchResources,
  MCPTool_SearchForFiles,
  MCPToolsHTTP,
} from './mcp-tools-http.interface';
import {
  MCPTool_ENVIOpenDatasets,
  MCPTool_ENVIQueryDataset,
  MCPTool_ENVIRunTool,
  MCPTool_ENVIStart,
  MCPTool_IDLCreateNotebook,
  MCPTool_IDLExecuteCode,
  MCPTool_IDLExecuteFile,
  MCPTool_IDLReturnNotes,
  MCPTool_IDLStart,
  MCPToolParams_VSCode,
  MCPToolResponse_VSCode,
  MCPTools_VSCode,
} from './mcp-tools-vscode.interface';

/**
 * All MCP tools
 */
export type MCPTools = MCPTools_VSCode | MCPToolsHTTP;

/**
 * All MCP tool parameters
 */
export type MCPToolParams<T extends MCPTools> = T extends MCPTools_VSCode
  ? MCPToolParams_VSCode<T>
  : never;

/**
 * Payloads for all MCP messages
 */
export type MCPToolResponse<T extends MCPTools> = T extends MCPTools_VSCode
  ? MCPToolResponse_VSCode<T>
  : never;
/**
 * Strictly typed messages that we can send back and forth
 */
interface IMCPToolLookup {
  /** Query parameters for tasks ENVI has */
  ENVI_GET_TOOL_PARAMETERS: MCPTool_ENVIGetToolParameters;
  /** Query ENVI's tasks */
  ENVI_LIST_TOOLS: MCPTool_ENVIListTools;
  /** Open a dataset in ENVI */
  ENVI_OPEN_DATASETS: MCPTool_ENVIOpenDatasets;
  /** Get additional information about a dataset */
  ENVI_QUERY_DATASET: MCPTool_ENVIQueryDataset;
  /** Run ENVI Task */
  ENVI_RUN_TOOL: MCPTool_ENVIRunTool;
  /** Start ENVI */
  ENVI_START: MCPTool_ENVIStart;
  /** Create an IDL Notebook */
  IDL_CREATE_NOTEBOOK: MCPTool_IDLCreateNotebook;
  /** Run code in IDL */
  IDL_EXECUTE_CODE: MCPTool_IDLExecuteCode;
  /** Run code in IDL that comes from a file */
  IDL_EXECUTE_FILE: MCPTool_IDLExecuteFile;
  /** RETURN NOTES FOR ENVI AND IDL TASKS */
  IDL_RETURN_NOTES: MCPTool_IDLReturnNotes;
  /** Start IDL */
  IDL_START: MCPTool_IDLStart;
  /** Get a specific resource from the server */
  RESOURCES_GET_RESOURCE: MCPTool_ResourcesGetResource;
  /** List all resources */
  RESOURCES_LIST_ALL: MCPTool_ResourcesListAll;
  /** Search for a particular routine */
  RESOURCES_SEARCH_FOR_ROUTINE: MCPTool_ResourcesSearchForRoutine;
  /** Search all resources */
  RESOURCES_SEARCH_RESOURCES: MCPTool_ResourcesSearchResources;
  /** Search a location for files */
  SEARCH_FOR_FILES: MCPTool_SearchForFiles;
}

/**
 * Lookup with types of messages
 */
export const MCP_TOOL_LOOKUP: IMCPToolLookup = {
  ENVI_OPEN_DATASETS: 'open-datasets-in-envi',
  ENVI_QUERY_DATASET: 'query-dataset-with-envi',
  ENVI_LIST_TOOLS: 'list-envi-tools',
  ENVI_GET_TOOL_PARAMETERS: 'get-envi-tool-parameters',
  ENVI_RUN_TOOL: 'run-envi-tool',
  ENVI_START: 'start-envi',
  IDL_CREATE_NOTEBOOK: 'create-idl-notebook',
  IDL_EXECUTE_CODE: 'execute-idl-code',
  IDL_EXECUTE_FILE: 'execute-idl-file',
  IDL_RETURN_NOTES: 'return-notes',
  IDL_START: 'start-idl',
  RESOURCES_GET_RESOURCE: 'get-resource',
  RESOURCES_LIST_ALL: 'list-all-resources',
  RESOURCES_SEARCH_FOR_ROUTINE: 'search-for-routine',
  RESOURCES_SEARCH_RESOURCES: 'search-resources',
  SEARCH_FOR_FILES: 'search-for-files',
};
