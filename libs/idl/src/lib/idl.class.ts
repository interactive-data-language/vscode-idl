import { Logger } from '@idl/logger';
import { CleanPath } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { ChildProcess, execSync, spawn } from 'child_process';
import { EventEmitter } from 'events';
import copy from 'fast-copy';
import { existsSync } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { delimiter } from 'path';
import * as kill from 'tree-kill';

import { IDLListenerArgs } from './args.interface';
import { IDL_EVENT_LOOKUP, IDLEvent } from './events.interface';
import { ProcessScope } from './helpers/process-scope';
import {
  DEFAULT_IDL_EVALUATE_OPTIONS,
  DEFAULT_IDL_INFO,
  IDL_STOPS,
  IDLBreakpoint,
  IDLCallStack,
  IDLCallStackItem,
  IDLEvaluateOptions,
  IDLVariable,
  IRawBreakpoint,
  IStartIDLConfig,
  ISyntaxError,
  StopReason,
} from './idl.interface';
import { PromiseQueue } from './utils/promise-queue.class';
import {
  REGEX_COMPILE_ERROR,
  REGEX_EMPTY_LINE,
  REGEX_IDL_PROMPT,
  REGEX_NEW_LINE_COMPRESS,
  REGEX_STOP_DETECTION,
} from './utils/regex';

/**
 * Class that manages and spawns a session of IDL with event-emitter events
 * for when major actions happen.
 */
export class IDL extends EventEmitter {
  /** Reference to our child process */
  idl: ChildProcess;

  /** Have we started IDL or not? */
  started = false;

  /** Are we in the process of closing? */
  closing = false;

  /** promise queue to manage pending requests */
  queue: PromiseQueue;

  /** Whether we emit event for standard out or not */
  silent = false;

  /** Information about our current IDL session */
  idlInfo = copy(DEFAULT_IDL_INFO);

  /** The logger for our session of IDL, all messages go through this */
  log: Logger;

  /** Fully-qualified path to vscode.pro, needed for auxiliary IDL routines */
  vscodeProDir: string;

  /**
   * Track syntax errors by file and continually update as we run commands
   */
  errorsByFile: { [key: string]: ISyntaxError[] } = {};

