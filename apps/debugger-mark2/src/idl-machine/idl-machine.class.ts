import { ObjectifyError } from '@idl/error-shared';
import { ChildProcess } from 'child_process';

import {
  FromIDLMachineNotificationParams,
  FromIDLMachineNotifications,
} from './from-machine/from-machine.notifications.interface';
import {
  FromIDLMachineRequestParams,
  FromIDLMachineRequestResponse,
  FromIDLMachineRequests,
} from './from-machine/from-machine.requests.interface';
import { IRequestHandlers, IRequestResolver } from './idl-machine.interface';
import {
  JSONRPCNotification,
  JSONRPCRequest,
  JSONRPCResponse,
} from './json-rpc.interface';
import { OutputQueue } from './output-queue';
import {
  ToIDLMachineNotificationParams,
  ToIDLMachineNotifications,
} from './to-machine/to-machine.notifications.interface';
import {
  ToIDLMachineRequestParams,
  ToIDLMachineRequestResponse,
  ToIDLMachineRequests,
} from './to-machine/to-machine.requests.interface';

/**
 * Class to talk to the IDL machine
 */
export class IDLMachine {
  /**
   * Handlers for events from servers
   */
  private handlers: IRequestHandlers = {
    notifications: {},
    requests: {},
  };

  /** Message IDs */
  id = 1;

  /** IDL process */
  private idl: ChildProcess;

  /**
   * Callbacks for promises
   */
  private resolvers: IRequestResolver = {};

  /**
   * Message handler from the IDL Machine
   */
  private _onMessage = async (msg: string) => {
    let parsed: any;

    try {
      /** Parse */
      parsed = JSON.parse(msg);
    } catch (err) {
      console.log(`Error while parsing message from server`);
      console.log(err);
      console.log(msg);
      return;
    }

    switch (true) {
      /**
       * Response from IDL Machine with an error
       */
      case (parsed as JSONRPCResponse).error !== undefined:
        if ((parsed as JSONRPCResponse).id in this.resolvers) {
          this.resolvers[(parsed as JSONRPCResponse).id].reject(
            (parsed as JSONRPCResponse).error
          );
        }
        break;

      /**
       * Response from IDL Machine with a result
       */
      case (parsed as JSONRPCResponse).result !== undefined:
        if ((parsed as JSONRPCResponse).id in this.resolvers) {
          this.resolvers[(parsed as JSONRPCResponse).id].resolve(
            (parsed as JSONRPCResponse).result
          );
        }
        break;

      /**
       * Request from the IDL Machine
       *
       * TODO
       */
      case (parsed as JSONRPCRequest).id !== undefined:
        /**
         * Check for handler
         */
        if ((parsed as JSONRPCRequest).method in this.handlers.requests) {
          try {
            /**
             * Get what we send back
             */
            const result = await this.handlers.requests[
              (parsed as JSONRPCRequest).method
            ]((parsed as JSONRPCRequest).params);

            // send message
            this._writeResponse((parsed as JSONRPCRequest).id, result);
          } catch (err) {
            console.log(`Error responding to request`, err);
            const resp: JSONRPCResponse = {
              jsonrpc: '2.0',
              id: (parsed as JSONRPCRequest).id,
              error: {
                code: -32000,
                message: JSON.stringify(ObjectifyError(err)),
              },
            };
            this.idl.stdin.write(JSON.stringify(resp));
          }
        } else {
          console.log(`Unhandled request from IDL machine`, parsed);
          /**
           * Alert if we have no handler to send a response back
           */
          const resp: JSONRPCResponse = {
            jsonrpc: '2.0',
            id: (parsed as JSONRPCRequest).id,
            error: {
              code: -32601,
              message: 'Unhandled method',
            },
          };
          this.idl.stdin.write(JSON.stringify(resp));
        }
        break;

      /**
       * Notification from the IDL Machine
       */
      default:
        if (
          (parsed as JSONRPCNotification).method in this.handlers.notifications
        ) {
          try {
            await this.handlers.notifications[
              (parsed as JSONRPCNotification).method
            ]((parsed as JSONRPCNotification).params);
          } catch (err) {
            console.log(`Error responding to notification`, err);
          }
        }
        break;
    }
  };

  /**
   * Create queue to handle output from IDL
   *
   * Makes sure we process one message/chunk at a time and
   * dont try to parse/process everything
   */
  private _queue = new OutputQueue(this._onMessage);

  constructor(idl: ChildProcess) {
    this.idl = idl;

    // handle output from IDL
    idl.stdout.on('data', (data: Buffer) => {
      this._queue.handleOutput(data.toString());
    });
  }

  /**
   * Listen and respond to requests from the IDL Machine
   */
  onRequest<T extends FromIDLMachineRequests>(
    request: T,
    cb: (
      params: FromIDLMachineRequestParams<T>
    ) => Promise<FromIDLMachineRequestResponse<T>>
  ) {
    this.handlers.requests[request] = cb;
  }

  /**
   * Listen for notifications from the IDL Machine
   */
  onNotification<T extends FromIDLMachineNotifications>(
    notification: T,
    cb: (params: FromIDLMachineNotificationParams<T>) => void | Promise<void>
  ) {
    this.handlers.notifications[notification] = cb;
  }

  /**
   * Send a request to the IDL Machine
   */
  async sendRequest<T extends ToIDLMachineRequests>(
    request: T,
    params: ToIDLMachineRequestParams<T>
  ): Promise<ToIDLMachineRequestResponse<T>> {
    return new Promise((resolve, reject) => {
      /**
       * Get ID for this message
       */
      const id = this.id++;

      // save our promise resolvers
      this.resolvers[id] = { resolve, reject };

      // send request
      this._writeRequest(this.id++, request, params);
    });
  }

  /**
   * Writes a JSON RPC notification message
   */
  private _writeRequest(id: number, method: string, params: any) {
    this.idl.stdin.write(
      JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params,
      })
    );
  }

  /**
   * Writes out a JSON RPC response to the IDL Machine
   */
  private _writeResponse(id: number, result: any) {
    this.idl.stdin.write(
      JSON.stringify({
        jsonrpc: '2.0',
        id,
        result,
      })
    );
  }

  /**
   * Send a notification to the IDL Machine
   */
  async sendNotification<T extends ToIDLMachineNotifications>(
    notification: T,
    params: ToIDLMachineNotificationParams<T>
  ) {
    this._writeNotification(notification, params);
  }

  /**
   * Writes a JSON RPC notification message
   */
  private _writeNotification(method: string, params: any) {
    this.idl.stdin.write(
      JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
      })
    );
  }
}
