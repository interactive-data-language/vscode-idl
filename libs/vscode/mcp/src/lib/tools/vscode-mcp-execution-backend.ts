import {
  RunMCPTool_ListENVIToolWorkflows,
  RunMCPTool_OpenDatasetsInENVI,
  RunMCPTool_QueryDatasetWithENVI,
  RunMCPTool_ReturnNotes,
  RunMCPTool_RunENVITool,
  RunMCPTool_TakeENVIScreenshot,
} from '@idl/mcp/envi';
import {
  RunMCPTool_ControlIDLAndENVISession,
  RunMCPTool_ControlIDLDebugger,
  RunMCPTool_GetIDLState,
  RunMCPTool_QueryIDLSession,
  RunMCPTool_RunIDLCode,
} from '@idl/mcp/idl';
import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import { IDLSyntaxErrorLookup } from '@idl/types/idl/idl-process';
import {
  DEFAULT_ENVI_MCP_TOOL_RESPONSE,
  DEFAULT_MCP_EVALUATE_OPTIONS,
  ENVIMCPToolResponse,
  ENVIMCPToolResponse_Failure,
  IIDLMCPExecutionBackend,
  IPrepareIDLCodeResult,
  MCP_TOOL_LOOKUP,
  MCPProgressCallback,
  MCPTool_RunENVITool,
  MCPToolParams,
  MCPToolResponse,
  MCPTools_IDL,
} from '@idl/types/mcp';
import { IDLVersionInfo, IIDLStartResult } from '@idl/types/vscode-debug';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { LANGUAGE_SERVER_MESSENGER } from '@idl/vscode/client';
import {
  IDebugEvaluateOptions,
  IDL_DEBUG_ADAPTER,
  LAST_ENVI_MCP_MESSAGE,
  StartIDL,
} from '@idl/vscode/debug';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeTelemetryLogger } from '@idl/vscode/usage-metrics';
import { compareVersions } from 'compare-versions';
import { copy } from 'fast-copy';

import { RunMCPTool_CreateIDLNotebookInVSCode } from './run-mcp-tool-create-idl-notebook-in-vscode';
import { RunMCPTool_RunIDLFileInVSCode } from './run-mcp-tool-run-idl-file-in-vscode';
const DEFAULT_SUCCESS = copy(DEFAULT_ENVI_MCP_TOOL_RESPONSE);

/**
 * Implementation of `IIDLMCPExecutionBackend` backed by the VS Code
 * `IDLDebugAdapter` singleton.
 *
 * Delegates IDL execution through the VS Code debug adapter and
 * reads ENVI success state from the module-level
 * `LAST_ENVI_SUCCESS_MESSAGE` that is updated by the debug
 * adapter's IDL Notify handlers.
 */
export class VSCodeMCPExecutionBackend implements IIDLMCPExecutionBackend {
  get idlVersion(): IDLVersionInfo | undefined {
    return IDL_DEBUG_ADAPTER.idlVersion;
  }

  async clearBreakpoint(file?: string, line?: number): Promise<void> {
    if (file !== undefined && line !== undefined) {
      await IDL_DEBUG_ADAPTER._breakpoints.removeBreakpoint(file, line);
    } else {
      await IDL_DEBUG_ADAPTER._breakpoints.resetBreakpoints();
    }
    await IDL_DEBUG_ADAPTER._breakpoints.syncBreakpointState();
  }

  async debugContinue(): Promise<void> {
    await IDL_DEBUG_ADAPTER._breakpoints.debugContinue();
  }

  async debugStepIn(): Promise<void> {
    await IDL_DEBUG_ADAPTER._breakpoints.debugStepIn();
  }

  async debugStepOut(): Promise<void> {
    await IDL_DEBUG_ADAPTER._breakpoints.debugStepOut();
  }

  async debugStepOver(): Promise<void> {
    await IDL_DEBUG_ADAPTER._breakpoints.debugStepOver();
  }

  async evaluate(
    command: string,
    options?: IDebugEvaluateOptions,
  ): Promise<string> {
    return IDL_DEBUG_ADAPTER.evaluate(command, options);
  }

  async evaluateENVICommand<T extends MCPTools_IDL>(
    command: string,
  ): Promise<MCPToolResponse<T>> {
    const idlOutput = await IDL_DEBUG_ADAPTER.evaluate(
      command,
      DEFAULT_MCP_EVALUATE_OPTIONS,
    );

    const res: ENVIMCPToolResponse = {
      ...(LAST_ENVI_MCP_MESSAGE || DEFAULT_SUCCESS),
    };

    if (!res.success) {
      res.result = {
        err: `${(res as ENVIMCPToolResponse_Failure).result.reason || ''}\n\n${(res as ENVIMCPToolResponse_Failure).result.err || ''}`.trim(),
      };
    }

    return { idlOutput, ...res } as MCPToolResponse<T>;
  }

  getCapturedOutput() {
    return IDL_DEBUG_ADAPTER._runtime.getCapturedOutput();
  }

  async getCodeCoverage(file: string) {
    return IDL_DEBUG_ADAPTER.getCodeCoverage(file);
  }

