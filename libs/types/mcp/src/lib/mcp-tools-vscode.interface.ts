import { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types';

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
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams_ManageIDLAndENVISession,
  MCPToolResponse_ManageIDLAndENVISession,
} from './vscode/mcp-tool-manage-idl-and-envi-session.interface';
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

/**
 * MCP Tools that run in VSCode
 */
export type MCPTools_VSCode =
  | MCPTool_CreateIDLNotebook
  | MCPTool_ExecuteIDLCode
  | MCPTool_ExecuteIDLFile
  | MCPTool_ListENVIToolWorkflows
  | MCPTool_ManageIDLAndENVISession
  | MCPTool_OpenDatasetsInENVI
  | MCPTool_QueryDatasetWithENVI
  | MCPTool_ReturnNotes
  | MCPTool_RunENVITool;

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
          : T extends MCPTool_ManageIDLAndENVISession
            ? MCPToolParams_ManageIDLAndENVISession
            : T extends MCPTool_OpenDatasetsInENVI
              ? MCPToolParams_OpenDatasetsInENVI
              : T extends MCPTool_QueryDatasetWithENVI
                ? MCPToolParams_QueryDatasetWithENVI
                : T extends MCPTool_ReturnNotes
                  ? MCPToolParams_ReturnNotes
                  : T extends MCPTool_RunENVITool
                    ? MCPToolParams_RunENVITool
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
          : T extends MCPTool_ManageIDLAndENVISession
            ? MCPToolResponse_ManageIDLAndENVISession
            : T extends MCPTool_OpenDatasetsInENVI
              ? MCPToolResponse_OpenDatasetsInENVI
              : T extends MCPTool_QueryDatasetWithENVI
                ? MCPToolResponse_QueryDatasetWithENVI
                : T extends MCPTool_ReturnNotes
                  ? MCPToolResponse_ReturnNotes
                  : T extends MCPTool_RunENVITool
                    ? MCPToolResponse_RunENVITool
                    : never;

/**
 * Response from tools that run in VSCode
 */
export type MCPToolHTTPResponse_VSCode = {
  /**
   * Content that we return, text should be JSON of MCPToolResponse_VSCode, but not always
   *
   * A handful of tools have error checking and validation before they run, and if
   * there in pre-error checking and a failure, then this will have a text-based
   * error for the LLM.
   */
  content: TextContent[];
  /** If an error */
  isError: boolean; // make sure it is included
} & Omit<CallToolResult, 'content'>;