  constructor(log: Logger, vscodeProDir: string) {
    super();
    this.log = log;
    this.vscodeProDir = vscodeProDir;
    this.queue = new PromiseQueue(this);
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  emit<T extends IDLEvent>(event: T, ...args: IDLListenerArgs<T>) {
    return super.emit(event, ...args);
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  on<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void
  ): this {
    return super.on(event, listener);
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  once<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void
  ): this {
    return super.once(event, listener);
  }

  /**
   * Start our debugging session
   */
  start(args: IStartIDLConfig) {
    // reset props if needed
    if (this.started) {
      return;
    }

    // make sure we have our vscode file
    if (!existsSync(this.vscodeProDir)) {
      this.log.log({
        type: 'error',
        content: [
          `Unable to start IDL. Auxiliary PRO code directory not found at expected location:`,
          `"${this.vscodeProDir}"`,
        ],
      });
      this.emit(IDL_EVENT_LOOKUP.FAILED_START, 'Failed to start IDL');
      return;
    }

    // set the location of IDL as variable if it is not already
    if (!('IDL_DIR' in args.env)) {
      args.env.IDL_DIR = path.dirname(path.dirname(args.config.IDL.directory));
    }

    // make sure the DLM path is also set
    args.env.IDL_DLM_PATH = args.config.IDL.directory;

    // add a path for the directory
    if (!('IDL_PATH' in args.env)) {
      args.env.IDL_PATH = `+${this.vscodeProDir}`;
    } else {
      args.env.IDL_PATH =
        `+${this.vscodeProDir}` + delimiter + args.env.IDL_PATH;
    }

    /** Get path variable which, for windows is "Path" and not "PATH" */
    const pathVar = os.platform() === 'win32' ? 'Path' : 'PATH';

    // make sure IDL is also on the path
    if (pathVar in args.env) {
      if (!args.env[pathVar].includes(args.config.IDL.directory)) {
        args.env[pathVar] =
          args.config.IDL.directory + delimiter + args.env[pathVar];
      }
    } else {
      args.env[pathVar] = args.config.IDL.directory;
    }

    // set IDL prompt - initial launch to override user preferences
    // since this controls parsing
    args.env.IDL_PROMPT = 'IDL> ';

    // check if we need to manage the language environment variable
    if (os.platform() === 'darwin') {
      if (!('LANG' in args.env)) {
        args.env['LANG'] = `${execSync(`defaults read -g AppleLocale`)
          .toString()
          .trim()}.UTF-8`;
      }
    }

    // build the command for starting IDL
    const cmd = `${args.config.IDL.directory}${path.sep}idl`;

    // start our idl debug session and wait for prompt ready
    this.log.log({
      type: 'info',
      content: [
        'Starting IDL',
        {
          cmd,
          dir: args.env.IDL_DIR,
          path: args.env.IDL_PATH,
          dlm_path: args.env.IDL_DLM_PATH,
        },
      ],
    });

    // launch IDL with the environment from our parent process and in the specified folder
    this.idl = spawn(cmd, null, {
      env: args.env,
      cwd: args.cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // check for errors
    if (!this.idl.stdout || !this.idl.stderr || !this.idl.stdin) {
      this.log.log({
        type: 'error',
        content: [
          `Unable to start IDL. One or more of standard in, out, or error did not initialize:`,
        ],
      });
      this.emit(IDL_EVENT_LOOKUP.FAILED_START, 'Failed to start IDL');
      return;
    }

    // // listen for standard out output from IDL
    // this.idl.stdio[3].on('data', (buff) => {
    //   this.log.log({
    //     type: 'info',
    //     content: `Stdout: ${JSON.stringify(buff.toString('utf8'))}`,
    //   });
    // });

    // write the IDL prompt if not windows so that we properly
    // detect start. for our "poor man's solution" this is the indicator
    // that we are ready to go again
    if (os.platform() !== 'win32') {
      this.idl.stdin.write("print, 'IDL>'\n");
    }

    /**
     * Flag indicating it is the first time we get a prompt and we should
     * fire the event that we have started
     */
    let first = true;

    /** Currently captured output from stdout/stderr */
    let capturedOutput = '';

    /** Error from child process, if we have one */
    let error: Error;

    /**
     * Callback that checks our return conditions every time data comes through
     */
    const handleReturn = () => {
      // // check if we have a prompt match!
      // if (
      //   REGEX_IDL_PROMPT.test(data) ||
      //   REGEX_IDL_PROMPT.test(capturedOutput)
      // ) {
      /**
       * setTimeout solves a race condition where the default case comes through after
       * the prompt does which means we miss out on content coming back to the first process.
       */
      setTimeout(() => {
        this.emit(IDL_EVENT_LOOKUP.PROMPT_READY, capturedOutput);
        capturedOutput = '';
      }, 0);
      // }
    };

    /**
     * Callback to handle output from IDL (stdout and stderr).
     *
     * If print is true, we emit an output event.
     */
    const handleOutput = (buff: any, print = false) => {
      /** Current stdout or stderr */
      const data = buff.toString('utf8');

      // what do we do?
      switch (true) {
        // back to "IDL> or ENVI>"" prompt? use the last 50 characters of the total captured output to see
        // if the prompt partially came through before
        case REGEX_IDL_PROMPT.test(
          capturedOutput.substring(Math.max(capturedOutput.length - 50, 0)) +
            data
        ):
          {
            // get length of captured output
            const lBefore = capturedOutput.length;

            // remove IDL or ENVI prompt which might be split up
            capturedOutput = `${capturedOutput}${data}`.replace(
              REGEX_IDL_PROMPT,
              ''
            );

            // check if we need to print to debug console
            if (print) {
              // get the additional text to log to the console with prompt removed
              const delta = capturedOutput.substring(
                lBefore,
                capturedOutput.length
              );

              // send if not empty - can have more than just the prompt return here
              if (delta.trim() !== '' || first) {
                this.emit(IDL_EVENT_LOOKUP.STANDARD_OUT, first ? data : delta);
              }
            }

            // check for return
            handleReturn();
          }
          break;

        case REGEX_EMPTY_LINE.test(data) && os.platform() === 'win32':
          capturedOutput += '\n';
          // too much nonsense comes from windows, but this is better logic on other platforms
          // mostly for startup
          if (!this.started) {
            this.emit(IDL_EVENT_LOOKUP.STANDARD_OUT, ' \n');
          }
          break;

        // other data that we need to capture?
        default:
          capturedOutput += data;

          // check if we need to print to debug console
          if (print) {
            this.emit(IDL_EVENT_LOOKUP.STANDARD_OUT, data);
          }
          break;
      }

      // check for recompile
      if (data.indexOf('% Procedure was compiled while active:') !== -1) {
        this.emit(IDL_EVENT_LOOKUP.CONTINUE);
      }
      if (
        data.indexOf(
          '% You compiled a main program while inside a procedure.  Returning.'
        ) !== -1
      ) {
        this.emit(IDL_EVENT_LOOKUP.CONTINUE);
      }
    };

    // listen for errors
    this.idl.on('error', (err) => {
      error = err;
    });

    // listen for standard out output from IDL
    this.idl.stdout.on('data', (buff) => {
      this.log.log({
        type: 'debug',
        content: `Stdout: ${JSON.stringify(buff.toString('utf8'))}`,
      });
      handleOutput(buff, this.silent ? false : true);
    });

    // listen for standard error output from IDL
    this.idl.stderr.on('data', (buff) => {
      this.log.log({
        type: 'debug',
        content: `Stderr: ${JSON.stringify(buff.toString('utf8'))}`,
      });
      handleOutput(buff, this.silent ? false : true);

      // always check stderr for stops and such
      this.stopCheck(capturedOutput, false);
    });

    // set flag the first time we start up to be ready to accept input
    this.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (output) => {
      first = false;
      this.started = true;
      this.queue._next(); // trigger queue processing

      // alert user
      this.log.log({
        type: 'info',
        content: 'IDL has started!',
      });

      // alert parent that we are ready for input - different from prompt ready
      // because we need to do the "reset" work once it has really opened
      this.emit(IDL_EVENT_LOOKUP.IDL_STARTED, output);
    });

    // listen for closing
    this.idl.stdout.on('close', (code: number, signal: string) => {
      switch (true) {
        case this.closing:
          // do nothing because we are closing IDL
          this.emit(IDL_EVENT_LOOKUP.CLOSED_CLEANLY);
          break;
        case !this.started:
          this.log.log({
            type: 'error',
            content: [
              'Failed to start IDL',
              { cmd, code, signal, capturedOutput, error },
            ],
            alert: `${
              IDL_TRANSLATION.debugger.adapter.failedStart
            } "${capturedOutput.trim()}"`,
          });
          this.emit(IDL_EVENT_LOOKUP.FAILED_START, 'Failed to start IDL');
          break;
        default:
          this.log.log({
            type: 'error',
            content: [
              'IDL crashed or was stopped by the user',
              { cmd, code, signal, capturedOutput, error },
            ],
            alert: IDL_TRANSLATION.debugger.adapter.crashed,
          });
          this.emit(IDL_EVENT_LOOKUP.CRASHED, code, signal);
          break;
      }

      // reset properties
      this.stop();
      this.closing = false;
    });
  }

  /**
   * Stops our IDL debug session
   */
  stop() {
    this.closing = true;
    this.started = false;
    kill(this.idl.pid);
    this.idl.kill('SIGINT');
    this.queue.clear();
    this.silent = false;
    this.idlInfo = { ...DEFAULT_IDL_INFO };
  }

  /**
   * Returns a command to retrieve scope information from IDL
   */
  scopeInfoCommand(level: number) {
    return `  vscode_getScopeInfo, -${level}`;
  }

  /**
   * Get variables for current scope
   */
  async getVariables(frameId: number): Promise<IDLVariable[]> {
    // init result
    let vars: IDLVariable[] = [];

    // do we already have this scope?
    if (frameId === 0) {
      vars = this.idlInfo.variables;
      // do we need to look up the scope information?
    } else {
      const scopeInfo = ProcessScope(
        this,
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
   * Gets the current call stack for IDL without using the most recent from running commands
   */
  async getCurrentStack() {
    return ProcessScope(
      this,
      await this.evaluate(this.scopeInfoCommand(0), {
        silent: true,
        idlInfo: false,
      })
    ).scope;
  }

  /**
   * Retrieve call stack information
   */
  getCachedStack(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startFrame: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endFrame?: number
  ): IDLCallStack {
    // return if we have not started
    if (!this.started) {
      return { frames: [], count: 0 };
    }

    // use the cached info from the latest call
    const info = this.idlInfo;

    // initialize call stack
    const frames: IDLCallStackItem[] = [];

    // process call stack
    for (let i = 0; i < info.scope.length; i++) {
      const val = info.scope[i];
      frames.push({
        index: i,
        name: val.routine,
        file: val.file,
        line: val.line,
      });
    }

    // return our info
    return {
      frames,
      count: info.scope.length,
    };
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
   * Add a breakpoint to IDL
   */
  async setBreakPoint(filePath: string, line: number): Promise<IDLBreakpoint> {
    // set the breakpoint
    await this.evaluate(`breakpoint, /SET, '${CleanPath(filePath)}', ${line}`, {
      silent: true,
      idlInfo: false,
    });

    // TODO: do we need to also get the breakpoint back so we know exactly where it is located?

    // return location we clicked
    return { path: filePath, line };
  }

  /**
   * Remove all breakpoints from IDL
   */
  async clearBreakpoints(filePath?: string) {
    // get current breakpoints
    const breakpoints = await this.getBreakpoints(filePath);

    // make our breakpoint command
    const cmd = breakpoints
      .map((bp) => `breakpoint, /CLEAR, ${bp.id}`)
      .join(' & ');

    // clear all breakpoints
    await this.evaluate(cmd, {
      silent: true,
      idlInfo: false,
    });
  }

  /**
   * Returns true/false if we are processing or not
   */
  executing(): boolean {
    return this.queue.nProcessing > 0;
  }

  /**
   * Pause execution
   */
  pause() {
    this.idl.kill('SIGINT');
  }

  /**
   * External method to execute something in IDL
   */
  async evaluate(
    command: string,
    options: IDLEvaluateOptions = {}
  ): Promise<string> {
    if (!this.started) {
      throw new Error('IDL is not started');
    }
    if ('echo' in options ? options.echo : false) {
      this.emit(
        IDL_EVENT_LOOKUP.OUTPUT,
        'echoThis' in options ? options.echoThis : command
      );
    }

    // add extra spaces at the beginning of the command
    return await this._executeQueue(`${command}`, options);
  }

  /**
   * Retrieves scope information for our IDL session
   *
   * SHOULD ONLY BE USED IMMEDIATELY AFTER WE RETURN FROM EXECUTING
   * A STATEMENT, otherwise there might be problems
   */
  private async _getScopeInfo() {
    return ProcessScope(
      this,
      await this._executeWithNoPending(this.scopeInfoCommand(0), {
        silent: true,
        idlInfo: false, // dont recurse
      })
    );
  }

  /**
   * Parse output from IDL and check if we have any reasons that we stopped
   */
  private stopCheck(origInput: string, errorCheck = true): boolean {
    // get rid of bad characters, lots of carriage returns in the output (\r\r\n) on windows at least
    const output = origInput.replace(REGEX_NEW_LINE_COMPRESS, '');

    // see if we need to check for errors
    if (errorCheck) {
      // check if we have a syntax error, only report the first
      const errors: { file: string; line: number }[] = [];

      /** Match for syntax errors */
      let me: RegExpExecArray;
      while ((me = REGEX_COMPILE_ERROR.exec(output)) !== null) {
        errors.push({ file: me[1], line: parseInt(me[2]) });
      }

      /**
       * Make new data structure with errors we detected
       */
      const newErrorsByFile: { [key: string]: ISyntaxError[] } = {};

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

      Object.assign(this.errorsByFile, newErrorsByFile);
    }

    this.log.log({
      type: 'debug',
      content: `Handle output: ${JSON.stringify(output)}`,
    });

    // check for traceback information
    const reasons: StopReason[] = [];
    const traceback: IDLCallStackItem[] = [];
    let m: RegExpExecArray;
    while ((m = REGEX_STOP_DETECTION.exec(output)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === REGEX_STOP_DETECTION.lastIndex) {
        REGEX_STOP_DETECTION.lastIndex++;
      }

      // extract traceback
      traceback.push({
        file: m[4],
        line: parseInt(m[3]),
        index: 0,
        name: m[2].replace(/ /, ''),
      });

      // find the reason
      switch (true) {
        case m[1].includes('% Execution halted at'):
          reasons.push(IDL_STOPS.ERROR);
          break;
        case m[1].includes('% Breakpoint'):
          reasons.push(IDL_STOPS.BREAKPOINT);
          break;
        case m[1].includes('% Stepped to'):
          reasons.push(IDL_STOPS.STEP);
          break;
        case m[1].includes('% Stop encountered'):
          reasons.push(IDL_STOPS.STOP);
          break;
        default:
          reasons.push(IDL_STOPS.BREAKPOINT);
      }
    }

    // check if we need to emit an event
    // TODO: the traceback is not always correct, but it is not used, just sent with the event
    // vscode makes a request for the traceback instead
    if (traceback.length > 0) {
      this.emit(
        IDL_EVENT_LOOKUP.STOP,
        reasons[reasons.length - 1],
        traceback[traceback.length - 1]
      );
    }

    // return flag if we found a reason to stop
    return traceback.length > 0;
  }

  /**
   * Internal command to directly execute something in IDL through our queue
   */
  private async _executeQueue(
    command: string,
    inOptions?: IDLEvaluateOptions
  ): Promise<string> {
    // determine options
    const options = inOptions
      ? { ...DEFAULT_IDL_EVALUATE_OPTIONS, ...inOptions }
      : { ...DEFAULT_IDL_EVALUATE_OPTIONS };

    // add to our queue and wait for the string response
    const res = await this.queue.add(
      {
        statement: command,
        idl: this,
        idlInfo: options.idlInfo,
        wait: !this.started,
        cut: options.cut,
      },
      async () => {
        return this._executeWithNoPending(command, options);
      }
    );

    // emit the current prompt
    this.emit(IDL_EVENT_LOOKUP.PROMPT, this.idlInfo.envi ? 'ENVI>' : 'IDL>');

    // handle the string output and check for stop conditions
    this.stopCheck(res.output);

    // return the output
    return res.output;
  }

  /**
   * Runs a command in IDL with the assumption that we are IDLE.
   *
   * DO NOT USE THIS METHOD IF IDL IS ACTIVELY RUNNING SOMETHING because
   * it will screw up events.
   *
   * The use for this is getting scope information immediately before we return
   * as being complete and cleans up our event management
   */
  private _executeWithNoPending(
    command: string,
    options: IDLEvaluateOptions
  ): Promise<string> {
    // return promise
    return new Promise((resolve, reject) => {
      // handle errors writing to stdin
      if (!this.idl.stdin.writable) {
        reject(new Error('no stdin available'));
      }

      // set silent flag
      this.silent = options.silent !== undefined ? options.silent : false;

      this.log.log({
        type: 'debug',
        content: [`Executing:`, { command }],
      });

      // send the command to IDL
      if (os.platform() !== 'win32') {
        // print the "terminal" so we know we are ready for input
        this.idl.stdin.write(`${command}\nprint,'IDL>'\n`);
      } else {
        this.idl.stdin.write(`${command}\n`);
      }

      // listen for our event returning back to the command prompt
      this.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (output: string) => {
        this.log.log({
          type: 'debug',
          content: [`Output:`, { output }],
        });

        // check if we have scope
        if (options.idlInfo) {
          // retrieve scope information
          const scopeInfo = await this._getScopeInfo();

          // update if we have it or use default
          if (scopeInfo.hasInfo) {
            this.idlInfo = scopeInfo;
          } else {
            this.idlInfo = { ...DEFAULT_IDL_INFO };
          }
        }

        // reset silent flag
        this.silent = false;

        // resolve our parent promise
        resolve(output);
      });
    });
  }
}
