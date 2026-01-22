/**
 * Message when query what parameters a specific ENVI Task
 */
export type MCPTool_ENVIGetToolParameters = 'get-envi-tool-parameters';

/**
 * Parameters for retrieving tool parameters
 */
export interface MCPToolParams_ENVIGetToolParameters {
  /** Name of the task to get parameters for */
  taskName: string;
}

/**
 * Message when query what tasks ENVI can run
 */
export type MCPTool_ENVIListTools = 'list-envi-tools';

/**
 * Parameters for listing what tools are available
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_ENVIListTools {}

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

/**
 * List available resources
 */
export type MCPTool_ResourcesListAll = 'list-all-resources';

/**
 * Parameters for listing all resources
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MCPToolParams_ResourcesListAll {}

/**
 * Get a resource from the server
 */
export type MCPTool_ResourcesGetResource = 'get-resource';

/**
 * Parameters for getting a resource
 */
export interface MCPToolParams_ResourcesGetResource {
  /** Names of resources to return */
  names: string[];
}

/**
 * Type when searching for routine docs
 */
export type GetRoutineDocsRoutineType =
  | 'Function'
  | 'FunctionMethod'
  | 'Procedure'
  | 'ProcedureMethod'
  | 'StructureOrClassDefinition'
  | 'SystemVariable';

/**
 * Search global tokens for routine
 */
export type MCPTool_ResourcesGetRoutineDocs = 'get-routine-docs';

/**
 * Parameters for routines to return docs for
 */
export interface MCPToolParams_ResourcesGetRoutineDocs {
  /** Routines to return */
  routines: { name: string; type: GetRoutineDocsRoutineType }[];
}

/**
 * Find matching routine names
 */
export type MCPTool_ResourcesSearchForRoutine = 'search-for-routine';

/**
 * Parameters for routines to search for
 */
export interface MCPToolParams_ResourcesSearchForRoutine {
  /** Routines to search for */
  routines: { name: string; type: 'All' | GetRoutineDocsRoutineType }[];
}

/**
 * Search resources
 */
export type MCPTool_ResourcesSearchResources = 'search-resources';

/**
 * Parameters for resources we search for
 */
export interface MCPToolParams_ResourcesSearchResources {
  /** Fuzzy-search queries we search by */
  queries: string[];
}

/**
 * All MCP tools (some are server-only, no contact with IDL/ENVI)
 */
export type MCPTools_HTTP =
  | MCPTool_ENVIGetToolParameters
  | MCPTool_ENVIListTools
  | MCPTool_ResourcesGetResource
  | MCPTool_ResourcesGetRoutineDocs
  | MCPTool_ResourcesListAll
  | MCPTool_ResourcesSearchForRoutine
  | MCPTool_ResourcesSearchResources
  | MCPTool_SearchForFiles;

/**
 * MCP parameters and payload sent to VSCode to run an MCP tool
 * that requires ENVI or IDL
 */
export type MCPToolParams_HTTP<T extends MCPTools_HTTP> =
  T extends MCPTool_ENVIGetToolParameters
    ? MCPToolParams_ENVIGetToolParameters
    : T extends MCPTool_ENVIListTools
    ? MCPToolParams_ENVIListTools
    : T extends MCPTool_ResourcesGetResource
    ? MCPToolParams_ResourcesGetResource
    : T extends MCPTool_ResourcesGetRoutineDocs
    ? MCPToolParams_ResourcesGetRoutineDocs
    : T extends MCPTool_ResourcesListAll
    ? MCPToolParams_ResourcesListAll
    : T extends MCPTool_ResourcesSearchForRoutine
    ? MCPToolParams_ResourcesSearchForRoutine
    : T extends MCPTool_ResourcesSearchResources
    ? MCPToolParams_ResourcesSearchResources
    : T extends MCPTool_SearchForFiles
    ? MCPToolParams_SearchForFiles
    : never;
