import { CancellationToken } from '@idl/cancellation-tokens';
import { ObjectifyError } from '@idl/logger';
import { SimplePromiseQueue } from '@idl/shared';
import { MessagePort } from 'worker_threads';

import {
  ErrorMessage,
  LogMessage,
  UnhandledError,
} from './messages/workerio.messages.interface';
import { PayloadFromWorkerBaseMessage } from './messages/workerio.payloads.interface';
import { IMessageFromWorker, ISentMessageToWorker } from './workerio.interface';
import { IWorkerIOClient } from './workerio-client.class.interface';
import { WorkerIOParseMessageToWorker } from './workerio-message';

/**
 * Object class that centralizes listening for and responding to messages from
 * parent processes in a worker thread
 */
export class WorkerIOClient<_Message extends string>
  implements IWorkerIOClient<_Message>
{
  /** Message port */
  private port: MessagePort;

  /** Events that we listen to */
  private events: {
    [P in _Message]?: (payload: any, cancel: CancellationToken) => Promise<any>;
  } = {};

  /** Track cancellation tokens for requests */
  private cancels: { [key: string]: CancellationToken } = {};

  /** Promise queue to throttle number of things we do at once */
  private queue: SimplePromiseQueue;

  /**
   * @param port Message port for communication with parent process
   * @param concurrency Number of concurrent messages that we respond to at a time
   */
  constructor(port: MessagePort, concurrency = 1) {
    this.port = port;
    this.queue = new SimplePromiseQueue(concurrency);

    process.on('unhandledRejection', (err) => {
      this.error('unhandledRejection', err);
      process.exit(1);
    });
    process.on('uncaughtException', (err) => {
      this.error('uncaughtException', err);
      process.exit(1);
    });
    process.on('uncaughtExceptionMonitor', (err) => {
      this.error('uncaughtExceptionMonitor', err);
      process.exit(1);
    });
    process.on('SIGTERM', (err) => {
      this.error('SIGTERM', err);
      process.exit(1);
    });
    process.on('SIGINT', (err) => {
      this.error('SIGINT', err);
      process.exit(1);
    });
  }

  /** Subscribe to messages from our parent thread */
  on(
    message: _Message,
    promiseGenerator: (arg: any, cancel: CancellationToken) => Promise<any>
  ) {
    this.events[message] = promiseGenerator;
  }

  /**
   * Emit an error to our parent if we encounter a problem
   */
  error(
    message: string,
    err: any,
    type: ErrorMessage | UnhandledError = 'error',
    _id = 'error'
  ) {
    const outgoing: IMessageFromWorker<ErrorMessage | UnhandledError> = {
      _id,
      type,
      payload: { message, err: ObjectifyError(err) },
    };
    this._postMessage(outgoing as IMessageFromWorker<_Message>);
  }

  /**
   * Log something to our parent thread
   */
  log(logThis: any) {
    const outgoing: IMessageFromWorker<LogMessage> = {
      _id: 'log',
      type: 'log',
      payload: logThis,
    };
    this._postMessage(outgoing as IMessageFromWorker<_Message>);
  }

  /**
   * Cancel message by ID
   */
  cancel(messageId: string) {
    if (messageId in this.cancels) {
      this.cancels[messageId].cancel();
    }
  }

  /**
   * Send message to parent process
   */
  postMessage<T extends _Message>(
    type: T,
    payload: PayloadFromWorkerBaseMessage<T>
  ) {
    const msg: IMessageFromWorker<_Message> = {
      _id: 'out',
      type,
      payload,
    };

    // send the message
    return this._postMessage(msg);
  }

  /**
   * Send a message to our parent thread
   */
  private _postMessage(message: IMessageFromWorker<_Message>) {
    // this.port.postMessage(message);
    this.port.postMessage(JSON.stringify(message));
  }

  /**
   *  Actual message handler, separate scope than even callback
   */
  private async _handleMessage(message: ISentMessageToWorker<_Message>) {
    await this.queue.add(async () => {
      if (message.type in this.events) {
        // console.log('Cancellation', Array.isArray(message.cancel));
        // create a new cancellation token
        const cancel = new CancellationToken(message.cancel);

        // track by our message ID
        this.cancels[message._id] = cancel;

        // handle errors which makes the worker threads, assuming everything goes through here, invincible!
        try {
          // execute our async callback
          const res = await this.events[message.type](message.payload, cancel);

          // check if we need to respond, otherwise we will be silent
          if (!message.noResponse) {
            const outgoing: IMessageFromWorker<_Message> = {
              _id: message._id,
              type: message.type,
              payload: res,
            };
            this._postMessage(outgoing);
          }
        } catch (err: any) {
          this.error(
            `Error while responding to event "${message.type}"`,
            ObjectifyError(err),
            'unhandled-error',
            message._id
          );
        }

        // clean up cancellation
        delete this.cancels[message._id];
      }
    });
  }

  /**
   * Listen for messages from our parent thread. If you don't call this, then
   * nothing will happen!
   */
  listen() {
    // listen to messages from our client
    this.port.on('message', async (message) => {
      /**
       * Messages from workerio.class are all stringified, so we have to parse them all here
       *
       * Doing this dramatically increases performance
       */
      this._handleMessage(WorkerIOParseMessageToWorker(message));
    });

    // listen to close/cleanup events
    this.port.on('close', () => {
      process.exit(0);
    });
  }
}
