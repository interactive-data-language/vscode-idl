import {
  ListENVIToolWorkflows,
  OpenDatasetsInENVI,
  QueryDatasetWithENVI,
  ReturnNotes,
  RunENVITool,
  TakeENVIScreenshot,
} from '@idl/mcp/envi';
import {
  CreateIDLNotebook,
  ExecuteIDLCode,
  ExecuteIDLFile,
  ManageENVIAndIDLSession,
} from '@idl/mcp/idl';
import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import {
  IDLEvaluateOptions,
  IDLSyntaxErrorLookup,
  IStartIDLConfig,
} from '@idl/types/idl/idl-process';
import {
  DEFAULT_ENVI_MCP_TOOL_RESPONSE,
  ENVIMCPToolResponse,
  ENVIMCPToolResponse_Failure,
  IIDLMCPExecutionBackend,
  IPrepareIDLCodeResult,
  MCP_TOOL_LOOKUP,
  MCPProgressCallback,
  MCPToolParams,
  MCPToolResponse,
  MCPTools_VSCode,
  PrepareIDLCodeCallback,
} from '@idl/types/mcp';
import { IDLVersionInfo, IIDLStartResult } from '@idl/types/vscode-debug';
import { compareVersions } from 'compare-versions';
import { copy } from 'fast-copy';

import { IDLMCPExecutionManager } from './idl-mcp-execution-manager.class';

const DEFAULT_SUCCESS = copy(DEFAULT_ENVI_MCP_TOOL_RESPONSE);

/**
 * Callback invoked when an `envi_success` or `envi_failure`
 * notification arrives. Used by `RegisterENVINotifyHandlers`
 * to store the latest message on this backend instance.
 */
export type MCPBackendENVIHandler = (msg: ENVIMCPToolResponse) => void;

/**
 * Implementation of `IIDLMCPExecutionBackend` backed by an
 * `IDLMCPExecutionManager` — no VS Code dependency.
 *
 * The caller owns the `IDLMCPExecutionManager` lifecycle; this
 * wrapper simply delegates through the interface contract.
 */
export class IDLMachineExecutionBackend implements IIDLMCPExecutionBackend {
  /**
   * Tracks the latest ENVI success/failure notification.
   *
   * Updated by `envi_success` / `envi_failure` IDL Notify handlers
   * registered via `RegisterENVINotifyHandlers()` from `@idl/mcp/envi`.
   */
  lastENVIMessage: ENVIMCPToolResponse | undefined;

  /**
   * Launch configuration for IDL. When set, `start()` will use this
   * to launch IDL on demand if it is not already running.
   */
  launchConfig: IStartIDLConfig;

  get idlVersion(): IDLVersionInfo | undefined {
    return this.manager.idlVersion;
  }

  /** Underlying manager that owns the IDL process */
  private manager: IDLMCPExecutionManager;

  /** Callback to prepare code */
  private onCodePrepare: PrepareIDLCodeCallback;

  /** Callback executed when we launch IDL */
  private onLaunch: () => void;

  constructor(
    manager: IDLMCPExecutionManager,
    launchConfig: IStartIDLConfig,
    onLaunch: () => void,
    onCodePrepare: PrepareIDLCodeCallback,
  ) {
    this.manager = manager;
    this.launchConfig = launchConfig;
    this.onLaunch = onLaunch;
    this.onCodePrepare = onCodePrepare;
  }

