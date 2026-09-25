import {
  IDLMachineExecutionBackend,
  IDLMCPExecutionManager,
} from '@idl/mcp/idl-machine';
import { IStartIDLConfig } from '@idl/types/idl/idl-process';
import {
  MCPProgressCallback,
  MCPToolParams,
  MCPToolResponse,
  MCPTools_IDL,
  PrepareIDLCodeCallback,
} from '@idl/types/mcp';

import { WEBSOCKET_TOOL_NAMES } from './websocket-execution-backend.interface';
import { WebSocketToolBridge } from './websocket-tool-bridge.class';

/**
 * `IDLMachineExecutionBackend` that, if we have a valid websocket connection,
 * routes some tools to run through that instead of an IDL Machine process.
 * 
 * This allows any agentic session to redirect where some processing
 * runs while preserving full functionality independent of clients.
 */
export class WebSocketExecutionBackend extends IDLMachineExecutionBackend {
  bridge: WebSocketToolBridge;

  constructor(
    bridge: WebSocketToolBridge,
    manager: IDLMCPExecutionManager,
    launchConfig: IStartIDLConfig,
    onLaunch: () => void,
    onCodePrepare: PrepareIDLCodeCallback,
  ) {
    super(manager, launchConfig, onLaunch, onCodePrepare);
    this.bridge = bridge;
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

    return super.runMCPTool(executionId, tool, params, onProgress);
  }
}
