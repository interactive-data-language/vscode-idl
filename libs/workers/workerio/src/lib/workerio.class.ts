import { CancellationToken } from '@idl/cancellation-tokens';
import { IDL_WORKER_THREAD_CONSOLE, LogManager } from '@idl/logger';
import { nanoid } from 'nanoid';
import { Subject } from 'rxjs';
import { Worker } from 'worker_threads';

import {
  PayloadFromWorkerBaseMessage,
  PayloadToWorkerBaseMessage,
} from './messages/workerio.payloads.interface';
import { IWorkerIO } from './workerio.class.interface';
import {
  IMessageFromWorker,
  IMessagePromise,
  IMessageToWorker,
  IPostAndReceiveMessageResult,
} from './workerio.interface';
import { WorkerIOSerializeMessageToWorker } from './workerio-message';
import { WorkerIOSerializedMessageToWorker } from './workerio-messages.interface';

/**
 * Object class that manages sending and receiving messages from worker threads in a
 * centralized location.
 */
export class WorkerIO<_Message extends string> implements IWorkerIO<_Message> {
  /** Worker threads by worker ID */
  workers: { [key: string]: Worker } = {};

  /** Promises for messages by ID (i.e. waiting for a response) */
  private messages: { [key: string]: IMessagePromise } = {};

  /** Message subscriptions we have created. Keep references to clean up */
  private subscriptions: {
    [key: string]: {
      [key: string]: Subject<PayloadFromWorkerBaseMessage<_Message>>;
    };
  } = {};

  /** Message subscriptions we have created. Keep references to clean up */
  private globalSubscriptions: {
    [key: string]: Subject<PayloadFromWorkerBaseMessage<_Message>>;
  } = {};

  /**
   * Class for logging nicely formatted text to the console and/or files
   */
  private log: LogManager;

  /**
   * If we have an error, message that we use as an alert when we send to parent process
   */
  private errorAlert: string;

  constructor(log: LogManager, errorAlert?: string) {
    this.log = log;
    this.errorAlert = errorAlert;
  }

  /**
   * Updates the logger that we use
   */
  setLog(newLog: LogManager) {
    this.log = newLog;
  }

  /**
   * Removes a message timeout from a message
   */
  private _removeTimeout(message: IMessagePromise) {
    if (message.timeout !== undefined) {
      clearTimeout(message.timeout);
    }
  }

  /**
   * When we receive a message handle it accordingly
   */
  private _handleMessage(
    workerId: string,
    incoming: IMessageFromWorker<_Message>
  ) {
    // gab some message properties
    const messageType = incoming.type;
    const messageId = incoming._id;

    // handle our incoming message
    switch (messageType) {
      case 'unhandled-error':
        this.log.log({
          log: IDL_WORKER_THREAD_CONSOLE,
          type: 'error',
          content: [
            `Unhandled error message from Worker ID "${workerId}" with message ID "${messageType}"`,
            incoming.payload,
          ],
          alert: this.errorAlert,
        });

        // check if we have a promise to resolve and clean up
        if (messageId in this.messages) {
          this._removeTimeout(this.messages[messageId]);
          this.messages[messageId].reject(incoming.payload);
          delete this.messages[messageId];
        }
        break;
      case 'error':
        this.log.log({
          log: IDL_WORKER_THREAD_CONSOLE,
          type: 'error',
          content: [
            `Error message from Worker ID "${workerId}" with message ID "${messageType}"`,
            incoming.payload,
          ],
        });

        // check if we have a promise to resolve and clean up
        if (messageId in this.messages) {
          this._removeTimeout(this.messages[messageId]);
          this.messages[messageId].reject(incoming.payload);
          delete this.messages[messageId];
        }
        break;
      case 'log':
        this.log.log({
          log: IDL_WORKER_THREAD_CONSOLE,
          type: 'info',
          // content: [
          //   `Message from Worker Thread "${workerId}": `,
          //   incoming.payload,
          // ],
          content: incoming.payload,
        });
        break;
      default:
        // check if we have a global subscription
        if (messageType in this.globalSubscriptions) {
          this.globalSubscriptions[messageType].next(incoming.payload);
        }

        // check if we have a worker subscription
        if (workerId in this.subscriptions) {
          if (messageType in this.subscriptions[workerId]) {
            this.subscriptions[workerId][messageType].next(incoming.payload);
          }
        }

        // check if we have a promise to resolve and clean up
        if (messageId in this.messages) {
          this._removeTimeout(this.messages[messageId]);
          this.messages[messageId].resolve(incoming.payload);
          delete this.messages[messageId];
        }

        break;
    }
  }