  getErrorsByFile(): IDLSyntaxErrorLookup {
    return IDL_DEBUG_ADAPTER._runtime.getErrorsByFile();
  }

  getIDLInfo() {
    return IDL_DEBUG_ADAPTER._runtime.getIDLInfo();
  }

  async getTraceback() {
    const output = await IDL_DEBUG_ADAPTER.getIDLInfo();
    return output.scope;
  }

  getVariables(frameId: number) {
    return IDL_DEBUG_ADAPTER._runtime.getVariables(frameId);
  }

  isAtMain(): boolean {
    return IDL_DEBUG_ADAPTER.isAtMain();
  }

  isStarted(): boolean {
    return IDL_DEBUG_ADAPTER.isStarted();
  }

  async listBreakpoints() {
    await IDL_DEBUG_ADAPTER._breakpoints.syncBreakpointState();

    const bps = await IDL_DEBUG_ADAPTER._breakpoints.getBreakpoints();
    return bps;
  }

  prepareCode(code: string): Promise<IPrepareIDLCodeResult | undefined> {
    return LANGUAGE_SERVER_MESSENGER.sendRequest(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.PREPARE_IDL_CODE,
      { code },
    );
  }

  registerIDLNotifyHandler(
    event: string,
    handler: FromIDLMachineRequestHandler<'idlNotify'>,
  ): void {
    IDL_DEBUG_ADAPTER._runtime.registerIDLNotifyHandler(event, handler);
  }

  async resetCallStack(): Promise<void> {
    await IDL_DEBUG_ADAPTER._runtime.resetCallStack();
  }

  resetErrorsByFile(): void {
    IDL_DEBUG_ADAPTER._runtime.resetErrorsByFile();
  }

  async resetMain(): Promise<void> {
    await IDL_DEBUG_ADAPTER.resetMain();
  }

  async runMCPTool<T extends MCPTools_IDL>(
    executionId: string,
    tool: T,
    params: MCPToolParams<T>,
    onProgress?: MCPProgressCallback,
  ): Promise<MCPToolResponse<T>> {
    switch (tool) {
      case MCP_TOOL_LOOKUP.CONTROL_IDL_AND_ENVI_SESSION:
        return RunMCPTool_ControlIDLAndENVISession(this, params as any) as any;

      case MCP_TOOL_LOOKUP.CONTROL_IDL_DEBUGGER:
        return RunMCPTool_ControlIDLDebugger(this, params as any) as any;

      case MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK:
        return RunMCPTool_CreateIDLNotebookInVSCode(
          executionId,
          params as any,
        ) as any;

      case MCP_TOOL_LOOKUP.GET_IDL_STATE:
        return RunMCPTool_GetIDLState(this, params as any) as any;

      case MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS:
        return RunMCPTool_ListENVIToolWorkflows(this, params as any) as any;

      case MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI:
        return RunMCPTool_OpenDatasetsInENVI(
          this,
          params as any,
          onProgress,
        ) as any;

      case MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI:
        return RunMCPTool_QueryDatasetWithENVI(
          this,
          params as any,
          onProgress,
        ) as any;

      case MCP_TOOL_LOOKUP.QUERY_IDL_SESSION:
        return RunMCPTool_QueryIDLSession(this, params as any) as any;

      case MCP_TOOL_LOOKUP.RETURN_NOTES:
        return RunMCPTool_ReturnNotes(this, params as any) as any;

      case MCP_TOOL_LOOKUP.RUN_ENVI_TOOL: {
        const typed = params as MCPToolParams<MCPTool_RunENVITool>;
        if (!typed.uri) {
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
            idl_command: `idl.mcp.${MCP_TOOL_LOOKUP.RUN_ENVI_TOOL}.${typed.toolName}`,
          });
        }
        return RunMCPTool_RunENVITool(this, typed, onProgress) as any;
      }

      case MCP_TOOL_LOOKUP.RUN_IDL_CODE:
        return RunMCPTool_RunIDLCode(
          this,
          params as any,
          this.prepareCode.bind(this),
        ) as any;

      case MCP_TOOL_LOOKUP.RUN_IDL_FILE:
        return RunMCPTool_RunIDLFileInVSCode(
          this,
          executionId,
          params as any,
        ) as any;

      case MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT:
        return RunMCPTool_TakeENVIScreenshot(
          this,
          params as any,
          onProgress,
        ) as any;

      default:
        return { success: false, err: `Unknown tool: ${tool}` } as any;
    }
  }

  async setBreakpoint(file: string, line: number): Promise<void> {
    await IDL_DEBUG_ADAPTER._breakpoints.setBreakpoint(file, line);
  }

  async start(show = true): Promise<IIDLStartResult> {
    return StartIDL(show);
  }

  async stop(): Promise<void> {
    IDL_DEBUG_ADAPTER.terminate();
  }

  verifyIDLVersion(): boolean {
    const info = IDL_DEBUG_ADAPTER.idlVersion;
    if (info === undefined) {
      return false;
    }
    return compareVersions(info.release, '9.2.0') !== -1;
  }
}
