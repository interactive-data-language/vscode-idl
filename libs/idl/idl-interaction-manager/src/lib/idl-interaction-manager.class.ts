import { Logger } from '@idl/logger';

import { IDLEvaluationItem } from './idl-interaction-manager.interface';
import EventEmitter = require('events');
import {
  FromIDLMachineRequestHandler,
  FromIDLMachineRequests,
} from '@idl/idl/idl-machine';
import { IDLProcess } from '@idl/idl/idl-process';
import {
  DEFAULT_IDL_EVALUATE_OPTIONS,
  DEFAULT_IDL_INFO,
  IDL_EVENT_LOOKUP,
  IDLBreakpoint,
  IDLCallStack,
  IDLCallStackItem,
  IDLCodeCoverage,
  IDLEvaluateOptions,
  IDLEvent,
  IDLInfo,
  IDLListenerArgs,
  IDLSyntaxError,
  IDLSyntaxErrorLookup,
  IDLVariable,
  IRawBreakpoint,
  IStartIDLConfig,
  REGEX_SYNTAX_ERROR,
} from '@idl/types/idl/idl-process';
import { URI } from 'vscode-uri';

import { ProcessScope } from './helpers/process-scope';

/**
 * Class that manages interacting with IDL.
 *
 * The IDL process runs behind the scenes and this adds a layer of abstraction so that we
 * can get the information we need from IDL to do things like debugging.
 */
export class IDLInteractionManager {
  /**
   * Track syntax errors by file and continually update as we run commands
   */
  errorsByFile: IDLSyntaxErrorLookup = {};

  /** Track the current item we are processing */
  private _processing: IDLEvaluationItem;

  /** promise queue to manage pending requests */
  private _queue: IDLEvaluationItem[] = [];

  /** Our instance of IDL */
  private idl: IDLProcess;

  /**
   * @param startupMessage The message we print to standard error on non IDL Machine startups
   */
  constructor(log: Logger, vscodeProDir: string, startupMessage: string) {
    this.idl = new IDLProcess(log, vscodeProDir, startupMessage);
  }

  /**
   * Cancels all pending requests
   */
  cancelPending() {
    // cancel pending work
    if (this._processing !== undefined) {
      this._processing.reject('Canceled');
    }

    /** Get all pending requests */
    const pending = this._queue.splice(0, this._queue.length);

    // cancel all so we dont have floating promises
    for (let i = 0; i < pending.length; i++) {
      pending[i].reject('Canceled');
    }
  }

  /**
   * Checks IDL's output for errors when running
   */
  errorCheck(output: string) {
    // see if we need to check for errors
    // check if we have a syntax error, only report the first
    const errors: { file: string; line: number }[] = [];

    /** Match for syntax errors */
    let me: RegExpExecArray;
    while ((me = REGEX_SYNTAX_ERROR.exec(output)) !== null) {
      errors.push({ file: URI.file(me[2]).toString(), line: parseInt(me[3]) });
    }

    /**
     * Make new data structure with errors we detected
     */
    const newErrorsByFile: { [key: string]: IDLSyntaxError[] } = {};

    // save errors
    for (let i = 0; i < errors.length; i++) {
      if (!(errors[i].file in newErrorsByFile)) {
        newErrorsByFile[errors[i].file] = [errors[i]];
      } else {
        newErrorsByFile[errors[i].file].push(errors[i]);
      }
    }

    // get all old keys and reset their values
    const oldFiles = Object.keys(this.errorsByFile);
    for (let i = 0; i < oldFiles.length; i++) {
      if (!(oldFiles[i] in newErrorsByFile)) {
        newErrorsByFile[oldFiles[i]] = [];
      }
    }

    // update tracked errors
    Object.assign(this.errorsByFile, newErrorsByFile);
  }

