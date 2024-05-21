import { Logger } from '@idl/logger';
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
import {
  DEFAULT_IDL_INFO,
  IDL_STOPS,
  IDLCallStackItem,
  IStartIDLConfig,
  StopReason,
} from './idl.interface';
import {
  REGEX_EMPTY_LINE,
  REGEX_IDL_PROMPT,
  REGEX_NEW_LINE_COMPRESS,
  REGEX_STOP_DETECTION,
  REGEX_STOP_DETECTION_BASIC,
} from './utils/regex';

/**
 * Class that manages and spawns a session of IDL with event-emitter events
 * for when major actions happen.
 */
export class IDLProcess extends EventEmitter {
  /** Reference to our child process */
  idl: ChildProcess;

  /** Have we started IDL or not? */
  started = false;

  /** Are we in the process of closing? */
  closing = false;

  /** Whether we emit event for standard out or not */
  silent = false;

  /** Information about our current IDL session */
  idlInfo = copy(DEFAULT_IDL_INFO);

  /** The logger for our session of IDL, all messages go through this */
  log: Logger;

  /** Fully-qualified path to vscode.pro, needed for auxiliary IDL routines */
  vscodeProDir: string;

  /** Flag that indicates if we are evaluating a statement or not */
  private evaluating = false;

  /** Currently captured output from stdout/stderr */
  private capturedOutput = '';

  constructor(log: Logger, vscodeProDir: string) {
    super();
    this.log = log;
    this.vscodeProDir = vscodeProDir;
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
    if (!('IDL_DLM_PATH' in args.env)) {
      args.env.IDL_DLM_PATH = `+${args.config.IDL.directory}`;
    } else {
      args.env.IDL_DLM_PATH = `${args.env.IDL_DLM_PATH}${delimiter}+${args.config.IDL.directory}`;
    }

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

    /** Error from child process, if we have one */
    let error: Error;

    /**
     * Callback to handle output from IDL (stdout and stderr).
     *
     * If print is true, we emit an output event.
     */
    const handleOutput = (buff: any) => {
      /** Current stdout or stderr */
      const data = buff.toString('utf8');

      // what do we do?
      switch (true) {
        // back to "IDL> or ENVI>"" prompt? use the last 50 characters of the total captured output to see
        // if the prompt partially came through before
        case REGEX_IDL_PROMPT.test(
          this.capturedOutput.substring(
            Math.max(this.capturedOutput.length - 50, 0)
          ) + data
        ):
          {
            // remove IDL or ENVI prompt which might be split up
            if (this.evaluating) {
              // get length of captured output
              const lBefore = this.capturedOutput.length;

              // save output
              this.capturedOutput = `${this.capturedOutput}${data}`.replace(
                REGEX_IDL_PROMPT,
                ''
              );

              // get the additional text to log to the console with prompt removed
              const delta = this.capturedOutput.substring(
                lBefore,
                this.capturedOutput.length
              );

              // send if not empty - can have more than just the prompt return here
              if (delta.trim() !== '' || first) {
                this.sendOutput(first ? data : delta);
              }
            }

            /**
             * setTimeout solves a race condition where the default case comes through after
             * the prompt does which means we miss out on content coming back to the first process.
             */
            setTimeout(() => {
              this.emit(IDL_EVENT_LOOKUP.PROMPT_READY, this.capturedOutput);
            }, 50);
          }
          break;

        case REGEX_EMPTY_LINE.test(data) && os.platform() === 'win32':
          if (this.evaluating) {
            this.capturedOutput += '\n';
          }

          // too much nonsense comes from windows, but this is better logic on other platforms
          // mostly for startup
          if (!this.started) {
            this.sendOutput(' \n');
          }
          break;

        // other data that we need to capture?
        default:
          if (this.evaluating) {
            this.capturedOutput += data;
          }

          // check if we need to print to debug console
          this.sendOutput(data);
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
    this.idl.stdout.on('data', handleOutput);

    // listen for standard error output from IDL
    this.idl.stderr.on('data', handleOutput);

    // set flag the first time we start up to be ready to accept input
    this.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (output) => {
      first = false;
      this.started = true;

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
              { cmd, code, signal, capturedOutput: this.capturedOutput, error },
            ],
            alert: `${
              IDL_TRANSLATION.debugger.adapter.failedStart
            } "${this.capturedOutput.trim()}"`,
          });
          this.emit(IDL_EVENT_LOOKUP.FAILED_START, 'Failed to start IDL');
          break;
        default:
          this.log.log({
            type: 'error',
            content: [
              'IDL crashed or was stopped by the user',
              { cmd, code, signal, capturedOutput: this.capturedOutput, error },
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
   * Wraps emitting standard output to make sure all checks happen in one place
   */
  sendOutput(data: any) {
    // send output only if we are not silent
    if (!this.silent) {
      this.emit(IDL_EVENT_LOOKUP.STANDARD_OUT, data);
    }

    /**
     * If we are not evaluating a statement, then do a stop check
     *
     * This handles a case where:
     *
     * 1. I have PRO code with a breakpoint set
     * 2. I start an IDL UI application
     * 3. A UI callback runs the routine with a breakpoint
     *
     * When in this mode, we don't capture the output and save in our variable
     * because it is not directly from the command that we were executing
     */
    if (!this.evaluating && this.started) {
      if (
        REGEX_STOP_DETECTION_BASIC.test(
          this.capturedOutput.replace(/\r*\n/gim, '')
        )
      ) {
        setTimeout(() => {
          this.emit(IDL_EVENT_LOOKUP.STOP, 'stop', {
            file: '$main$',
            index: 0,
            line: 0,
            name: '$main$',
          });
        }, 0);
      }
    }
  }

  /**
   * Stops our IDL debug session
   */
  stop() {
    this.closing = true;
    this.started = false;
    kill(this.idl.pid);
    this.idl.kill('SIGINT');
    this.idlInfo = { ...DEFAULT_IDL_INFO };
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
  async evaluate(command: string): Promise<string> {
    if (!this.started) {
      throw new Error('IDL is not started');
    }

    // run our command
    const res = await this._evaluate(command);

    // handle the string output and check for stop conditions
    this.stopCheck(res);

    // return the output
    return res;
  }

  /**
   * Parse output from IDL and check if we have any reasons that we stopped
   */
  private stopCheck(origInput: string): boolean {
    // get rid of bad characters, lots of carriage returns in the output (\r\r\n) on windows at least
    const output = origInput.replace(REGEX_NEW_LINE_COMPRESS, '');

    this.log.log({
      type: 'debug',
      content: `Error check output`,
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
   * Runs a command in IDL with the assumption that we are IDLE.
   *
   * DO NOT USE THIS METHOD IF IDL IS ACTIVELY RUNNING SOMETHING because
   * it will screw up events.
   *
   * The use for this is getting scope information immediately before we return
   * as being complete and cleans up our event management
   */
  private _evaluate(command: string): Promise<string> {
    // return promise
    return new Promise((resolve, reject) => {
      // handle errors writing to stdin
      if (!this.idl.stdin.writable) {
        reject(new Error('no stdin available'));
      }

      this.log.log({
        type: 'debug',
        content: [`Executing:`, { command }],
      });

      // reset captured output
      this.capturedOutput = '';
      this.evaluating = true;

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

        // reset captured output
        this.capturedOutput = '';
        this.evaluating = false;

        // resolve our parent promise
        resolve(output);
      });
    });
  }
}
