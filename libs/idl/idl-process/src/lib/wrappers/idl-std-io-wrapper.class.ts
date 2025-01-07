import {
  IDL_EVENT_LOOKUP,
  IDLEvent,
  IDLListenerArgs,
  REGEX_EMPTY_LINE,
  REGEX_IDL_PROMPT,
} from '@idl/idl/shared';
import { ChildProcess } from 'child_process';
import * as os from 'os';
import * as kill from 'tree-kill';

import { IDLProcess } from '../idl-process.class';

/**
 * Class that manages talking to IDL directly through standard IO
 *
 * Prone to errors and not perfect, but works OK.
 */
export class IDLStdIOWrapper {
  /**
   * Parent class that handles primary logic that we plug into
   */
  private parent: IDLProcess;

  /** The IDL process */
  private idl: ChildProcess;

  constructor(parent: IDLProcess) {
    this.parent = parent;
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  emit<T extends IDLEvent>(event: T, ...args: IDLListenerArgs<T>) {
    return this.parent.emit(event, ...args);
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  on<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void
  ): IDLProcess {
    return this.parent.on(event, listener);
  }

  /**
   * Wraps node.js event emitter with types for supported events and
   * event data.
   */
  once<T extends IDLEvent>(
    event: T,
    listener: (...args: IDLListenerArgs<T>) => void
  ): IDLProcess {
    return this.parent.once(event, listener);
  }

  /**
   * Start our debugging session
   */
  listen(idl: ChildProcess) {
    // save IDL prop
    this.idl = idl;

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
          this.parent.capturedOutput.substring(
            Math.max(this.parent.capturedOutput.length - 50, 0)
          ) + data
        ):
          {
            // remove IDL or ENVI prompt which might be split up
            if (this.parent.evaluating) {
              // get length of captured output
              const lBefore = this.parent.capturedOutput.length;

              // save output
              this.parent.capturedOutput =
                `${this.parent.capturedOutput}${data}`.replace(
                  REGEX_IDL_PROMPT,
                  ''
                );

              // get the additional text to log to the console with prompt removed
              const delta = this.parent.capturedOutput.substring(
                lBefore,
                this.parent.capturedOutput.length
              );

              // send if not empty - can have more than just the prompt return here
              if (delta.trim() !== '' || first) {
                this.parent.sendOutput(first ? data : delta);
              }
            }

            /**
             * setTimeout solves a race condition where the default case comes through after
             * the prompt does which means we miss out on content coming back to the first process.
             */
            setTimeout(() => {
              this.emit(
                IDL_EVENT_LOOKUP.PROMPT_READY,
                this.parent.capturedOutput
              );
            }, 50);
          }
          break;

        case REGEX_EMPTY_LINE.test(data) && os.platform() === 'win32':
          this.parent.capturedOutput += '\n';

          // too much nonsense comes from windows, but this is better logic on other platforms
          // mostly for startup
          if (!this.parent.started) {
            this.parent.sendOutput(' \n');
          }
          break;

        // other data that we need to capture?
        default:
          this.parent.capturedOutput += data;

          // check if we need to print to debug console
          this.parent.sendOutput(data);
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

    // listen for standard out output from IDL
    this.idl.stdout.on('data', handleOutput);

    // listen for standard error output from IDL
    this.idl.stderr.on('data', handleOutput);

    // set flag the first time we start up to be ready to accept input
    this.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (output) => {
      first = false;
      this.parent.started = true;

      // alert user
      this.parent.log.log({
        type: 'info',
        content: 'IDL has started!',
      });

      // alert parent that we are ready for input - different from prompt ready
      // because we need to do the "reset" work once it has really opened
      this.emit(IDL_EVENT_LOOKUP.IDL_STARTED, output);
    });
  }

  /**
   * Stops our IDL debug session
   */
  stop() {
    kill(this.idl.pid);
    this.idl.kill('SIGINT');
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
    // run our command
    const res = await this._evaluate(command);

    // handle the string output and check for stop conditions
    this.parent.stopCheck(res);

    // return the output
    return res;
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

      this.parent.log.log({
        type: 'debug',
        content: [`Executing:`, { command }],
      });

      // reset captured output
      this.parent.capturedOutput = '';
      this.parent.evaluating = true;

      // send the command to IDL
      if (os.platform() !== 'win32') {
        // print the "terminal" so we know we are ready for input
        this.idl.stdin.write(`${command}\nprint,'IDL>'\n`);
      } else {
        this.idl.stdin.write(`${command}\n`);
      }

      // listen for our event returning back to the command prompt
      this.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (output: string) => {
        this.parent.log.log({
          type: 'debug',
          content: [`Output:`, { output }],
        });

        // reset captured output
        this.parent.capturedOutput = '';
        this.parent.evaluating = false;

        // resolve our parent promise
        resolve(output);
      });
    });
  }
}