  /**
   * Evaluate a statement in IDL
   */
  async evaluate(
    command: string,
    inOptions: IDLEvaluateOptions = {}
  ): Promise<string> {
    if (!this.isStarted()) {
      throw new Error('Start IDL before evaluating any expressions');
    }

    /**
     * Fill options with all values
     */
    const options = inOptions
      ? { ...DEFAULT_IDL_EVALUATE_OPTIONS, ...inOptions }
      : { ...DEFAULT_IDL_EVALUATE_OPTIONS };

    /** Get silent flag */
    const isSilent = options.silent !== undefined ? options.silent : false;

    /**
     * Add to our queue and wait for the results of running
     */
    const prom = new Promise<string>((res, rej) => {
      this._queue.push({
        reject: rej,
        execute: async () => {
          try {
            // set silent flag
            this.idl.silent = isSilent;

            if ('echo' in options ? options.echo : false) {
              this.idl.emit(
                IDL_EVENT_LOOKUP.OUTPUT,
                'echoThis' in options ? options.echoThis : command
              );
            }

            // resolve with output
            res(await this.idl.evaluate(command));
          } catch (err) {
            rej(err);
          }
        },
      });
    });

    // trigger processing
    this._next();

    /** Get the results from running */
    const results = await prom;

    /**
     * Check if we need to get scope information
     *
     * Only do this when not the IDL machine since it handles
     * this for us
     */
    if (options.idlInfo && !this.isIDLMachine()) {
      // make IDL silent
      this.idl.silent = true;

      // retrieve scope information
      const scopeInfo = ProcessScope(
        this.idl,
        await this.idl.evaluate(this.scopeInfoCommand(0))
      );

      // update if we have it or use default
      if (scopeInfo.hasInfo) {
        this.idl.idlInfo = scopeInfo;
      } else {
        this.idl.idlInfo = { ...DEFAULT_IDL_INFO };
      }
    }

    // reset silent flag
    this.idl.silent = false;

    // indicate that we are finished and the queue can be cleared
    this._processing = undefined;

    // trigger next processing
    this._next();

    // return results
    return results;
  }

  /**
   * Returns true/false if we are processing or not
   */
  executing(): boolean {
    return this._processing !== undefined;
  }

  /**
   * Get all the breakpoints currently set in IDL
   */
  async getBreakpoints(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filepath?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lineNumber?: number
  ): Promise<IDLBreakpoint[]> {
    // get the strings for our breakpoints
    const resp = await this.evaluate('  vscode_getBreakpoints', {
      silent: true,
      idlInfo: false,
    });

    // parse the response
    const res: IRawBreakpoint[] = JSON.parse(resp);

    // initialize output breakpoints
    const bps: IDLBreakpoint[] = [];

    // map to easier-to-read-format
    for (let i = 0; i < res.length; i++) {
      const bp = res[i];
      bps.push({ id: `${bp.i}`, path: bp.f, line: bp.l });
    }

    // return our breakpoints
    return bps;
  }

  /**
   * Retrieve call stack information
   */
  async getCallStack(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startFrame?: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endFrame?: number
  ): Promise<IDLCallStack> {
    // return if we have not started
    if (!this.idl.started) {
      return { frames: [], count: 0 };
    }

    /** Get latest call stack from IDL */
    const scope = await this.getCurrentStack();

    // initialize call stack
    const frames: IDLCallStackItem[] = [];

    // process call stack
    for (let i = 0; i < scope.length; i++) {
      frames.push({
        index: i,
        name: scope[i].routine,
        file: scope[i].file,
        line: scope[i].line,
      });
    }

    // return our info
    return {
      frames,
      count: scope.length,
    };
  }

  /**
   * Gets code coverage for a given file
   */
  async getCodeCoverage(file: string): Promise<IDLCodeCoverage> {
    return JSON.parse(
      await this.evaluate(`vscode_getFileCodeCoverage, '${file}'`, {
        silent: false,
        idlInfo: false,
      })
    );
  }

