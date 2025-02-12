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
   * Returns a flag if we are connected or not
   */
  isConnected() {
    return this.client.socket.connected;
  }

  /**
   * Start IDL session
   */
  start(config: IStartIDLConfig, startupMessage: string) {
    this.client.listen();

    /**
     * TODO: Add some wait/pause for connection before we actually start up
     */

    this.client.send(TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.START_IDL, {
      startupMessage,
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
   * Runs a command in IDL with the assumption that we are IDLE.
   *
   * DO NOT USE THIS METHOD IF IDL IS ACTIVELY RUNNING SOMETHING because
   * it will screw up events.
   *
   * The use for this is getting scope information immediately before we return
   * as being complete and cleans up our event management
   */
  async evaluate(command: string): Promise<string> {
    // return promise
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('Not connected to web socket server'));
      }

      // listen for our event returning back to the command prompt
      this.process.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (output) => {
        resolve(output);
      });

      this.client.send(TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.EVALUATE, {
        command,
        silent: this.process.silent,
      });
    });
  }
}
