import {
  CallToolResult,
  ImageContent,
  TextContent,
} from '@modelcontextprotocol/sdk/types';

import {
  MCPTool_CreateIDLNotebook,
  MCPToolParams_CreateIDLNotebook,
  MCPToolResponse_CreateIDLNotebook,
} from './idl/mcp-tool-create-idl-notebook.interface';
import {
  MCPTool_ExecuteIDLCode,
  MCPToolParams_ExecuteIDLCode,
  MCPToolResponse_ExecuteIDLCode,
} from './idl/mcp-tool-execute-idl-code.interface';
import {
  MCPTool_ExecuteIDLFile,
  MCPToolParams_ExecuteIDLFile,
  MCPToolResponse_ExecuteIDLFile,
} from './idl/mcp-tool-execute-idl-file.interface';
import {
  MCPTool_ListENVIToolWorkflows,
  MCPToolParams_ListENVIToolWorkflows,
  MCPToolResponse_ListENVIToolWorkflows,
} from './idl/mcp-tool-list-envi-tool-workflows.interface';
import {
  MCPTool_ManageIDLAndENVISession,
  MCPToolParams_ManageIDLAndENVISession,
  MCPToolResponse_ManageIDLAndENVISession,
} from './idl/mcp-tool-manage-idl-and-envi-session.interface';
import {
  MCPTool_InspectIDLState,
  MCPToolParams_InspectIDLState,
  MCPToolResponse_InspectIDLState,
} from './idl/mcp-tool-inspect-idl-state.interface';
import {
  MCPTool_ManageIDLDebugger,
  MCPToolParams_ManageIDLDebugger,
  MCPToolResponse_ManageIDLDebugger,
} from './idl/mcp-tool-manage-idl-debugger.interface';
import {
  MCPTool_OpenDatasetsInENVI,
  MCPToolParams_OpenDatasetsInENVI,
  MCPToolResponse_OpenDatasetsInENVI,
} from './idl/mcp-tool-open-datasets-in-envi.interface';
import {
  MCPTool_QueryDatasetWithENVI,
  MCPToolParams_QueryDatasetWithENVI,
  MCPToolResponse_QueryDatasetWithENVI,
} from './idl/mcp-tool-query-dataset-with-envi.interface';
import {
  MCPTool_QueryIDLSession,
  MCPToolParams_QueryIDLSession,
  MCPToolResponse_QueryIDLSession,
} from './idl/mcp-tool-query-idl-session.interface';
import {
  MCPTool_ReturnNotes,
  MCPToolParams_ReturnNotes,
  MCPToolResponse_ReturnNotes,
} from './idl/mcp-tool-return-notes.interface';
import {
  MCPTool_RunENVITool,
  MCPToolParams_RunENVITool,
  MCPToolResponse_RunENVITool,
} from './idl/mcp-tool-run-envi-tool.interface';
import {
  MCPTool_TakeENVIScreenshot,
  MCPToolParams_TakeENVIScreenshot,
  MCPToolResponse_TakeENVIScreenshot,
} from './idl/mcp-tool-take-envi-screenshot.interface';

/**
 * MCP Tools that run in IDL
 */
export type MCPTools_IDL =
  | MCPTool_CreateIDLNotebook
  | MCPTool_ExecuteIDLCode
  | MCPTool_ExecuteIDLFile
  | MCPTool_ListENVIToolWorkflows
  | MCPTool_ManageIDLAndENVISession
  | MCPTool_InspectIDLState
  | MCPTool_ManageIDLDebugger
  | MCPTool_OpenDatasetsInENVI
  | MCPTool_QueryDatasetWithENVI
  | MCPTool_QueryIDLSession
  | MCPTool_ReturnNotes
  | MCPTool_RunENVITool
  | MCPTool_TakeENVIScreenshot;

/**
 * MCP parameters and payload sent to IDL to run an MCP tool
 * that requires ENVI or IDL
 */
export type MCPToolParams_IDL<T extends MCPTools_IDL> =
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
            : T extends MCPTool_InspectIDLState
              ? MCPToolParams_InspectIDLState
              : T extends MCPTool_ManageIDLDebugger
              ? MCPToolParams_ManageIDLDebugger
              : T extends MCPTool_OpenDatasetsInENVI
              ? MCPToolParams_OpenDatasetsInENVI
              : T extends MCPTool_QueryDatasetWithENVI
                ? MCPToolParams_QueryDatasetWithENVI
                  : T extends MCPTool_QueryIDLSession
                    ? MCPToolParams_QueryIDLSession
                    : T extends MCPTool_ReturnNotes
                  ? MCPToolParams_ReturnNotes
                  : T extends MCPTool_RunENVITool
                    ? MCPToolParams_RunENVITool
                    : T extends MCPTool_TakeENVIScreenshot
                      ? MCPToolParams_TakeENVIScreenshot
                      : never;

/**
 * Responses from MCP tools that run in IDL for ENVI and IDL
 */
export type MCPToolResponse_IDL<T extends MCPTools_IDL> =
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
            : T extends MCPTool_InspectIDLState
              ? MCPToolResponse_InspectIDLState
              : T extends MCPTool_ManageIDLDebugger
              ? MCPToolResponse_ManageIDLDebugger
              : T extends MCPTool_OpenDatasetsInENVI
              ? MCPToolResponse_OpenDatasetsInENVI
              : T extends MCPTool_QueryDatasetWithENVI
                ? MCPToolResponse_QueryDatasetWithENVI
                  : T extends MCPTool_QueryIDLSession
                    ? MCPToolResponse_QueryIDLSession
                    : T extends MCPTool_ReturnNotes
                  ? MCPToolResponse_ReturnNotes
                  : T extends MCPTool_RunENVITool
                    ? MCPToolResponse_RunENVITool
                    : T extends MCPTool_TakeENVIScreenshot
                      ? MCPToolResponse_TakeENVIScreenshot
                      : never;

/**
 * Response from tools that run in IDL
 */
export type MCPToolHTTPResponse_IDL = {
  /**
   * Content that we return, text should be JSON of MCPToolResponse_IDL, but not always
   *
   * A handful of tools have error checking and validation before they run, and if
   * there in pre-error checking and a failure, then this will have a text-based
   * error for the LLM.
   */
  content: (ImageContent | TextContent)[];
  /** If an error */
  isError: boolean; // make sure it is included
} & Omit<CallToolResult, 'content'>;
