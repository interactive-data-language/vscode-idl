import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import {
  IDLEvaluateOptions,
  IDLSyntaxErrorLookup,
} from '@idl/types/idl/idl-process';
import {
  DEFAULT_ENVI_MCP_TOOL_RESPONSE,
  ENVIMCPToolResponse,
  IIDLMCPExecutionBackend,
  IPrepareIDLCodeResult,
  MCPProgressCallback,
  MCPToolParams,
  MCPToolResponse,
  MCPTools_VSCode,
  PrepareIDLCodeCallback,
} from '@idl/types/mcp';
import { IDLVersionInfo, IIDLStartResult } from '@idl/types/vscode-debug';
import { copy } from 'fast-copy';

import { WEBSOCKET_TOOL_NAMES } from './websocket-execution-backend.interface';
import { WebSocketToolBridge } from './websocket-tool-bridge.class';

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
export class WebSocketExecutionBackend implements IIDLMCPExecutionBackend {
  bridge: WebSocketToolBridge;

  get idlVersion(): IDLVersionInfo | undefined {
    throw new Error('Method not supported in websocket mode');
    // return this.manager.idlVersion;
  }

  /** Callback to prepare code */
  private onCodePrepare: PrepareIDLCodeCallback;

  constructor(
    bridge: WebSocketToolBridge,
    onCodePrepare: PrepareIDLCodeCallback,
  ) {
    this.bridge = bridge;
    this.onCodePrepare = onCodePrepare;
  }

  async evaluate(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<string> {
    throw new Error('Method not supported in websocket mode');
  }

  async evaluateENVICommand<T extends MCPTools_VSCode>(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<MCPToolResponse<T>> {
    throw new Error('Method not supported in websocket mode');
  }

  getErrorsByFile(): IDLSyntaxErrorLookup {
    throw new Error('Method not supported in websocket mode');
  }

  isAtMain(): boolean {
    throw new Error('Method not supported in websocket mode');
  }

  isStarted(): boolean {
    return this.bridge.isConnected();
  }

  prepareCode(code: string): Promise<IPrepareIDLCodeResult | undefined> {
    return this.onCodePrepare(code);
  }

  registerIDLNotifyHandler(
    event: string,
    handler: FromIDLMachineRequestHandler<'idlNotify'>,
  ): void {
    throw new Error('Method not supported in websocket mode');
  }

  async resetCallStack(): Promise<void> {
    throw new Error('Method not supported in websocket mode');
  }

  resetErrorsByFile(): void {
    throw new Error('Method not supported in websocket mode');
  }

  async resetMain(): Promise<void> {
    throw new Error('Method not supported in websocket mode');
  }

  async runMCPTool<T extends MCPTools_VSCode>(
    executionId: string,
    tool: T,
    params: MCPToolParams<T>,
    onProgress?: MCPProgressCallback,
  ): Promise<MCPToolResponse<T>> {
    if (!WEBSOCKET_TOOL_NAMES.has(tool)) {
      return {
        success: false,
        err: `Tool not available in websocket mode: ${tool}`,
      } as any;
    }

    try {
      return await this.bridge.sendRequest(tool, params);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : String(err ?? 'unknown error');
      return { success: false, result: { err: message } } as any;
    }
  }

  async start(): Promise<IIDLStartResult> {
    if (this.bridge.isConnected()) {
      return { started: true };
    }

    throw new Error('Cannot start, a client must connect');
  }

  async stop(): Promise<void> {
    throw new Error('Method not supported in websocket mode');
  }

  /**
   * @TODO - Should actually fetch this
   */
  verifyIDLVersion(): boolean {
    return true;
    // const info = this.manager.idlVersion;
    // if (info === undefined) {
    //   return false;
    // }
    // return compareVersions(info.release, '9.2.0') !== -1;
  }
}
