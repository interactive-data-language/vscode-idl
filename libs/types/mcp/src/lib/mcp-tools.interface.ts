import { CallToolResult } from '@modelcontextprotocol/sdk/types';

import { MCPTool_GetENVIToolParameters } from './http/mcp-tool-get-envi-tool-parameters.interface';
import { MCPTool_GetENVIToolWorkflow } from './http/mcp-tool-get-envi-tool-workflow.interface';
import { MCPTool_GetPrompt } from './http/mcp-tool-get-prompt.interface';
import { MCPTool_GetResource } from './http/mcp-tool-get-resource.interface';
import { MCPTool_GetRoutineDocs } from './http/mcp-tool-get-routine-docs.interface';
import { MCPTool_ListAllResources } from './http/mcp-tool-list-all-resources.interface';
import { MCPTool_ListENVITools } from './http/mcp-tool-list-envi-tools.interface';
import { MCPTool_ListPrompts } from './http/mcp-tool-list-prompts.interface';
import { MCPTool_SearchForFiles } from './http/mcp-tool-search-for-files.interface';
import { MCPTool_SearchForRoutine } from './http/mcp-tool-search-for-routine.interface';
import { MCPTool_SearchResources } from './http/mcp-tool-search-resources.interface';
import { MCPToolParams_HTTP, MCPTools_HTTP } from './mcp-tools-http.interface';
import {
  MCPToolHTTPResponse_VSCode,
  MCPToolParams_VSCode,
  MCPToolResponse_VSCode,
  MCPTools_VSCode,
} from './mcp-tools-vscode.interface';
import { MCPTool_CreateIDLNotebook } from './vscode/mcp-tool-create-idl-notebook.interface';
import { MCPTool_ExecuteIDLCode } from './vscode/mcp-tool-execute-idl-code.interface';
import { MCPTool_ExecuteIDLFile } from './vscode/mcp-tool-execute-idl-file.interface';
import { MCPTool_ListENVIToolWorkflows } from './vscode/mcp-tool-list-envi-tool-workflows.interface';
import { MCPTool_ManageIDLAndENVISession } from './vscode/mcp-tool-manage-idl-and-envi-session.interface';
import { MCPTool_OpenDatasetsInENVI } from './vscode/mcp-tool-open-datasets-in-envi.interface';
import { MCPTool_QueryDatasetWithENVI } from './vscode/mcp-tool-query-dataset-with-envi.interface';
import { MCPTool_ReturnNotes } from './vscode/mcp-tool-return-notes.interface';
import { MCPTool_RunENVITool } from './vscode/mcp-tool-run-envi-tool.interface';

/**
 * All MCP tools
 */
export type MCPTools = MCPTools_HTTP | MCPTools_VSCode;

/**
 * All MCP tool parameters
 */
export type MCPToolParams<T extends MCPTools> = T extends MCPTools_HTTP
  ? MCPToolParams_HTTP<T>
  : T extends MCPTools_VSCode
  ? MCPToolParams_VSCode<T>
  : never;

/**
 * Payloads for all MCP messages
 */
export type MCPToolResponse<T extends MCPTools> = T extends MCPTools_VSCode
  ? MCPToolResponse_VSCode<T>
  : never;

/** What is the data type returned from our MCP call over HTTP */
export type MCPToolHTTPResponse<T extends MCPTools> = T extends MCPTools_VSCode
  ? MCPToolHTTPResponse_VSCode
  : T extends MCPTools_HTTP
  ? CallToolResult
  : never;

/**
 * Strictly typed messages that we can send back and forth
 */
interface IMCPToolLookup {
  /** Create an IDL Notebook */
  CREATE_IDL_NOTEBOOK: MCPTool_CreateIDLNotebook;
  /** Run code in IDL */
  EXECUTE_IDL_CODE: MCPTool_ExecuteIDLCode;
  /** Run code in IDL that comes from a file */
  EXECUTE_IDL_FILE: MCPTool_ExecuteIDLFile;
  /** Query parameters for tasks ENVI has */
  GET_ENVI_TOOL_PARAMETERS: MCPTool_GetENVIToolParameters;
  /** Get known ENVI workflow */
  GET_ENVI_TOOL_WORKFLOW: MCPTool_GetENVIToolWorkflow;
  /** Get a prompt (instruction set or tutorial) from the server */
  GET_PROMPT: MCPTool_GetPrompt;
  /** Get a specific resource from the server */
  GET_RESOURCE: MCPTool_GetResource;
  /** Retrieve docs for a routine */
  GET_ROUTINE_DOCS: MCPTool_GetRoutineDocs;
  /** List all resources */
  LIST_ALL_RESOURCES: MCPTool_ListAllResources;
  /** List know ENVI tool workflows */
  LIST_ENVI_TOOL_WORKFLOWS: MCPTool_ListENVIToolWorkflows;
  /** Query ENVI's tasks */
  LIST_ENVI_TOOLS: MCPTool_ListENVITools;
  /** List all prompts (instruction sets and tutorials) */
  LIST_PROMPTS: MCPTool_ListPrompts;
  /** Manage ENVI and IDL session */
  MANAGE_IDL_AND_ENVI_SESSION: MCPTool_ManageIDLAndENVISession;
  /** Open a dataset in ENVI */
  OPEN_DATASETS_IN_ENVI: MCPTool_OpenDatasetsInENVI;
  /** Get additional information about a dataset */
  QUERY_DATASET_WITH_ENVI: MCPTool_QueryDatasetWithENVI;
  /** RETURN NOTES FOR ENVI AND IDL TASKS */
  RETURN_NOTES: MCPTool_ReturnNotes;
  /** Run ENVI Task */
  RUN_ENVI_TOOL: MCPTool_RunENVITool;
  /** Search a location for files */
  SEARCH_FOR_FILES: MCPTool_SearchForFiles;
  /** Search for a particular routine */
  SEARCH_FOR_ROUTINE: MCPTool_SearchForRoutine;
  /** Search all resources */
  SEARCH_RESOURCES: MCPTool_SearchResources;
}

/**
 * Lookup with types of messages
 */
export const MCP_TOOL_LOOKUP: IMCPToolLookup = {
  CREATE_IDL_NOTEBOOK: 'create-idl-notebook',
  EXECUTE_IDL_CODE: 'execute-idl-code',
  EXECUTE_IDL_FILE: 'execute-idl-file',
  GET_ENVI_TOOL_PARAMETERS: 'get-envi-tool-parameters',
  GET_ENVI_TOOL_WORKFLOW: 'get-envi-tool-workflow',
  GET_PROMPT: 'get-prompt',
  GET_RESOURCE: 'get-resource',
  GET_ROUTINE_DOCS: 'get-routine-docs',
  LIST_ALL_RESOURCES: 'list-all-resources',
  LIST_ENVI_TOOL_WORKFLOWS: 'list-envi-tool-workflows',
  LIST_ENVI_TOOLS: 'list-envi-tools',
  MANAGE_IDL_AND_ENVI_SESSION: 'manage-idl-and-envi-session',
  OPEN_DATASETS_IN_ENVI: 'open-datasets-in-envi',
  QUERY_DATASET_WITH_ENVI: 'query-dataset-with-envi',
  RETURN_NOTES: 'return-notes',
  RUN_ENVI_TOOL: 'run-envi-tool',
  SEARCH_FOR_FILES: 'search-for-files',
  SEARCH_FOR_ROUTINE: 'search-for-routine',
  LIST_PROMPTS: 'list-prompts',
  SEARCH_RESOURCES: 'search-resources',
};
