import { MCPTool_CreateENVIModelerWorkflow } from './http/mcp-tool-create-envi-modeler-workflow.interface';
import { MCPTool_GetENVIToolParameters } from './http/mcp-tool-get-envi-tool-parameters.interface';
import { MCPTool_GetENVIToolWorkflow } from './http/mcp-tool-get-envi-tool-workflow.interface';
import { MCPTool_GetPrompt } from './http/mcp-tool-get-prompt.interface';
import { MCPTool_GetResource } from './http/mcp-tool-get-resource.interface';
import { MCPTool_GetRoutineDocs } from './http/mcp-tool-get-routine-docs.interface';
import { MCPTool_ListAllResources } from './http/mcp-tool-list-all-resources.interface';
import { MCPTool_ListENVITools } from './http/mcp-tool-list-envi-tools.interface';
import { MCPTool_ListPrompts } from './http/mcp-tool-list-prompts.interface';
import { MCPTool_SaveENVIToolWorkflow } from './http/mcp-tool-save-envi-tool-workflow.interface';
import { MCPTool_SearchForFiles } from './http/mcp-tool-search-for-files.interface';
import { MCPTool_SearchForRoutine } from './http/mcp-tool-search-for-routine.interface';
import { MCPTool_SearchResources } from './http/mcp-tool-search-resources.interface';
import { MCPTool_ControlIDLAndENVISession } from './idl/mcp-tool-control-idl-and-envi-session.interface';
import { MCPTool_CreateIDLNotebook } from './idl/mcp-tool-create-idl-notebook.interface';
import { MCPTool_InspectIDLState } from './idl/mcp-tool-inspect-idl-state.interface';
import { MCPTool_ListENVIToolWorkflows } from './idl/mcp-tool-list-envi-tool-workflows.interface';
import { MCPTool_ManageIDLDebugger } from './idl/mcp-tool-manage-idl-debugger.interface';
import { MCPTool_OpenDatasetsInENVI } from './idl/mcp-tool-open-datasets-in-envi.interface';
import { MCPTool_QueryDatasetWithENVI } from './idl/mcp-tool-query-dataset-with-envi.interface';
import { MCPTool_QueryIDLSession } from './idl/mcp-tool-query-idl-session.interface';
import { MCPTool_ReturnNotes } from './idl/mcp-tool-return-notes.interface';
import { MCPTool_RunENVITool } from './idl/mcp-tool-run-envi-tool.interface';
import { MCPTool_RunIDLCode } from './idl/mcp-tool-run-idl-code.interface';
import { MCPTool_RunIDLFile } from './idl/mcp-tool-run-idl-file.interface';
import { MCPTool_TakeENVIScreenshot } from './idl/mcp-tool-take-envi-screenshot.interface';
import {
  MCPToolHTTPResponse_HTTP,
  MCPToolParams_HTTP,
  MCPTools_HTTP,
} from './mcp-tools-http.interface';
import {
  MCPToolHTTPResponse_IDL,
  MCPToolParams_IDL,
  MCPToolResponse_IDL,
  MCPTools_IDL,
} from './mcp-tools-idl.interface';

/**
 * All MCP tools
 */
export type MCPTools = MCPTools_HTTP | MCPTools_IDL;

/**
 * All MCP tool parameters
 */
export type MCPToolParams<T extends MCPTools> = T extends MCPTools_HTTP
  ? MCPToolParams_HTTP<T>
  : T extends MCPTools_IDL
    ? MCPToolParams_IDL<T>
    : never;

/**
 * Payloads for all MCP messages
 */
export type MCPToolResponse<T extends MCPTools> = T extends MCPTools_IDL
  ? MCPToolResponse_IDL<T>
  : never;

/** What is the data type returned from our MCP call over HTTP */
export type MCPToolHTTPResponse<T extends MCPTools> = T extends MCPTools_HTTP
  ? MCPToolHTTPResponse_HTTP
  : T extends MCPTools_IDL
    ? MCPToolHTTPResponse_IDL
    : never;

/**
 * Strictly typed messages that we can send back and forth
 */
