import { ChildProcess } from 'child_process';
import * as rpc from 'vscode-jsonrpc/node';

import {
  FromIDLMachineNotificationParams,
  FromIDLMachineNotifications,
} from './from-machine/from-machine.notifications.interface';
import {
  FromIDLMachineRequestParams,
  FromIDLMachineRequestResponse,
  FromIDLMachineRequests,
} from './from-machine/from-machine.requests.interface';
import {
  ToIDLMachineNotificationParams,
  ToIDLMachineNotifications,
} from './to-machine/to-machine.notifications.interface';
import {
  ToIDLMachineRequestParams,
  ToIDLMachineRequests,
} from './to-machine/to-machine.requests.interface';

export class IDLMachine {
  /** IDL process */
  private idl: ChildProcess;

  /** Connection to talk with IDL */
  private connection: rpc.MessageConnection;

  constructor(idl: ChildProcess) {
    // save IDL
    this.idl = idl;

    // make and save connection
    this.connection = rpc.createMessageConnection(
      new rpc.StreamMessageReader(idl.stdout),
      new rpc.StreamMessageWriter(idl.stdin)
    );

    // listen to the connection
    this.connection.listen();

    /**
     * Listen to close events
     */
    this.connection.onClose(() => {
      console.log(`On close`);
    });

    /**
     * Listen to dispose events
     */
    this.connection.onDispose(() => {
      console.log(`On dispose`);
    });

    /**
     * Listen to error events
     */
    this.connection.onError((err) => {
      console.log(`Error`, err);
    });

    /**
     * Listen for unhandled notifications
     */
    this.connection.onUnhandledNotification((ev) => {
      console.log(`Unhandled event`, ev);
    });

    /**
     * Listen for unhandled progress
     */
    this.connection.onUnhandledProgress((ev) => {
      console.log(`Unhandled progress`, ev);
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
    this.connection.onRequest(request, cb);
  }

  /**
   * Listen for notifications from the IDL Machine
   */
  onNotification<T extends FromIDLMachineNotifications>(
    request: T,
    cb: (params: FromIDLMachineNotificationParams<T>) => Promise<void>
  ) {
    this.connection.onNotification(request, cb);
  }

  /**
   * Send a request to the IDL Machine
   */
  async sendRequest<T extends ToIDLMachineRequests>(
    request: T,
    params: ToIDLMachineRequestParams<T>
  ) {
    return this.connection.sendRequest(request, params);
  }

  /**
   * Send a notification to the IDL Machine
   */
  sendNotification<T extends ToIDLMachineNotifications>(
    notification: T,
    params: ToIDLMachineNotificationParams<T>
  ) {
    this.connection.sendNotification(notification, params);
  }
}
