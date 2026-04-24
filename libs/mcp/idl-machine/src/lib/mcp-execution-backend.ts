import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import {
  IDLEvaluateOptions,
  IDLSyntaxErrorLookup,
} from '@idl/types/idl/idl-process';
import { IDLVersionInfo, IENVISuccess } from '@idl/types/vscode-debug';
import { compareVersions } from 'compare-versions';

import {
  IENVICommandResult,
  IIDLExecutionBackend,
  IIDLStartResult,
} from './idl-execution-backend.interface';
import { IDLMCPExecutionManager } from './idl-mcp-execution-manager.class';

const DEFAULT_SUCCESS: IENVISuccess = { succeeded: false };

/**
 * Callback invoked when an `envi_success` or `envi_failure`
 * notification arrives. Used by `RegisterENVINotifyHandlers`
 * to store the latest message on this backend instance.
 */
export type MCPBackendENVIHandler = (msg: IENVISuccess) => void;

/**
 * Implementation of `IIDLExecutionBackend` backed by an
 * `IDLMCPExecutionManager` — no VS Code dependency.
 *
 * The caller owns the `IDLMCPExecutionManager` lifecycle; this
 * wrapper simply delegates through the interface contract.
 */
export class MCPExecutionBackend implements IIDLExecutionBackend {
  /**
   * Tracks the latest ENVI success/failure notification.
   *
   * Updated by `envi_success` / `envi_failure` IDL Notify handlers
   * registered via `RegisterENVINotifyHandlers()` from `@idl/mcp/envi`.
   */
  lastENVISuccessMessage: IENVISuccess | undefined;

  get idlVersion(): IDLVersionInfo | undefined {
    return this.manager.idlVersion;
  }

  /** Underlying manager that owns the IDL process */
  private manager: IDLMCPExecutionManager;

  constructor(manager: IDLMCPExecutionManager) {
    this.manager = manager;
  }

  async evaluate(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<string> {
    return this.manager.evaluate(command, options);
  }

  async evaluateENVICommand(
    command: string,
    options?: IDLEvaluateOptions,
  ): Promise<IENVICommandResult> {
    const idlOutput = await this.manager.evaluate(command, options);

    const res: IENVISuccess = {
      ...(this.lastENVISuccessMessage || DEFAULT_SUCCESS),
    };

    if (!res.succeeded) {
      res.error = `${res.reason || ''}\n\n${res.error || ''}`.trim();
    }

    return { idlOutput, ...res };
  }

  /**
   * Returns a callback that stores ENVI success/failure messages
   * on this backend instance. Pass this to `RegisterENVINotifyHandlers()`.
   */
  getENVIMessageHandler(): MCPBackendENVIHandler {
    return (msg: IENVISuccess) => {
      this.lastENVISuccessMessage = msg;
    };
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

  async start(): Promise<IIDLStartResult> {
    if (this.manager.isStarted()) {
      return { started: true };
    }
    return {
      started: false,
      reason: 'IDL not started — call launch() on the manager first',
    };
  }

  async stop(): Promise<void> {
    await this.manager.stop();
  }

  verifyIDLVersion(): boolean {
    const info = this.manager.idlVersion;
    if (info === undefined) {
      return false;
    }
    return compareVersions(info.release, '9.2.0') !== -1;
  }
}
