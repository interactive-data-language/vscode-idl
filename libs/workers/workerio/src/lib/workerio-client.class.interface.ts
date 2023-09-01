import { CancellationToken } from '@idl/cancellation-tokens';

import {
  ErrorMessage,
  UnhandledError,
} from './messages/workerio.messages.interface';
import { PayloadFromWorkerBaseMessage } from './messages/workerio.payloads.interface';

/**
 * Interface for our WorkerIOClient so that we have something we can
 * correctly type which we do by creating an extension of this
 * that has proper signatures for our messages
 */
export interface IWorkerIOClient<_Message extends string> {
  /**
   * Subscribe to messages from our parent thread
   */
  on<T extends _Message>(
    message: T,
    promiseGenerator: (arg: any, cancel: CancellationToken) => Promise<any>
  ): void;

  /**
   * Emit an error to our parent if we encounter a problem
   */
  error(
    message: string,
    err: any,
    type: ErrorMessage | UnhandledError,
    _id: string
  ): void;

  /**
   * Send message to parent process
   */
  postMessage<T extends _Message>(
    type: T,
    payload: PayloadFromWorkerBaseMessage<T>
  );

  /**
   * Log something to our parent thread
   */
  log(log: any): void;

  /**
   * Listen for messages from our parent thread. If you don't call this, then
   * nothing will happen!
   */
  listen(): void;
}
