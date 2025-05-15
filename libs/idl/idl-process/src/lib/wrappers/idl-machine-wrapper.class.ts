import {
  ExecuteStringFlags,
  FromIDLMachineNotificationParams,
  IDLMachine,
  TOutNotification,
} from '@idl/idl/idl-machine';
import { LogType } from '@idl/logger';
import { IDL_EVENT_LOOKUP } from '@idl/types/idl/idl-process';
import { ChildProcess } from 'child_process';

/**
 * If we use import, it complains about types
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const kill = require('tree-kill');

import { IDL_TRANSLATION } from '@idl/translation';

import { IDLProcess } from '../idl-process.class';

/**
 * Wraps the IDL Machine process and connects events from it to/from our IDL Process class
 */
export class IDLMachineWrapper {
  /** The IDL process */
  private idl: ChildProcess;

  /** The IDL Machine */
  private machine: IDLMachine;

  /**
   * Parent class that handles primary logic that we plug into
   */
  private process: IDLProcess;

  constructor(process: IDLProcess) {
    this.process = process;
  }

  /**
   * Listen for notifications
   */
  _listenForNotifications() {
    this.machine.onNotification('breakpointMoved', () => {
      // do nothing
    });

    /**
     * Listen for IDL being done executing
     */
    this.machine.onNotification('commandFinished', () => {
      this.process.emit(
        IDL_EVENT_LOOKUP.PROMPT_READY,
        this.process.capturedOutput
      );
    });

    this.machine.onNotification('commandStarted', () => {
      /**
       * Nothing to do here, already handled with legacy solution
       */
    });

    this.machine.onNotification('compilerOpenFile', () => {
      /**
       * Nothing to do here for now
       */
    });

    this.machine.onNotification('deathHint', () => {
      /**
       * TODO
       */
    });

    this.machine.onNotification('debugSend', () => {
      /**
       * Nothing to do here, already handled with legacy solution
       */
    });

    this.machine.onNotification('delVar', () => {
      /**
       * TODO
       */
    });

    this.machine.onNotification('exitDone', () => {
      /**
       * TODO
       */
    });

    this.machine.onNotification('helpTopic', () => {
      /**
       * TODO
       */
    });

    this.machine.onNotification('licensingEvent', (params) => {
      if (params.event === 'AcquireFailure') {
        this.process.licensed = false;
        this.process.emit(
          IDL_EVENT_LOOKUP.STANDARD_ERR,
          IDL_TRANSLATION.debugger.errors.unableToLicenseIDL
        );
      }
    });

    this.machine.onNotification('interpreterStopped', () => {
      /**
       * Nothing to do here, already handled
       */
    });

    this.machine.onNotification('modalMessage', () => {
      /**
       * TODO
       */
    });

    this.machine.onNotification('openFile', () => {
      /**
       * Nothing to do here for now
       */
    });

    this.machine.onNotification('pathChange', () => {
      /**
       * Nothing to do here
       */
    });

    this.machine.onNotification('promptChange', (prompt) => {
      this.process.emit(IDL_EVENT_LOOKUP.PROMPT, prompt);
    });

    this.machine.onNotification('resetSessionDone', () => {
      /**
       * Nothing to do here
       */
    });

    this.machine.onNotification('runtimeError', (msg) => {
      this.process.log.log({
        type: 'error',
        content: ['IDL Machine error', msg],
      });
    });

    this.machine.onNotification('showBreakpoint', () => {
      /**
       * Nothing to do here
       */
    });

    this.machine.onNotification('showCompileError', () => {
      /**
       * Nothing to do here
       */
    });

    this.machine.onNotification('serverExit', () => {
      /**
       * Nothing to do here
       */
    });

    /**
     * Listen for startup
     */
    this.machine.onNotification('serverReady', () => {
      this.process.emit(IDL_EVENT_LOOKUP.IDL_STARTED, '');
    });

    /**
     * Handle output from IDL
     */
    this.machine.onNotification('tout', (msg) => {
      const stringified = this.stringifyOutput(msg);
      this.process.capturedOutput += stringified;
      this.process.sendOutput(stringified);

      // check for recompile
      if (
        this.process.capturedOutput.indexOf(
          '% Procedure was compiled while active:'
        ) !== -1
      ) {
        this.process.emit(IDL_EVENT_LOOKUP.CONTINUE);
      }
      if (
        this.process.capturedOutput.indexOf(
          '% You compiled a main program while inside a procedure.  Returning.'
        ) !== -1
      ) {
        this.process.emit(IDL_EVENT_LOOKUP.CONTINUE);
      }
    });

    this.machine.onNotification('workingDirChange', () => {
      /**
       * Nothing to do here for right now
       */
    });
  }

  /**
   * Register all of our handlers for requests
   */
  _listenForRequests() {
    this.machine.onRequest('getKeyboard', () => {
      /**
       * TODO
       */
      return 'f';
    });

    /**
     * Handle calls to the IDLNotify function
     *
     * IDL syntax: IDLNotify('id', param1, param2)
     */
    this.machine.onRequest('idlNotify', (params) => {
      // console.log('IDL Notify message', params);

      /**
       * Specific cases for IDL Notifications that we need to handle
       */
      switch (params.id) {
        /**
         * See vscode_log.pro for parameter information and how
         * it maps to our logger
         */
        case 'vscode-log':
          try {
            this.process.log.log({
              type: params.param1 as LogType,
              content: ['Message from IDL', JSON.parse(params.param2)],
            });
          } catch (err) {
            this.process.log.log({
              type: 'error',
              content: [`Error handling IDL Notify request:`, params, err],
            });
          }
          return 1;
        default:
          // do nothing
          break;
      }
      return 0;
    });

    /**
     * TODO
     */
    this.machine.onRequest('readIOLine', (msg) => {
      // console.log(`read line`);
      // console.log(msg);

      return 'I have been read!';
    });

    this.machine.onRequest('resetSessionConfirm', () => {
      // always reset
      return true;
    });

    /**
     * Always return true even though we don't do anything right now
     */
    this.machine.onRequest('setForegroundWindowConfirm', () => {
      return true;
    });
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

      /**
       * Get flags with proper type
       */
      const flags: ExecuteStringFlags = this.process.silent
        ? ((0x1 | 0x2) as ExecuteStringFlags)
        : 0x1;

      // listen for our event returning back to the command prompt
      this.process.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (output) => {
        resolve(output);
      });

      this.machine.sendNotification('exec', {
        string: command,
        flags,
      });
    });
  }

  /**
   * Start our debugging session
   */
  listen(idl: ChildProcess) {
    // save IDL prop
    this.idl = idl;
    this.machine = new IDLMachine(idl);

    // register listeners for our notifications and requests
    // form the server
    this._listenForNotifications();
    this._listenForRequests();
  }

  /**
   * Pause execution
   */
  pause() {
    this.machine.sendNotification('abort', undefined);
  }

  /**
   * Stops our IDL debug session
   */
  stop() {
    this.machine.sendNotification('exit', undefined);

    // short timeout to make sure it shuts down
    setTimeout(() => {
      kill(this.idl.pid);
    }, 100);
  }

  /**
   * Takes output from IDL and makes the proper string
   */
  stringifyOutput(params: FromIDLMachineNotificationParams<TOutNotification>) {
    switch (true) {
      case (params.f & 0x002) > 0:
        return '\n' + params.s;
      case (params.f & 0x004) > 0:
        return params.s + '\n';
      default:
        return params.s;
    }
  }
}
