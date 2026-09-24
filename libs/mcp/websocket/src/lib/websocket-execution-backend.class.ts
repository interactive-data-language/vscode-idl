import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import {
  IDLBreakpoint,
  IDLCodeCoverage,
  IDLEvaluateOptions,
  IDLInfo,
  IDLScopeItem,
  IDLSyntaxErrorLookup,
  IDLVariable,
} from '@idl/types/idl/idl-process';
import {
  IIDLMCPExecutionBackend,
  IPrepareIDLCodeResult,
  MCPProgressCallback,
  MCPToolParams,
  MCPToolResponse,
  MCPTools_IDL,
  PrepareIDLCodeCallback,
} from '@idl/types/mcp';
import { IDLVersionInfo, IIDLStartResult } from '@idl/types/vscode-debug';

import { WEBSOCKET_TOOL_NAMES } from './websocket-execution-backend.interface';
import { WebSocketToolBridge } from './websocket-tool-bridge.class';

/**
 * Hybrid `IIDLMCPExecutionBackend`: routes the small set of
 * `WEBSOCKET_TOOL_NAMES` tool calls through the connected WebSocket
 * client when one is present, and delegates everything else (plus
 * websocket tools when no client is connected) to the wrapped
 * `fallback` backend (the local IDL Machine backend).
 */
export class WebSocketExecutionBackend implements IIDLMCPExecutionBackend {
  bridge: WebSocketToolBridge;

  get idlVersion(): IDLVersionInfo | undefined {
    return this.fallback.idlVersion;
  }

  /** Callback to prepare code */
  private onCodePrepare: PrepareIDLCodeCallback;

  /** Backend used for anything not routed over the websocket connection */
  private fallback: IIDLMCPExecutionBackend;

  constructor(
    bridge: WebSocketToolBridge,
    onCodePrepare: PrepareIDLCodeCallback,
    fallback: IIDLMCPExecutionBackend,
  ) {
    this.bridge = bridge;
    this.onCodePrepare = onCodePrepare;
    this.fallback = fallback;
  }

  async evaluate(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<string> {
    return this.fallback.evaluate(command, options);
  }

  async clearBreakpoint(file?: string, line?: number): Promise<void> {
    return this.fallback.clearBreakpoint(file, line);
  }

  async debugContinue(): Promise<void> {
    return this.fallback.debugContinue();
  }

  async debugStepIn(): Promise<void> {
    return this.fallback.debugStepIn();
  }

  async debugStepOut(): Promise<void> {
    return this.fallback.debugStepOut();
  }

  async debugStepOver(): Promise<void> {
    return this.fallback.debugStepOver();
  }

  async evaluateENVICommand<T extends MCPTools_IDL>(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<MCPToolResponse<T>> {
    return this.fallback.evaluateENVICommand(command, options);
  }

  getErrorsByFile(): IDLSyntaxErrorLookup {
    return this.fallback.getErrorsByFile();
  }

  getIDLInfo(): IDLInfo {
    return this.fallback.getIDLInfo();
  }

  getVariables(frameId: number): Promise<IDLVariable[]> {
    return this.fallback.getVariables(frameId);
  }

  getCapturedOutput(): string {
    return this.fallback.getCapturedOutput();
  }

  getCodeCoverage(file: string): Promise<IDLCodeCoverage> {
    return this.fallback.getCodeCoverage(file);
  }

  async getTraceback(): Promise<IDLScopeItem[]> {
    return this.fallback.getTraceback();
  }

  isAtMain(): boolean {
    return this.fallback.isAtMain();
  }

  isStarted(): boolean {
    return this.fallback.isStarted();
  }

  async listBreakpoints(): Promise<IDLBreakpoint[]> {
    return this.fallback.listBreakpoints();
  }

  prepareCode(code: string): Promise<IPrepareIDLCodeResult | undefined> {
    return this.onCodePrepare(code);
  }

  registerIDLNotifyHandler(
    event: string,
    handler: FromIDLMachineRequestHandler<'idlNotify'>,
  ): void {
    return this.fallback.registerIDLNotifyHandler(event, handler);
  }

  async resetCallStack(): Promise<void> {
    return this.fallback.resetCallStack();
  }

  resetErrorsByFile(): void {
    return this.fallback.resetErrorsByFile();
  }

  async resetMain(): Promise<void> {
    return this.fallback.resetMain();
  }

  async setBreakpoint(file: string, line: number): Promise<void> {
    return this.fallback.setBreakpoint(file, line);
  }

  async runMCPTool<T extends MCPTools_IDL>(
    executionId: string,
    tool: T,
    params: MCPToolParams<T>,
    onProgress?: MCPProgressCallback,
  ): Promise<MCPToolResponse<T>> {
    // route through the connected websocket client for the allowed subset of tools
    if (WEBSOCKET_TOOL_NAMES.has(tool) && this.bridge.isConnected()) {
      try {
        return await this.bridge.sendRequest(tool, params);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : String(err ?? 'unknown error');
        return { success: false, result: { err: message } } as any;
      }
    }

    return this.fallback.runMCPTool(executionId, tool, params, onProgress);
  }

  async start(show?: boolean): Promise<IIDLStartResult> {
    return this.fallback.start(show);
  }

  async stop(): Promise<void> {
    return this.fallback.stop();
  }

  verifyIDLVersion(): boolean {
    return this.fallback.verifyIDLVersion();
  }
}
