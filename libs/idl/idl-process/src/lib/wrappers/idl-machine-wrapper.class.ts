import {
  ExecuteStringFlags,
  FromIDLMachineNotificationParams,
  IDLMachine,
  TOutNotification,
} from '@idl/idl/idl-machine';
import { IDL_EVENT_LOOKUP, IDLEvent, IDLListenerArgs } from '@idl/idl/shared';
import { ChildProcess } from 'child_process';
import * as kill from 'tree-kill';

import { IDLProcess } from '../idl-process.class';

/**
 * Wraps the IDL Machine process and connects events from it to/from our IDL Process class
 */
export class IDLMachineWrapper {
  /**
   * Parent class that handles primary logic that we plug into
   */
  private parent: IDLProcess;

  /** The IDL process */
  private idl: ChildProcess;

  /** The IDL Machine */
  private machine: IDLMachine;

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

  /**
   * Start our debugging session
   */
  listen(idl: ChildProcess) {
    // save IDL prop
    this.idl = idl;
    this.machine = new IDLMachine(idl);

    this.machine.onNotification('serverReady', () => {
      this.parent.started = true;
      this.emit(IDL_EVENT_LOOKUP.IDL_STARTED, 'not implemented');
    });

    this.machine.onNotification('tout', (msg) => {
      const stringified = this.stringifyOutput(msg);
      this.parent.capturedOutput += stringified;
      this.parent.sendOutput(stringified);

      // check for recompile
      if (
        this.parent.capturedOutput.indexOf(
          '% Procedure was compiled while active:'
        ) !== -1
      ) {
        this.emit(IDL_EVENT_LOOKUP.CONTINUE);
      }
      if (
        this.parent.capturedOutput.indexOf(
          '% You compiled a main program while inside a procedure.  Returning.'
        ) !== -1
      ) {
        this.emit(IDL_EVENT_LOOKUP.CONTINUE);
      }
    });

    this.machine.onRequest('idlNotify', (params) => {
      // console.log('IDL Notify message', params);
      return 0;
    });

    this.machine.onNotification('promptChange', (prompt) => {
      this.emit(IDL_EVENT_LOOKUP.PROMPT, prompt);
    });

    this.machine.onNotification('workingDirChange', () => {
      // do nothing
    });

    this.machine.onNotification('pathChange', () => {
      // do nothing
    });

    this.machine.onNotification('debugSend', () => {
      // do nothing
    });

    this.machine.onNotification('commandStarted', () => {
      // console.log('Command started');
    });
    this.machine.onNotification('commandFinished', () => {
      this.emit(IDL_EVENT_LOOKUP.PROMPT_READY, this.parent.capturedOutput);
    });
    this.machine.onNotification('interpreterStopped', (msg) => {
      // console.log(`Interpreter stopped`);
      // console.log(msg);
    });

    this.machine.onNotification('compilerOpenFile', () => {
      // do nothing
    });

    this.machine.onRequest('resetSessionConfirm', () => {
      return true;
    });

    this.machine.onRequest('getKeyboard', () => {
      return 'f';
    });

    this.machine.onRequest('readIOLine', (msg) => {
      // console.log(`read line`);
      // console.log(msg);

      return 'I have been read!';
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
    this.machine.sendNotification('abort', undefined);
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

      /**
       * Get flags with proper type
       */
      const flags: ExecuteStringFlags = this.parent.silent
        ? ((0x1 | 0x2) as ExecuteStringFlags)
        : 0x1;

      this.machine.sendNotification('exec', {
        string: command,
        flags,
      });

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
