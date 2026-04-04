import { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types';

import {
  MCPTool_CreateENVIModelerWorkflow,
  MCPToolParams_CreateENVIModelerWorkflow,
} from './http/mcp-tool-create-envi-modeler-workflow.interface';
import {
  MCPTool_GetENVIToolParameters,
  MCPToolParams_GetENVIToolParameters,
} from './http/mcp-tool-get-envi-tool-parameters.interface';
import {
  MCPTool_GetENVIToolWorkflow,
  MCPToolParams_GetENVIToolWorkflows,
} from './http/mcp-tool-get-envi-tool-workflow.interface';
import {
  MCPTool_GetPrompt,
  MCPToolParams_GetPrompt,
} from './http/mcp-tool-get-prompt.interface';
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
  MCPTool_ListPrompts,
  MCPToolParams_ListPrompts,
} from './http/mcp-tool-list-prompts.interface';
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
  | MCPTool_CreateENVIModelerWorkflow
  | MCPTool_GetENVIToolParameters
  | MCPTool_GetENVIToolWorkflow
  | MCPTool_GetPrompt
  | MCPTool_GetResource
  | MCPTool_GetRoutineDocs
  | MCPTool_ListAllResources
  | MCPTool_ListENVITools
  | MCPTool_ListPrompts
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
    : T extends MCPTool_GetENVIToolParameters
      ? MCPToolParams_GetENVIToolParameters
      : T extends MCPTool_GetENVIToolWorkflow
        ? MCPToolParams_GetENVIToolWorkflows
        : T extends MCPTool_GetPrompt
          ? MCPToolParams_GetPrompt
          : T extends MCPTool_GetResource
            ? MCPToolParams_GetResource
            : T extends MCPTool_GetRoutineDocs
              ? MCPToolParams_GetRoutineDocs
              : T extends MCPTool_ListAllResources
                ? MCPToolParams_ListAllResources
                : T extends MCPTool_ListENVITools
                  ? MCPToolParams_ListENVITools
                  : T extends MCPTool_SearchForFiles
                    ? MCPToolParams_SearchForFiles
                    : T extends MCPTool_SearchForRoutine
                      ? MCPToolParams_SearchForRoutine
                      : T extends MCPTool_ListPrompts
                        ? MCPToolParams_ListPrompts
                        : T extends MCPTool_SearchResources
                          ? MCPToolParams_SearchResources
                          : never;

/**
 * CallToolResult with content restricted to TextContent only
 */
export type MCPToolHTTPResponse_HTTP = {
  /** Content returned */
  content: TextContent[];
  /** If an error */
  isError: boolean; // make sure it is included
} & Omit<CallToolResult, 'content'>;
