import type {
  CallToolResult,
  ImageContent,
  TextContent,
} from '@modelcontextprotocol/server';

import type {
  MCPTool_ControlIDLAndENVISession,
  MCPToolParams_ControlIDLAndENVISession,
  MCPToolResponse_ControlIDLAndENVISession,
} from './idl/mcp-tool-control-idl-and-envi-session.interface';
import type {
  MCPTool_ControlIDLDebugger,
  MCPToolParams_ControlIDLDebugger,
  MCPToolResponse_ControlIDLDebugger,
} from './idl/mcp-tool-control-idl-debugger.interface';
import type {
  MCPTool_CreateIDLNotebook,
  MCPToolParams_CreateIDLNotebook,
  MCPToolResponse_CreateIDLNotebook,
} from './idl/mcp-tool-create-idl-notebook.interface';
import type {
  MCPTool_GetIDLState,
  MCPToolParams_GetIDLState,
  MCPToolResponse_GetIDLState,
} from './idl/mcp-tool-get-idl-state.interface';
import type {
  MCPTool_ListENVIToolWorkflows,
  MCPToolParams_ListENVIToolWorkflows,
  MCPToolResponse_ListENVIToolWorkflows,
} from './idl/mcp-tool-list-envi-tool-workflows.interface';
import type {
  MCPTool_OpenDatasetsInENVI,
  MCPToolParams_OpenDatasetsInENVI,
  MCPToolResponse_OpenDatasetsInENVI,
} from './idl/mcp-tool-open-datasets-in-envi.interface';
import type {
  MCPTool_QueryDatasetWithENVI,
  MCPToolParams_QueryDatasetWithENVI,
  MCPToolResponse_QueryDatasetWithENVI,
} from './idl/mcp-tool-query-dataset-with-envi.interface';
import type {
  MCPTool_QueryIDLSession,
  MCPToolParams_QueryIDLSession,
  MCPToolResponse_QueryIDLSession,
} from './idl/mcp-tool-query-idl-session.interface';
import type {
  MCPTool_ReturnNotes,
  MCPToolParams_ReturnNotes,
  MCPToolResponse_ReturnNotes,
} from './idl/mcp-tool-return-notes.interface';
import type {
  MCPTool_RunENVITool,
  MCPToolParams_RunENVITool,
  MCPToolResponse_RunENVITool,
} from './idl/mcp-tool-run-envi-tool.interface';
import type {
  MCPTool_RunIDLCode,
  MCPToolParams_RunIDLCode,
  MCPToolResponse_RunIDLCode,
} from './idl/mcp-tool-run-idl-code.interface';
import type {
  MCPTool_RunIDLFile,
  MCPToolParams_RunIDLFile,
  MCPToolResponse_RunIDLFile,
} from './idl/mcp-tool-run-idl-file.interface';
import type {
  MCPTool_TakeENVIScreenshot,
  MCPToolParams_TakeENVIScreenshot,
  MCPToolResponse_TakeENVIScreenshot,
} from './idl/mcp-tool-take-envi-screenshot.interface';

/**
 * MCP Tools that run in IDL
 */
export type MCPTools_IDL =
  | MCPTool_ControlIDLAndENVISession
  | MCPTool_ControlIDLDebugger
  | MCPTool_CreateIDLNotebook
  | MCPTool_GetIDLState
  | MCPTool_ListENVIToolWorkflows
  | MCPTool_OpenDatasetsInENVI
  | MCPTool_QueryDatasetWithENVI
  | MCPTool_QueryIDLSession
  | MCPTool_ReturnNotes
  | MCPTool_RunENVITool
  | MCPTool_RunIDLCode
  | MCPTool_RunIDLFile
  | MCPTool_TakeENVIScreenshot;

/**
 * MCP parameters and payload sent to IDL to run an MCP tool
 * that requires ENVI or IDL
 */
export type MCPToolParams_IDL<T extends MCPTools_IDL> =
  T extends MCPTool_CreateIDLNotebook
    ? MCPToolParams_CreateIDLNotebook
    : T extends MCPTool_RunIDLCode
      ? MCPToolParams_RunIDLCode
      : T extends MCPTool_RunIDLFile
        ? MCPToolParams_RunIDLFile
        : T extends MCPTool_ListENVIToolWorkflows
          ? MCPToolParams_ListENVIToolWorkflows
          : T extends MCPTool_ControlIDLAndENVISession
            ? MCPToolParams_ControlIDLAndENVISession
            : T extends MCPTool_ControlIDLDebugger
              ? MCPToolParams_ControlIDLDebugger
              : T extends MCPTool_GetIDLState
                ? MCPToolParams_GetIDLState
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
    : T extends MCPTool_RunIDLCode
      ? MCPToolResponse_RunIDLCode
      : T extends MCPTool_RunIDLFile
        ? MCPToolResponse_RunIDLFile
        : T extends MCPTool_ListENVIToolWorkflows
          ? MCPToolResponse_ListENVIToolWorkflows
          : T extends MCPTool_ControlIDLAndENVISession
            ? MCPToolResponse_ControlIDLAndENVISession
            : T extends MCPTool_ControlIDLDebugger
              ? MCPToolResponse_ControlIDLDebugger
              : T extends MCPTool_GetIDLState
                ? MCPToolResponse_GetIDLState
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