  /**
   * Prepares a message to be sent to a worker
   */
  prepareMessage(msg: IMessageToWorker<_Message>, id?: string) {
    // make an id if it doesnt exist
    if (id === undefined) {
      id = nanoid();
    }

    // send our message
    return WorkerIOSerializeMessageToWorker(Object.assign(msg, { _id: id }));
  }

  /**
   * Helper method that posts raw messages to reduce serialization and synchronization overhead
   *
   * Message should be the output from `prepareMessage()` above
   */
  postMessageRaw(workerId: string, msg: WorkerIOSerializedMessageToWorker) {
    // send our message
    this.workers[workerId].postMessage(msg);
  }

  /**
   * Internal method to actually send the correctly formatted message to our worker
   *
   * We stringify our message prior to sending which significantly increases throughput
   * instead of sending native objects
   */
  private _postMessage(
    workerId: string,
    msg: IMessageToWorker<_Message>,
    id?: string
  ) {
    // send our message
    this.workers[workerId].postMessage(this.prepareMessage(msg, id));

    // return the ID in case someone wants to track it?
    return id;
  }

  /**
   * Adds a worker to our pool based on a specified ID and the created worker
   */
  addWorker(id: string, worker: Worker) {
    if (id in this.workers) {
      return;
    }

    // listen to events
    // worker.on('message', (incoming: IMessageFromWorker<_Message>) => {
    //   this._handleMessage(id, incoming);
    // });
    worker.on('message', (incoming: string) => {
      this._handleMessage(id, JSON.parse(incoming));
    });

    // listen for errors
    worker.on('error', (err) => {
      this.log.log({
        log: IDL_WORKER_THREAD_CONSOLE,
        type: 'error',
        content: [`Exception from worker thread "${id}"`, err],
      });
    });

    // listen for errors
    worker.on('messageerror', (err) => {
      this.log.log({
        log: IDL_WORKER_THREAD_CONSOLE,
        type: 'error',
        content: [`Message error from worker thread "${id}"`, err],
      });
    });

    // listen for the workers exiting
    worker.on('exit', (code) => {
      if (code !== 0) {
        throw new Error(`Worker "${id}" stopped with exit code ${code}`);
      }
    });

    // save worker
    this.workers[id] = worker;
  }

  /**
   * Remove a worker from our pool
   */
  removeWorker(workerId: string): boolean {
    const found = workerId in this.workers;
    if (found) {
      // stop listening to events, otherwise we get an error message
      // about the worker being shutdown
      this.workers[workerId].removeAllListeners();

      // stop the worker and listen for errors stopping the worker
      this.workers[workerId]
        .terminate()
        .then(
          () => {
            // do nothing
          },
          (err) => {
            this.log.log({
              log: IDL_WORKER_THREAD_CONSOLE,
              type: 'error',
              content: [
                `Problem trying to terminate worker "${workerId}"`,
                err,
              ],
            });
          }
        )
        .catch((err) => {
          this.log.log({
            log: IDL_WORKER_THREAD_CONSOLE,
            type: 'error',
            content: [
              `Unhandled problem trying to terminate worker "${workerId}"`,
              err,
            ],
          });
        });

      // remove reference to worker
      delete this.workers[workerId];
    }
    return found;
  }

  /**
   * Send a message to our worker, but don't want for a response
   */
  postMessage<T extends _Message>(
    workerId: string,
    type: T,
    payload: PayloadToWorkerBaseMessage<T>
  ): string {
    if (!(workerId in this.workers)) {
      throw new Error(
        `Attempted to send message to worker "${workerId}", but it does not exist`
      );
    }

    /**
     * Create cancellation token
     */
    const cancel = new CancellationToken();

    const msg: IMessageToWorker<_Message> = {
      type,
      payload,
      cancel: cancel.buffer,
    };

    // set that we are not asking for a response
    msg.noResponse = true;

    // send the message
    return this._postMessage(workerId, msg);
  }