interface IMCPToolLookup {
  /** Control ENVI and IDL session */
  CONTROL_IDL_AND_ENVI_SESSION: MCPTool_ControlIDLAndENVISession;
  /** Create an ENVI Modeler workflow file */
  CREATE_ENVI_MODELER_WORKFLOW: MCPTool_CreateENVIModelerWorkflow;
  /** Create an IDL Notebook */
  CREATE_IDL_NOTEBOOK: MCPTool_CreateIDLNotebook;
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
  /** Read-only inspection of IDL session state */
  INSPECT_IDL_STATE: MCPTool_InspectIDLState;
  /** List all resources */
  LIST_ALL_RESOURCES: MCPTool_ListAllResources;
  /** List know ENVI tool workflows */
  LIST_ENVI_TOOL_WORKFLOWS: MCPTool_ListENVIToolWorkflows;
  /** Query ENVI's tasks */
  LIST_ENVI_TOOLS: MCPTool_ListENVITools;
  /** List all prompts (instruction sets and tutorials) */
  LIST_PROMPTS: MCPTool_ListPrompts;
  /** Manage IDL debugger (breakpoints, stepping) */
  MANAGE_IDL_DEBUGGER: MCPTool_ManageIDLDebugger;
  /** Open a dataset in ENVI */
  OPEN_DATASETS_IN_ENVI: MCPTool_OpenDatasetsInENVI;
  /** Get additional information about a dataset */
  QUERY_DATASET_WITH_ENVI: MCPTool_QueryDatasetWithENVI;
  /** Query the IDL session without user-visible output */
  QUERY_IDL_SESSION: MCPTool_QueryIDLSession;
  /** RETURN NOTES FOR ENVI AND IDL TASKS */
  RETURN_NOTES: MCPTool_ReturnNotes;
  /** Run ENVI Task */
  RUN_ENVI_TOOL: MCPTool_RunENVITool;
  /** Run code in IDL */
  RUN_IDL_CODE: MCPTool_RunIDLCode;
  /** Run code in IDL that comes from a file */
  RUN_IDL_FILE: MCPTool_RunIDLFile;
  /** Save an ENVI Tool Workflow to disk */
  SAVE_ENVI_TOOL_WORKFLOW: MCPTool_SaveENVIToolWorkflow;
  /** Search a location for files */
  SEARCH_FOR_FILES: MCPTool_SearchForFiles;
  /** Search for a particular routine */
  SEARCH_FOR_ROUTINE: MCPTool_SearchForRoutine;
  /** Search all resources */
  SEARCH_RESOURCES: MCPTool_SearchResources;
  /** Take a screenshot of the ENVI display */
  TAKE_ENVI_SCREENSHOT: MCPTool_TakeENVIScreenshot;
}

/**
 * Lookup with types of messages
 */
export const MCP_TOOL_LOOKUP: IMCPToolLookup = {
  CONTROL_IDL_AND_ENVI_SESSION: 'control-idl-and-envi-session',
  CREATE_ENVI_MODELER_WORKFLOW: 'create-envi-modeler-workflow',
  CREATE_IDL_NOTEBOOK: 'create-idl-notebook',
  GET_ENVI_TOOL_PARAMETERS: 'get-envi-tool-parameters',
  GET_ENVI_TOOL_WORKFLOW: 'get-envi-tool-workflow',
  GET_PROMPT: 'get-prompt',
  GET_RESOURCE: 'get-resource',
  GET_ROUTINE_DOCS: 'get-routine-docs',
  LIST_ALL_RESOURCES: 'list-all-resources',
  LIST_ENVI_TOOL_WORKFLOWS: 'list-envi-tool-workflows',
  LIST_ENVI_TOOLS: 'list-envi-tools',
  LIST_PROMPTS: 'list-prompts',
  INSPECT_IDL_STATE: 'inspect-idl-state',
  MANAGE_IDL_DEBUGGER: 'manage-idl-debugger',
  OPEN_DATASETS_IN_ENVI: 'open-datasets-in-envi',
  QUERY_DATASET_WITH_ENVI: 'query-dataset-with-envi',
  QUERY_IDL_SESSION: 'query-idl-session',
  RETURN_NOTES: 'return-notes',
  RUN_ENVI_TOOL: 'run-envi-tool',
  RUN_IDL_CODE: 'run-idl-code',
  RUN_IDL_FILE: 'run-idl-file',
  SAVE_ENVI_TOOL_WORKFLOW: 'save-envi-tool-workflow',
  SEARCH_FOR_FILES: 'search-for-files',
  SEARCH_FOR_ROUTINE: 'search-for-routine',
  SEARCH_RESOURCES: 'search-resources',
  TAKE_ENVI_SCREENSHOT: 'take-envi-screenshot',
};
