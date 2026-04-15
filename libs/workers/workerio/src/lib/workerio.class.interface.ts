import { Subject } from 'rxjs';
import { Worker } from 'worker_threads';

import { PayloadToWorkerBaseMessage } from './messages/workerio.payloads.interface';
import { IPostAndReceiveMessageResult } from './workerio.interface';

/**
 * Interface for our WorkerIO so that we have something we can
 * correctly type which we do by creating an extension of this
 * that has proper signatures for our messages
 */
export interface IWorkerIO<_Message extends string> {
  /**
   * Clean up our workerIO interface and stop all worker threads
   */
  destroy(): void;

  /**
   * Send a message to our worker and wait for a response
   */
  postAndReceiveMessage<T extends _Message>(
    workerId: string,
    type: T,
    payload: PayloadToWorkerBaseMessage<T>,
    timeout?: number,
  ): IPostAndReceiveMessageResult<T>;

  /**
   * Send a message to our worker, but don't want for a response
   */
  postMessage<T extends _Message>(
    workerId: string,
    type: T,
    payload: PayloadToWorkerBaseMessage<T>,
  ): string;

  /**
   * Subscribe to all messages with the same ID from any worker
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeToGlobalMessages<T extends _Message>(type: T): Subject<any>;

  /**
   * Subscribe to messages from a specific worker
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribeToWorkerMessages<T extends _Message>(
    workerId: string,
    type: T,
  ): Subject<any>;

  /**
   * Stop subscribing to global messages - cleans up internal subscription references
   */
  unsubscribeFromGlobalMessages(type: _Message): void;

  /**
   * Stop subscribing to messages from our workers
   */
  unsubscribeFromWorkerMessages(workerId: string, type: _Message): void;

  /** Worker threads by worker ID */
  workers: { [key: string]: Worker };
}