  async evaluate(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<string> {
    return this.manager.evaluate(command, options);
  }

  async evaluateENVICommand<T extends MCPTools_VSCode>(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<MCPToolResponse<T>> {
    const idlOutput = await this.manager.evaluate(command, options);

    const res: ENVIMCPToolResponse = {
      ...(this.lastENVIMessage || DEFAULT_SUCCESS),
    };

    if (!res.success) {
      res.result = {
        err: `${(res as any as ENVIMCPToolResponse_Failure).result?.reason || ''}\n\n${(res as any as ENVIMCPToolResponse_Failure).result?.err || ''}`.trim(),
      };
    }

    return { idlOutput, ...res } as MCPToolResponse<T>;
  }

  getErrorsByFile(): IDLSyntaxErrorLookup {
    return this.manager._runtime.getErrorsByFile();
  }

  isAtMain(): boolean {
    const info = this.manager._runtime.getIDLInfo();

    return (
      info.scope.length === 0 ||
      (info.scope.length === 1 && info.scope[0].line <= 1)
    );
  }

  isStarted(): boolean {
    return this.manager.isStarted();
  }

  prepareCode(code: string): Promise<IPrepareIDLCodeResult | undefined> {
    return this.onCodePrepare(code);
  }

  registerIDLNotifyHandler(
    event: string,
    handler: FromIDLMachineRequestHandler<'idlNotify'>,
  ): void {
    this.manager._runtime.registerIDLNotifyHandler(event, handler);
  }

  async resetCallStack(): Promise<void> {
    await this.manager.resetCallStack();
  }

  resetErrorsByFile(): void {
    this.manager._runtime.resetErrorsByFile();
  }

  async resetMain(): Promise<void> {
    const version = this.manager.idlVersion;
    if (
      version !== undefined &&
      compareVersions(version.release, '9.2.0') !== -1
    ) {
      return;
    }
    await this.manager.evaluate('.run');
  }

  async runMCPTool<T extends MCPTools_VSCode>(
    executionId: string,
    tool: T,
    params: MCPToolParams<T>,
    onProgress?: MCPProgressCallback,
  ): Promise<MCPToolResponse<T>> {
    switch (tool) {
      case MCP_TOOL_LOOKUP.CREATE_IDL_NOTEBOOK:
        return CreateIDLNotebook(params as any) as any;

      case MCP_TOOL_LOOKUP.EXECUTE_IDL_CODE:
        return ExecuteIDLCode(this, params as any, this.prepareCode) as any;

      case MCP_TOOL_LOOKUP.EXECUTE_IDL_FILE:
        return ExecuteIDLFile(this, params as any) as any;

      case MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS:
        return ListENVIToolWorkflows(this, params as any) as any;

      case MCP_TOOL_LOOKUP.MANAGE_IDL_AND_ENVI_SESSION:
        return ManageENVIAndIDLSession(this, params as any) as any;

      case MCP_TOOL_LOOKUP.OPEN_DATASETS_IN_ENVI:
        return OpenDatasetsInENVI(this, params as any) as any;

      case MCP_TOOL_LOOKUP.QUERY_DATASET_WITH_ENVI:
        return QueryDatasetWithENVI(this, params as any) as any;

      case MCP_TOOL_LOOKUP.RETURN_NOTES:
        return ReturnNotes(this, params as any) as any;

      case MCP_TOOL_LOOKUP.RUN_ENVI_TOOL:
        return RunENVITool(this, params as any) as any;

      case MCP_TOOL_LOOKUP.TAKE_ENVI_SCREENSHOT:
        return TakeENVIScreenshot(this, params as any) as any;

      default:
        return { success: false, err: `Unknown tool: ${tool}` } as any;
    }
  }

  async start(): Promise<IIDLStartResult> {
    if (this.manager.isStarted()) {
      return { started: true };
    }

    // attempt to launch
    const launched = await this.manager.launch(this.launchConfig);

    // check if we succeeded or not
    if (launched) {
      this.onLaunch();
      return { started: true };
    } else {
      const output = this.manager._runtime.getCapturedOutput();
      return {
        started: false,
        reason: `IDL failed to launch, captured output: ${output}`,
      };
    }
  }

  async stop(): Promise<void> {
    await this.manager.stop();
  }

  verifyIDLVersion(): boolean {
    const info = this.idlVersion;
    if (info === undefined) {
      return false;
    }
    return compareVersions(info.release, '9.2.0') !== -1;
  }
}
