import { ObjectifyError } from '@idl/error-shared';
import {
  CleanIDLOutput,
  IDLInteractionManager,
} from '@idl/idl/idl-interaction-manager';
import { Logger } from '@idl/logger';
import { Sleep } from '@idl/shared/extension';
import {
  IDL_EVENT_LOOKUP,
  IDLEvaluateOptions,
  IDLEvent,
  IDLListenerArgs,
  IStartIDLConfig,
} from '@idl/types/idl/idl-process';
import { IDLVersionInfo } from '@idl/types/vscode-debug';
import { compareVersions } from 'compare-versions';

import {
  DEFAULT_MCP_EVALUATE_OPTIONS,
  IDLMCPExecutionManagerOptions,
} from './idl-mcp-execution-manager.interface';

/**
 * Manages an IDL session for use in a Node.js / MCP context.
 *
 * Mirrors the core logic of IDLNotebookExecutionManager but has no
 * dependency on the VS Code API — suitable for running in a plain
 * Node process.
 */
export class IDLMCPExecutionManager {
  /** Reference to our IDL class, manages process and input/output */
  _runtime: IDLInteractionManager;

  /** Whether we are currently subscribed to runtime events */
  private listening = false;

  /** Logger passed in by the caller */
  private log: Logger;

  /** Options for this manager instance */
  private options: IDLMCPExecutionManagerOptions;

  /** Path to the VSCode/MCP PRO code directory */
  private proDir: string;

  /**
   * @param log    Logger instance to use for diagnostic output
   * @param proDir Path to the directory containing auxiliary PRO files
   * @param options Optional configuration (e.g. readIOLine callback)
   */
  constructor(
    log: Logger,
    proDir: string,
    options: IDLMCPExecutionManagerOptions = {},
  ) {
    this.log = log;
    this.proDir = proDir;
    this.options = options;

    // Create runtime — does not immediately start IDL
    this._runtime = new IDLInteractionManager(log, proDir, '');

    this.listenToEvents();
  }

  /**
   * Releases resources held by this manager.
   *
   * Stops IDL if it is running and removes all event listeners.
   */
  async dispose(): Promise<void> {
    this._runtime.stop();

    if (this.listening) {
      this._runtime.removeAllListeners();
      this.listening = false;
    }
  }

  /**
   * If IDL has started, evaluates a command and returns its output.
   *
   * Guards against calling before IDL is running.
   */
  async evaluate(
    command: string,
    inOptions: IDLEvaluateOptions = {},
  ): Promise<string> {
    if (!this.isStarted()) {
      return '';
    }

    /** Merge caller options with defaults */
    const options = { ...DEFAULT_MCP_EVALUATE_OPTIONS, ...inOptions };

    /** Have IDL execute */
    const res = await this._runtime.evaluate(command, options);

    // Surface any syntax errors to the caller via errorsByFile
    this._runtime.errorCheck(res);

    return res;
  }

  /**
   * Returns true if IDL is currently running.
   */
  isStarted(): boolean {
    return this._runtime.isStarted();
  }

  /**
   * Launches a new IDL session.
   *
   * @param title  Human-readable label used in log messages
   * @param config Full IDL start configuration
   * @returns      `true` when IDL started and is ready; `false` on failure
   */
  async launch(title: string, config: IStartIDLConfig): Promise<boolean> {
    // Tear down any existing listeners so we get a clean state
    if (this.listening) {
      this._runtime.removeAllListeners();
      this.listening = false;
    }

    // Create a fresh runtime instance
    this._runtime = new IDLInteractionManager(this.log, this.proDir, '');
    this.listenToEvents();

    /**
     * Promise that resolves once IDL is ready (or fails to start)
     */
    const launchPromise = new Promise<boolean>((res) => {
      // IDL is ready for input
      this._runtime.once(IDL_EVENT_LOOKUP.IDL_READY, async () => {
        // Register the readIOLine handler so IDL Machine can ask for input
        this._registerReadIOLineHandler();

        // Read version information from IDL
        const versionRaw = CleanIDLOutput(
          await this._runtime.evaluate('vscode_getIDLInfo', {
            echo: false,
            silent: true,
            idlInfo: false,
          }),
        );

        try {
          const parsed = JSON.parse(versionRaw) as IDLVersionInfo;

          // Require IDL 8.8.0 or newer — same boundary as the notebook manager
          if (compareVersions(parsed.release, '9.2.0') === -1) {
            this.log.log({
              type: 'error',
              content: [
                `IDL ${parsed.release} is not supported. IDL 9.2.0 or newer is required.`,
              ],
            });

            this.stop();
            res(false);
            return;
          }

          this.log.log({
            type: 'debug',
            content: [`${title}: IDL ${parsed.release} started successfully`],
          });
        } catch (err) {
          // Non-fatal — version check failed but we can still proceed
          this.log.log({
            type: 'warn',
            content: [
              `${title}: Failed to parse IDL version info`,
              ObjectifyError(err),
            ],
          });
        }

        res(true);
      });

      // IDL failed to start
      this._runtime.once(IDL_EVENT_LOOKUP.FAILED_START, () => {
        if (!this.isStarted()) {
          this._IDLStopped('failed-start');
          res(false);
        }
      });
    });

    // Point the runtime at our PRO directory
    this._runtime.setVscodeProDir(this.proDir);

    // Start IDL
    this._runtime.start(config);

    return launchPromise;
  }

