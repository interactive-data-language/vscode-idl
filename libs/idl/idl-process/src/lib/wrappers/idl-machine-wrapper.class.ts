import {
  ExecuteStringFlags,
  FromIDLMachineNotificationParams,
  FromIDLMachineRequestHandler,
  FromIDLMachineRequests,
  IDLMachine,
  TOutNotification,
} from '@idl/idl/idl-machine';
import { LogType } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_EVENT_LOOKUP, IDLOutput } from '@idl/types/idl/idl-process';
import { ChildProcess } from 'child_process';
import copy from 'fast-copy';
import { deepEqual } from 'fast-equals';

import { IDLProcess } from '../idl-process.class';

/**
 * If we use import, it complains about types
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const kill = require('tree-kill');

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
      // this.process.emit(
      //   IDL_EVENT_LOOKUP.PROMPT_READY,
      //   this.process.capturedOutput
      // );
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

    /** Track last debug send parameters */
    let lastDebugSend: FromIDLMachineNotificationParams<'debugSend'>;

    this.machine.onNotification('debugSend', (params) => {
      lastDebugSend = params;

      /**
       * Only update if we changed
       */
      if (params.stack.changed) {
        this.process.idlInfo = {
          hasInfo: true,
          scope: copy(params.stack.frames)
            .reverse()
            .map((frame) => {
              return {
                file: frame.file,
                line: frame.line,
                routine: frame.name,
              };
            }),
          variables: params.stack.frames[0].variables.map((variable) => {
            return {
              name: variable.name.toLowerCase(),
              type: `${variable.type}`,
              description: variable.value,
            };
          }),
        };
      }
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

    /** Track the last interpreter stopped params */
    let lastStop: FromIDLMachineNotificationParams<'interpreterStopped'>;

    this.machine.onNotification('interpreterStopped', (params) => {
      /**
       * Check to see if we have stopped
       *
       * Line check is for main level programs (having a line of zero)
       */
      // const check = params.line > 0 && !deepEqual(params, lastStop);
      const check =
        params.line > 0 &&
        lastStop !== undefined &&
        !deepEqual(params, lastStop);

      // save the parameters
      lastStop = params;

      // create output parameters
      const res: IDLOutput = {
        idlOutput: this.process.capturedOutput,
      };

      /**
       * See if we need to emit a stop event
       */
      if (lastDebugSend.stack.changed && params.line > 0) {
        res.stopped = {
          reason: 'stop',
          stack: {
            file:
              params.routine.toLowerCase() === '$main$'
                ? '$main$'
                : params.file,
            index: 0,
            line: params.line,
            name: params.routine,
          },
        };
      }

      // emit that IDL is ready
      this.process.emit(IDL_EVENT_LOOKUP.PROMPT_READY, res);
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
      /**
       * Set the size of the terminal, this fixes issues where IDL becomes unresponsize
       * after printing out stop statements with very long filepaths.
       */
      this.machine.sendNotification('setTTYSize', { columns: 2048, lines: 40 });

      this.process.emit(IDL_EVENT_LOOKUP.IDL_STARTED, '');
    });

    /**
     * Handle output from IDL
     */
    this.machine.onNotification('tout', (msg) => {
      const stringified = this.stringifyOutput(msg);
      this.process.capturedOutput += stringified;
      this.process.sendOutput(stringified);

      switch (true) {
        case this.process.capturedOutput.indexOf(
          '% Procedure was compiled while active:'
        ) !== -1:
          this.process.emit(IDL_EVENT_LOOKUP.CONTINUE);
          break;
        case this.process.capturedOutput.indexOf(
          '% You compiled a main program while inside a procedure.  Returning.'
        ) !== -1:
          this.process.emit(IDL_EVENT_LOOKUP.CONTINUE);
          break;
        default:
          break;
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
      return '';
    });

    /**
     * Handle calls to the IDLNotify function
     *
     * IDL syntax: IDLNotify('id', param1, param2)
     */
    this.machine.onRequest('idlNotify', async (params) => {
      // console.log('IDL Notify message', params);

      /**
       * Check for custom handler
       */
      if (params.id in this.machine._customRequestHandlers.idlNotify) {
        try {
          return await this.machine._customRequestHandlers.idlNotify[params.id](
            params
          );
        } catch (err) {
          this.process.log.log({
            type: 'error',
            content: [`Error handling custom IDL Notify request:`, params, err],
          });
          return 0;
        }
      }

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

    this.machine.onRequest('readIOLine', (msg) => {
      return '';
    });

    this.machine.onRequest('readProgramLine', (msg) => {
      return '';
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
   * This method gets called from the IDL Interaction Manager and IDL Process
   * class which manage the queue for IDL doing work.
   */
  async evaluate(command: string): Promise<IDLOutput> {
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
      this.process.once(IDL_EVENT_LOOKUP.PROMPT_READY, async (idlOutput) => {
        resolve(idlOutput);
      });

      // run it!
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
   * Add a custom handler for IDL Notify
   */
  registerIDLNotifyHandler(
    idlNotifyEvent: string,
    handler: FromIDLMachineRequestHandler<'idlNotify'>
  ) {
    this.machine.registerIDLNotifyHandler(idlNotifyEvent, handler);
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
    this.machine.registerRequestHandler(event, handler);
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