  /**
   * Gets the current call stack for IDL without using the most recent from running commands
   */
  async getCurrentStack() {
    if (this.isIDLMachine()) {
      return this.idl.idlInfo.scope;
    } else {
      return ProcessScope(
        this.idl,
        await this.evaluate(this.scopeInfoCommand(0), {
          silent: true,
          idlInfo: false,
        })
      ).scope;
    }
  }

  /**
   * Gets syntax problems from our IDL helper, tracked
   * by string versions of VSCode URIs
   */
  getErrorsByFile(): IDLSyntaxErrorLookup {
    return this.errorsByFile;
  }

  /**
   * Gets information about the current session of IDL
   */
  getIDLInfo(): IDLInfo {
    return this.idl.idlInfo;
  }

  /**
   * Get variables for current scope
   */
  async getVariables(frameId: number): Promise<IDLVariable[]> {
    // init result
    let vars: IDLVariable[] = [];

    // do we already have this scope?
    if (frameId === 0) {
      vars = this.idl.idlInfo.variables;
      // do we need to look up the scope information?
    } else {
      const scopeInfo = ProcessScope(
        this.idl,
        await this.evaluate(this.scopeInfoCommand(frameId), {
          silent: true,
          idlInfo: false,
        })
      );
      vars = scopeInfo.variables;
    }

    return vars;
  }

  /**
   * Let's us know if we are the IDL Machine or not
   */
  isIDLMachine() {
    return this.idl.processType !== 'stdio';
  }

  /**
   * Let's you know if IDL has started or not
   */
  isStarted() {
    return this.idl.started;
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  off<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void
  ): EventEmitter {
    return this.idl.off(event, listener);
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  on<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void
  ): EventEmitter {
    return this.idl.on(event, listener);
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  once<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void
  ): EventEmitter {
    return this.idl.once(event, listener);
  }

  /**
   * Pause the current session of IDL
   */
  pause() {
    this.idl.pause();
  }

  /**
   * Add a custom handler for IDL Notify
   */
  registerIDLNotifyHandler(
    idlNotifyEvent: string,
    handler: FromIDLMachineRequestHandler<'idlNotify'>
  ) {
    this.idl.registerIDLNotifyHandler(idlNotifyEvent, handler);
  }

  /**
   * Add a custom request handler for a given request from the IDL Machine
   *
   * Only one handler can be registered at a time for any event
   */
  registerRequestHandler<T extends FromIDLMachineRequests>(
    event: T,
    handler: FromIDLMachineRequestHandler<T>
  ) {
    this.idl.registerRequestHandler(event, handler);
  }

  /**
   * Removes all listeners from the IDL process
   */
  removeAllListeners() {
    this.idl.removeAllListeners();
  }

  /**
   * Reset errors by file
   */
  resetErrorsByFile() {
    this.errorsByFile = {};
  }

  /**
   * Returns a command to retrieve scope information from IDL
   */
  scopeInfoCommand(level: number) {
    return `  vscode_getScopeInfo, -${level}`;
  }

  /**
   * Updates folder with VSCode Pro files
   */
  setVscodeProDir(dir: string) {
    this.idl.vscodeProDir = dir;
  }

  /**
   * Start IDL
   */
  start(config: IStartIDLConfig) {
    this.idl.start(config);
  }

  /**
   * Stop IDL
   */
  stop() {
    this.cancelPending();
    if (this.isStarted()) {
      this.idl.stop();
    }
  }

  /**
   * Handle when we have another statement to execute
   */
  private async _next() {
    /** Return if processing or nothing to do */
    if (this._processing !== undefined || this._queue.length === 0) {
      return;
    }

    // get the next command to execute
    const info = this._queue.shift();

    // return if nothing to do
    if (info === undefined) {
      return;
    }

    // update what we are processing
    this._processing = info;

    // run in IDL and return the output
    await info.execute();

    // run again!
    this._next();
  }
}
