import {
  MCPTool_CreateIDLNotebook,
  MCPToolParams_CreateIDLNotebook,
  MCPToolResponse_CreateIDLNotebook,
} from './vscode/mcp-tool-create-idl-notebook.interface';
import {
  MCPTool_ExecuteIDLCode,
  MCPToolParams_ExecuteIDLCode,
  MCPToolResponse_ExecuteIDLCode,
} from './vscode/mcp-tool-execute-idl-code.interface';
import {
  MCPTool_ExecuteIDLFile,
  MCPToolParams_ExecuteIDLFile,
  MCPToolResponse_ExecuteIDLFile,
} from './vscode/mcp-tool-execute-idl-file.interface';
import {
  MCPTool_ListENVIToolWorkflows,
  MCPToolParams_ListENVIToolWorkflows,
  MCPToolResponse_ListENVIToolWorkflows,
} from './vscode/mcp-tool-list-envi-tool-workflows.interface';
import {
  MCPTool_OpenDatasetsInENVI,
  MCPToolParams_OpenDatasetsInENVI,
  MCPToolResponse_OpenDatasetsInENVI,
} from './vscode/mcp-tool-open-datasets-in-envi.interface';
import {
  MCPTool_QueryDatasetWithENVI,
  MCPToolParams_QueryDatasetWithENVI,
  MCPToolResponse_QueryDatasetWithENVI,
} from './vscode/mcp-tool-query-dataset-with-envi.interface';
import {
  MCPTool_ReturnNotes,
  MCPToolParams_ReturnNotes,
  MCPToolResponse_ReturnNotes,
} from './vscode/mcp-tool-return-notes.interface';
import {
  MCPTool_RunENVITool,
  MCPToolParams_RunENVITool,
  MCPToolResponse_RunENVITool,
} from './vscode/mcp-tool-run-envi-tool.interface';
import {
  MCPTool_StartENVI,
  MCPToolParams_StartENVI,
  MCPToolResponse_StartENVI,
} from './vscode/mcp-tool-start-envi.interface';
import {
  MCPTool_StartIDL,
  MCPToolParams_StartIDL,
  MCPToolResponse_StartIDL,
} from './vscode/mcp-tool-start-idl.interface';

/**
 * MCP Tools that run in VSCode
 */
export type MCPTools_VSCode =
  | MCPTool_CreateIDLNotebook
  | MCPTool_ExecuteIDLCode
  | MCPTool_ExecuteIDLFile
  | MCPTool_ListENVIToolWorkflows
  | MCPTool_OpenDatasetsInENVI
  | MCPTool_QueryDatasetWithENVI
  | MCPTool_ReturnNotes
  | MCPTool_RunENVITool
  | MCPTool_StartENVI
  | MCPTool_StartIDL;

/**
 * MCP parameters and payload sent to VSCode to run an MCP tool
 * that requires ENVI or IDL
 */
export type MCPToolParams_VSCode<T extends MCPTools_VSCode> =
  T extends MCPTool_CreateIDLNotebook
    ? MCPToolParams_CreateIDLNotebook
    : T extends MCPTool_ExecuteIDLCode
    ? MCPToolParams_ExecuteIDLCode
    : T extends MCPTool_ExecuteIDLFile
    ? MCPToolParams_ExecuteIDLFile
    : T extends MCPTool_ListENVIToolWorkflows
    ? MCPToolParams_ListENVIToolWorkflows
    : T extends MCPTool_OpenDatasetsInENVI
    ? MCPToolParams_OpenDatasetsInENVI
    : T extends MCPTool_QueryDatasetWithENVI
    ? MCPToolParams_QueryDatasetWithENVI
    : T extends MCPTool_ReturnNotes
    ? MCPToolParams_ReturnNotes
    : T extends MCPTool_RunENVITool
    ? MCPToolParams_RunENVITool
    : T extends MCPTool_StartENVI
    ? MCPToolParams_StartENVI
    : T extends MCPTool_StartIDL
    ? MCPToolParams_StartIDL
    : never;

/**
 * Responses from MCP tools that run in VSCode for ENVI and IDL
 */
export type MCPToolResponse_VSCode<T extends MCPTools_VSCode> =
  T extends MCPTool_CreateIDLNotebook
    ? MCPToolResponse_CreateIDLNotebook
    : T extends MCPTool_ExecuteIDLCode
    ? MCPToolResponse_ExecuteIDLCode
    : T extends MCPTool_ExecuteIDLFile
    ? MCPToolResponse_ExecuteIDLFile
    : T extends MCPTool_ListENVIToolWorkflows
    ? MCPToolResponse_ListENVIToolWorkflows
    : T extends MCPTool_OpenDatasetsInENVI
    ? MCPToolResponse_OpenDatasetsInENVI
    : T extends MCPTool_QueryDatasetWithENVI
    ? MCPToolResponse_QueryDatasetWithENVI
    : T extends MCPTool_ReturnNotes
    ? MCPToolResponse_ReturnNotes
    : T extends MCPTool_RunENVITool
    ? MCPToolResponse_RunENVITool
    : T extends MCPTool_StartENVI
    ? MCPToolResponse_StartENVI
    : T extends MCPTool_StartIDL
    ? MCPToolResponse_StartIDL
    : never;

/**
 * Response from tools that run in VSCode
 */
export interface MCPToolHTTPResponse_VSCode {
  /** Text content we return */
  content: [
    {
      /** Type of content */
      type: 'text';
      /**
       * Text that we return, should be JSON of MCPToolResponse_VSCode, but not always
       *
       * A handful of tools have error checking and validation before they run, and if
       * there in pre-error checking and a failure, then this will have a text-based
       * error for the LLM.
       *
       * If the first characters is a brace, then you should be able to parse it.
       */
      text: string;
    }
  ];
  /** If an error */
  isError: boolean;
}