  /**
   * Wraps node.js EventEmitter `off` with IDL event types.
   */
  off<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void,
  ): void {
    this._runtime.off(event, listener);
  }

  /**
   * Wraps node.js EventEmitter `on` with IDL event types.
   */
  on<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void,
  ): void {
    this._runtime.on(event, listener);
  }

  /**
   * Wraps node.js EventEmitter `once` with IDL event types.
   */
  once<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void,
  ): void {
    this._runtime.once(event, listener);
  }

  /**
   * Removes all event listeners from the underlying runtime.
   */
  removeAllListeners(): void {
    this._runtime.removeAllListeners();
    this.listening = false;
  }

  /**
   * Resets the IDL session by stopping and re-launching IDL.
   *
   * @param config Full IDL start configuration used for the new session
   */
  async reset(config: IStartIDLConfig): Promise<void> {
    if (!this.isStarted()) {
      return;
    }

    await this.stop();

    // Short pause — avoids a race where the new start call races cleanup
    await Sleep(100);

    const ok = await this.launch('Resetting IDL session', config);

    if (!ok) {
      throw new Error('Failed to restart IDL');
    }
  }

  /**
   * Resets information about the call stack.
   */
  async resetCallStack(): Promise<void> {
    await this._runtime.resetCallStack();
  }

  /**
   * Stops the IDL process and clears listeners.
   */
  async stop(): Promise<void> {
    if (this.isStarted()) {
      this._runtime.stop();
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Handles an unexpected IDL shutdown.
   */
  private async _IDLStopped(
    reason: 'crash' | 'failed-start' | 'lost-connection',
  ): Promise<void> {
    const messages: Record<typeof reason, string> = {
      crash: 'IDL crashed or was stopped unexpectedly',
      'failed-start': 'IDL failed to start',
      'lost-connection': 'Lost connection to IDL',
    };

    this.log.log({
      type: 'error',
      content: [messages[reason]],
    });

    await this.stop();
  }

  /**
   * Registers a handler for the `readIOLine` request from the IDL Machine.
   *
   * If `options.onReadIOLine` is provided it is called with the prompt text;
   * otherwise an empty string is returned so IDL does not block.
   */
  private _registerReadIOLineHandler(): void {
    if (!this._runtime.isIDLMachine()) {
      return;
    }

    this._runtime.registerRequestHandler('readIOLine', async (params) => {
      if (this.options.onReadIOLine) {
        try {
          return await this.options.onReadIOLine(params.prompt ?? '');
        } catch (err) {
          this.log.log({
            type: 'error',
            content: ['readIOLine handler threw an error', ObjectifyError(err)],
          });
        }
      }
      return '';
    });
  }

  /**
   * Subscribes to events emitted by the IDL runtime.
   *
   * Guards against double-registration with the `listening` flag.
   */
  private listenToEvents(): void {
    if (this.listening) {
      return;
    }

    // IDL failed to start
    this._runtime.on(IDL_EVENT_LOOKUP.FAILED_START, () => {
      this._IDLStopped('failed-start');
    });

    // IDL resumed after a stop/breakpoint
    this._runtime.on(IDL_EVENT_LOOKUP.CONTINUE, () => {
      // No-op at this layer — callers can subscribe directly via on()
    });

    // General output from IDL
    this._runtime.on(IDL_EVENT_LOOKUP.OUTPUT, (msg) => {
      this.log.log({ type: 'debug', content: [`IDL output: ${msg}`] });
    });

    // Standard-out output
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_OUT, (msg) => {
      this.log.log({ type: 'debug', content: [`IDL stdout: ${msg}`] });
    });

    // Standard-error output
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_ERR, (msg) => {
      this.log.log({ type: 'debug', content: [`IDL stderr: ${msg}`] });
    });

    // IDL closed cleanly (e.g. user called `exit`)
    this._runtime.on(IDL_EVENT_LOOKUP.CLOSED_CLEANLY, async () => {
      this.log.log({ type: 'debug', content: ['IDL closed cleanly'] });
    });

    // Process ended
    this._runtime.on(IDL_EVENT_LOOKUP.END, async () => {
      this.log.log({ type: 'debug', content: ['IDL process ended'] });
    });

    // IDL crashed
    this._runtime.on(IDL_EVENT_LOOKUP.CRASHED, () => {
      this._IDLStopped('crash');
    });

    // Lost connection to IDL
    this._runtime.on(IDL_EVENT_LOOKUP.LOST_CONNECTION, () => {
      this._IDLStopped('lost-connection');
    });

    this.listening = true;
  }
}
