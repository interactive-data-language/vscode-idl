import {
  IDL_EVENT_LOOKUP,
  REGEX_EMPTY_LINE,
  REGEX_IDL_PROMPT,
} from '@idl/types/idl/idl-process';
import { ChildProcess } from 'child_process';
import * as os from 'os';

/**
 * If we use import, it complains about types
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const kill = require('tree-kill');

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
  private process: IDLProcess;

  /** The IDL process */
  private idl: ChildProcess;

  constructor(process: IDLProcess) {
    this.process = process;
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
          this.process.capturedOutput.substring(
            Math.max(this.process.capturedOutput.length - 50, 0)
          ) + data
        ):
          {
            // remove IDL or ENVI prompt which might be split up
            if (this.process.evaluating) {
              // get length of captured output
              const lBefore = this.process.capturedOutput.length;

              // save output
              this.process.capturedOutput =
                `${this.process.capturedOutput}${data}`.replace(
                  REGEX_IDL_PROMPT,
                  ''
                );

              // get the additional text to log to the console with prompt removed
              const delta = this.process.capturedOutput.substring(
                lBefore,
                this.process.capturedOutput.length
              );

              // send if not empty - can have more than just the prompt return here
              if (delta.trim() !== '' || first) {
                this.process.sendOutput(first ? data : delta);
              }
            }

            /**
             * setTimeout solves a race condition where the default case comes through after
             * the prompt does which means we miss out on content coming back to the first process.
             */
            setTimeout(() => {
              this.process.emit(
                IDL_EVENT_LOOKUP.PROMPT_READY,
                this.process.capturedOutput
              );
            }, 50);
          }
          break;

        case REGEX_EMPTY_LINE.test(data) && os.platform() === 'win32':
          this.process.capturedOutput += '\n';

          // too much nonsense comes from windows, but this is better logic on other platforms
          // mostly for startup
          if (!this.process.started) {
            this.process.sendOutput(' \n');
          }
          break;

        // other data that we need to capture?
        default:
          this.process.capturedOutput += data;

          // check if we need to print to debug console
          this.process.sendOutput(data);
          break;
      }

      // check for recompile
      if (data.indexOf('% Procedure was compiled while active:') !== -1) {
        this.process.emit(IDL_EVENT_LOOKUP.CONTINUE);
      }
      if (
        data.indexOf(
          '% You compiled a main program while inside a procedure.  Returning.'
        ) !== -1
      ) {
        this.process.emit(IDL_EVENT_LOOKUP.CONTINUE);
      }
    };

    // listen for standard out output from IDL
    this.idl.stdout.on('data', handleOutput);

    // listen for standard error output from IDL
    this.idl.stderr.on('data', handleOutput);

    // set flag the first time we start up to be ready to accept input
    this.process.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (output) => {
      first = false;
      this.process.started = true;

      // alert user
      this.process.log.log({
        type: 'info',
        content: 'IDL has started!',
      });

      /**
       * Use a small timeout so that the prompt ready event propagates
       * before the IDL started event
       *
       * Without this, we have a small race condition with the web socket
       * connection to run IDL
       */
      setTimeout(() => {
        // alert parent that we are ready for input - different from prompt ready
        // because we need to do the "reset" work once it has really opened
        this.process.emit(IDL_EVENT_LOOKUP.IDL_STARTED, output);
      }, 25);
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
   * Runs a command in IDL with the assumption that we are IDLE.
   *
   * DO NOT USE THIS METHOD IF IDL IS ACTIVELY RUNNING SOMETHING because
   * it will screw up events.
   *
   * The use for this is getting scope information immediately before we return
   * as being complete and cleans up our event management
   */
  async evaluate(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // handle errors writing to stdin
      if (!this.idl.stdin.writable) {
        reject(new Error('no stdin available'));
      }

      // listen for our event returning back to the command prompt
      this.process.once(
        IDL_EVENT_LOOKUP.PROMPT_READY,
        async (output: string) => {
          resolve(output);
        }
      );

      // send the command to IDL
      if (os.platform() !== 'win32') {
        // print the "terminal" so we know we are ready for input
        this.idl.stdin.write(`${command}\nprint,'IDL>'\n`);
      } else {
        this.idl.stdin.write(`${command}\n`);
      }
    });
  }
}
