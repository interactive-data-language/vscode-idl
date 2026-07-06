import { IIDLExecutionBackend } from '@idl/mcp/idl-machine';
import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import { IDLSyntaxErrorLookup } from '@idl/types/idl/idl-process';
import {
  DEFAULT_ENVI_MCP_TOOL_RESPONSE,
  ENVIMCPToolResponse,
  ENVIMCPToolResponse_Failure,
  MCPToolResponse,
  MCPTools_VSCode,
} from '@idl/types/mcp';
import { IDLVersionInfo, IIDLStartResult } from '@idl/types/vscode-debug';
import {
  IDebugEvaluateOptions,
  IDL_DEBUG_ADAPTER,
  LAST_ENVI_MCP_MESSAGE,
  StartIDL,
} from '@idl/vscode/debug';
import { compareVersions } from 'compare-versions';
import { copy } from 'fast-copy';

const DEFAULT_SUCCESS = copy(DEFAULT_ENVI_MCP_TOOL_RESPONSE);

/**
 * Implementation of `IIDLExecutionBackend` backed by the VS Code
 * `IDLDebugAdapter` singleton.
 *
 * Delegates IDL execution through the VS Code debug adapter and
 * reads ENVI success state from the module-level
 * `LAST_ENVI_SUCCESS_MESSAGE` that is updated by the debug
 * adapter's IDL Notify handlers.
 */
export class VSCodeExecutionBackend implements IIDLExecutionBackend {
  get idlVersion(): IDLVersionInfo | undefined {
    return IDL_DEBUG_ADAPTER.idlVersion;
  }

  async evaluate(
    command: string,
    options?: IDebugEvaluateOptions,
  ): Promise<string> {
    return IDL_DEBUG_ADAPTER.evaluate(command, options);
  }

  async evaluateENVICommand<T extends MCPTools_VSCode>(
    command: string,
    options?: IDebugEvaluateOptions,
  ): Promise<MCPToolResponse<T>> {
    const idlOutput = await IDL_DEBUG_ADAPTER.evaluate(command, options);

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

  getErrorsByFile(): IDLSyntaxErrorLookup {
    return IDL_DEBUG_ADAPTER._runtime.getErrorsByFile();
  }

  isAtMain(): boolean {
    return IDL_DEBUG_ADAPTER.isAtMain();
  }

  isStarted(): boolean {
    return IDL_DEBUG_ADAPTER.isStarted();
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
