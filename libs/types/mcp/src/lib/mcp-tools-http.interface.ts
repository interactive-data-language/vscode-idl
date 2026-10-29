import type {
  CallToolResult,
  ImageContent,
  TextContent,
} from '@modelcontextprotocol/server';

import type {
  MCPTool_CreateENVIModelerWorkflow,
  MCPToolParams_CreateENVIModelerWorkflow,
} from './http/mcp-tool-create-envi-modeler-workflow.interface';
import type {
  MCPTool_CreateFolder,
  MCPToolParams_CreateFolder,
} from './http/mcp-tool-create-folder.interface';
import type {
  MCPTool_GetENVIToolParameters,
  MCPToolParams_GetENVIToolParameters,
} from './http/mcp-tool-get-envi-tool-parameters.interface';
import type {
  MCPTool_GetENVIToolWorkflow,
  MCPToolParams_GetENVIToolWorkflows,
} from './http/mcp-tool-get-envi-tool-workflow.interface';
import type {
  MCPTool_GetResource,
  MCPToolParams_GetResource,
} from './http/mcp-tool-get-resource.interface';
import type {
  MCPTool_GetRoutineDocs,
  MCPToolParams_GetRoutineDocs,
} from './http/mcp-tool-get-routine-docs.interface';
import type {
  MCPTool_GetSkill,
  MCPToolParams_GetSkill,
} from './http/mcp-tool-get-skill.interface';
import type {
  MCPTool_ListAllResources,
  MCPToolParams_ListAllResources,
} from './http/mcp-tool-list-all-resources.interface';
import type {
  MCPTool_ListENVITools,
  MCPToolParams_ListENVITools,
} from './http/mcp-tool-list-envi-tools.interface';
import type {
  MCPTool_ListSkills,
  MCPToolParams_ListSkills,
} from './http/mcp-tool-list-skills.interface';
import type {
  MCPTool_SaveENVIToolWorkflow,
  MCPToolParams_SaveENVIToolWorkflow,
} from './http/mcp-tool-save-envi-tool-workflow.interface';
import type {
  MCPTool_SearchForFiles,
  MCPToolParams_SearchForFiles,
} from './http/mcp-tool-search-for-files.interface';
import type {
  MCPTool_SearchForRoutine,
  MCPToolParams_SearchForRoutine,
} from './http/mcp-tool-search-for-routine.interface';
import type {
  MCPTool_SearchResources,
  MCPToolParams_SearchResources,
} from './http/mcp-tool-search-resources.interface';

/**
 * All MCP tools (some are server-only, no contact with IDL/ENVI)
 */
export type MCPTools_HTTP =
  | MCPTool_CreateENVIModelerWorkflow
  | MCPTool_CreateFolder
  | MCPTool_GetENVIToolParameters
  | MCPTool_GetENVIToolWorkflow
  | MCPTool_GetResource
  | MCPTool_GetRoutineDocs
  | MCPTool_GetSkill
  | MCPTool_ListAllResources
  | MCPTool_ListENVITools
  | MCPTool_ListSkills
  | MCPTool_SaveENVIToolWorkflow
  | MCPTool_SearchForFiles
  | MCPTool_SearchForRoutine
  | MCPTool_SearchResources;

/**
 * MCP parameters and payload sent to VSCode to run an MCP tool
 * that requires ENVI or IDL
 */
export type MCPToolParams_HTTP<T extends MCPTools_HTTP> =
  T extends MCPTool_CreateENVIModelerWorkflow
    ? MCPToolParams_CreateENVIModelerWorkflow
    : T extends MCPTool_CreateFolder
      ? MCPToolParams_CreateFolder
      : T extends MCPTool_GetENVIToolParameters
        ? MCPToolParams_GetENVIToolParameters
        : T extends MCPTool_GetENVIToolWorkflow
          ? MCPToolParams_GetENVIToolWorkflows
          : T extends MCPTool_GetResource
            ? MCPToolParams_GetResource
            : T extends MCPTool_GetRoutineDocs
              ? MCPToolParams_GetRoutineDocs
              : T extends MCPTool_GetSkill
                ? MCPToolParams_GetSkill
                : T extends MCPTool_ListAllResources
                  ? MCPToolParams_ListAllResources
                  : T extends MCPTool_ListENVITools
                    ? MCPToolParams_ListENVITools
                    : T extends MCPTool_ListSkills
                      ? MCPToolParams_ListSkills
                      : T extends MCPTool_SaveENVIToolWorkflow
                        ? MCPToolParams_SaveENVIToolWorkflow
                        : T extends MCPTool_SearchForFiles
                          ? MCPToolParams_SearchForFiles
                          : T extends MCPTool_SearchForRoutine
                            ? MCPToolParams_SearchForRoutine
                            : T extends MCPTool_SearchResources
                              ? MCPToolParams_SearchResources
                              : never;

/**
 * CallToolResult with content restricted to TextContent only
 */
export type MCPToolHTTPResponse_HTTP = {
  /** Content returned */
  content: (ImageContent | TextContent)[];
  /** If an error */
  isError: boolean; // make sure it is included
} & Omit<CallToolResult, 'content'>;
