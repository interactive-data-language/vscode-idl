import { IDL_EVENT_LOOKUP, IStartIDLConfig } from '@idl/types/idl/idl-process';
import { TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP } from '@idl/types/idl/ws-client';

import { IDLProcess } from '../idl-process.class';
import { IDLWebSocketClient } from './idl-ws-client.class';

/**
 * Class that manages talking to IDL directly through standard IO
 *
 * Prone to errors and not perfect, but works OK.
 */
export class IDLWebSocketWrapper {
  /** Web socket client connection */
  private client: IDLWebSocketClient;

  /**
   * Parent class that handles primary logic that we plug into
   */
  private process: IDLProcess;

  constructor(process: IDLProcess, url = 'http://localhost:3333') {
    this.process = process;
    this.client = new IDLWebSocketClient(process, url);
  }

  /**
   * Start IDL session
   */
  start(vscodeProDir: string, config: IStartIDLConfig, startupMessage: string) {
    this.client.listen();

    // alert parent that we have started
    this.process.once(IDL_EVENT_LOOKUP.PROMPT_READY, (data) => {
      this.process.started = true;
    });

    this.client.send(TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.START_IDL, {
      startupMessage,
      vscodeProDir,
      config,
    });
  }

  /**
   * Stops our IDL debug session
   */
  stop() {
    this.client.send(TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.STOP_IDL, undefined);
  }

  /**
   * Pause execution
   */
  pause() {
    this.client.send(TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.PAUSE_IDL, undefined);
  }

  /**
   * External method to execute something in IDL
   */
  async evaluate(command: string): Promise<string> {
    // run our command
    const res = await this._evaluate(command);

    // handle the string output and check for stop conditions
    this.process.stopCheck(res);

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
      this.process.log.log({
        type: 'debug',
        content: [`Executing:`, { command }],
      });

      // reset captured output
      this.process.capturedOutput = '';
      this.process.evaluating = true;

      // listen for our event returning back to the command prompt
      this.process.once(
        IDL_EVENT_LOOKUP.PROMPT_READY,
        async (output: string) => {
          this.process.log.log({
            type: 'debug',
            content: [`Output:`, { output }],
          });

          // reset captured output
          this.process.capturedOutput = '';
          this.process.evaluating = false;

          // resolve our parent promise
          resolve(output);
        }
      );

      this.client.send(TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.EVALUATE, {
        command,
        silent: this.process.silent,
      });
    });
  }
}
