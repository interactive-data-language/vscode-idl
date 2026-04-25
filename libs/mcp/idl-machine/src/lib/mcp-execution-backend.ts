import { FromIDLMachineRequestHandler } from '@idl/types/idl/idl-machine';
import {
  IDLEvaluateOptions,
  IDLSyntaxErrorLookup,
  IStartIDLConfig,
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

  /** Callback executed when we launch IDL */
  private onLaunch: () => void;

  constructor(
    manager: IDLMCPExecutionManager,
    launchConfig: IStartIDLConfig,
    onLaunch: () => void,
  ) {
    this.manager = manager;
    this.launchConfig = launchConfig;
    this.onLaunch = onLaunch;
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
    const info = this.manager.idlVersion;
    if (info === undefined) {
      return false;
    }
    return compareVersions(info.release, '9.2.0') !== -1;
  }
}
