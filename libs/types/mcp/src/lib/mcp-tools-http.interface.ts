import {
  MCPTool_GetENVIToolParameters,
  MCPToolParams_GetENVIToolParameters,
} from './http/mcp-tool-get-envi-tool-parameters.interface';
import {
  MCPTool_GetResource,
  MCPToolParams_GetResource,
} from './http/mcp-tool-get-resource.interface';
import {
  MCPTool_GetRoutineDocs,
  MCPToolParams_GetRoutineDocs,
} from './http/mcp-tool-get-routine-docs.interface';
import {
  MCPTool_ListAllResources,
  MCPToolParams_ListAllResources,
} from './http/mcp-tool-list-all-resources.interface';
import {
  MCPTool_ListENVITools,
  MCPToolParams_ListENVITools,
} from './http/mcp-tool-list-envi-tools.interface';
import {
  MCPTool_SearchForFiles,
  MCPToolParams_SearchForFiles,
} from './http/mcp-tool-search-for-files.interface';
import {
  MCPTool_SearchForRoutine,
  MCPToolParams_SearchForRoutine,
} from './http/mcp-tool-search-for-routine.interface';
import {
  MCPTool_SearchResources,
  MCPToolParams_SearchResources,
} from './http/mcp-tool-search-resources.interface';

/**
 * All MCP tools (some are server-only, no contact with IDL/ENVI)
 */
export type MCPTools_HTTP =
  | MCPTool_GetENVIToolParameters
  | MCPTool_GetResource
  | MCPTool_GetRoutineDocs
  | MCPTool_ListAllResources
  | MCPTool_ListENVITools
  | MCPTool_SearchForFiles
  | MCPTool_SearchForRoutine
  | MCPTool_SearchResources;

/**
 * MCP parameters and payload sent to VSCode to run an MCP tool
 * that requires ENVI or IDL
 */
export type MCPToolParams_HTTP<T extends MCPTools_HTTP> =
  T extends MCPTool_GetENVIToolParameters
    ? MCPToolParams_GetENVIToolParameters
    : T extends MCPTool_ListENVITools
    ? MCPToolParams_ListENVITools
    : T extends MCPTool_GetResource
    ? MCPToolParams_GetResource
    : T extends MCPTool_GetRoutineDocs
    ? MCPToolParams_GetRoutineDocs
    : T extends MCPTool_ListAllResources
    ? MCPToolParams_ListAllResources
    : T extends MCPTool_SearchForRoutine
    ? MCPToolParams_SearchForRoutine
    : T extends MCPTool_SearchResources
    ? MCPToolParams_SearchResources
    : T extends MCPTool_SearchForFiles
    ? MCPToolParams_SearchForFiles
    : never;