  /**
   * Send a message to our worker and wait for a response
   */
  postAndReceiveMessage<T extends _Message>(
    workerId: string,
    type: T,
    payload: PayloadToWorkerBaseMessage<T>,
    timeout?: number
  ): IPostAndReceiveMessageResult<T> {
    // make sure we have an ID to send a message to
    if (!(workerId in this.workers)) {
      throw new Error(
        `Attempted to send message to worker "${workerId}", but it does not exist`
      );
    }

    /**
     * Create cancellation token
     */
    const cancel = new CancellationToken();

    // make message we send to the worker
    const msg: IMessageToWorker<_Message> = {
      type,
      payload,
      cancel: cancel.buffer,
    };

    // make a unique ID for tracking the return message
    const idReturn = nanoid();

    // make our new promise
    const response = new Promise<PayloadFromWorkerBaseMessage<T>>(
      (resolve, reject) => {
        // save our callback information
        this.messages[idReturn] = {
          resolve: resolve,
          reject: reject,
          timeout:
            timeout !== undefined
              ? setTimeout(() => reject('Request exceeded timeout'), timeout)
              : undefined,
        };

        // send our message
        this._postMessage(workerId, msg, idReturn);
      }
    );

    return { token: cancel, response };
  }

  /**
   * Subscribe to all messages with the same ID from any worker
   */
  subscribeToGlobalMessages<T extends _Message>(
    messageId: T
  ): Subject<PayloadFromWorkerBaseMessage<T>> {
    // check for our worker
    if (messageId in this.globalSubscriptions) {
      throw new Error(
        `Attempted to subscribe to all messages with ID "${messageId}" data, but a subscription already exists`
      );
    }

    // create our subject if needed
    if (messageId in this.globalSubscriptions) {
      return this.globalSubscriptions[messageId];
    } else {
      const subject = new Subject<any>();
      this.globalSubscriptions[messageId] = subject;
      return subject;
    }
  }

  /**
   * Stop subscribing to global messages - cleans up internal subscription references
   */
  unsubscribeFromGlobalMessages(messageId: _Message): void {
    // check for our worker
    if (!(messageId in this.globalSubscriptions)) {
      throw new Error(
        `Attempted to subscribe to all messages with ID "${messageId}" data, but a subscription already exists`
      );
    }

    // clean up
    this.globalSubscriptions[messageId].complete();
    delete this.globalSubscriptions[messageId];
  }

  /**
   * Subscribe to messages from a specific worker
   */
  subscribeToWorkerMessages<T extends _Message>(
    workerId: string,
    messageId: T
  ): Subject<PayloadFromWorkerBaseMessage<T>> {
    // check for our worker
    if (!(workerId in this.workers)) {
      throw new Error(
        `Attempted to subscribe to worker "${workerId}" data, but it does not exist`
      );
    }
    if (!(workerId in this.subscriptions)) {
      this.subscriptions[workerId] = {};
    }

    // check if we have an existing subscription to return or if we need to create a new one
    if (messageId in this.subscriptions[workerId]) {
      return this.subscriptions[workerId][messageId];
    } else {
      const subject = new Subject<any>();
      this.subscriptions[workerId][messageId] = subject;
      return subject;
    }
  }

  /**
   * Stop subscribing to messages from our workers
   */
  unsubscribeFromWorkerMessages(workerId: string, messageId: _Message): void {
    // check for our worker
    if (!(workerId in this.workers)) {
      return;
    }
    if (!(workerId in this.subscriptions)) {
      return;
    }
    if (!(messageId in this.subscriptions[workerId])) {
      return;
    } else {
      this.subscriptions[workerId][messageId].complete();
      delete this.subscriptions[workerId][messageId];
    }
  }

  /**
   * Clean up our workerIO interface and stop all worker threads
   */
  destroy() {
    const ids = Object.keys(this.workers);
    for (let i = 0; i < ids.length; i++) {
      this.removeWorker(ids[i]);
    }
    (this.workers as any) = undefined;

    // clean up messages
    let keys = Object.keys(this.messages);
    for (let i = 0; i < keys.length; i++) {
      delete this.messages[keys[i]];
    }

    // clean up our data subscriptions - keys = workerIds
    keys = Object.keys(this.subscriptions);
    for (let i = 0; i < keys.length; i++) {
      // clean up subscriptions for each worker
      const workerKeys = Object.keys(this.subscriptions[keys[i]]);
      for (let j = 0; j < workerKeys.length; j++) {
        this.subscriptions[keys[i]][workerKeys[j]].complete();
      }
      delete this.subscriptions[keys[i]];
    }

    // clean up our global subscriptions
    keys = Object.keys(this.globalSubscriptions);
    for (let i = 0; i < keys.length; i++) {
      this.globalSubscriptions[keys[i]].complete();
      delete this.globalSubscriptions[keys[i]];
    }
  }
}
