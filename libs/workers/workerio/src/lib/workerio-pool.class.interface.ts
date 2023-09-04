import { LogManager } from '@idl/logger';
import { Subject } from 'rxjs';

import { PayloadToWorkerBaseMessage } from './messages/workerio.payloads.interface';
import { IWorkerIO } from './workerio.class.interface';
import {
  IMessageFromWorker,
  IPostAndReceiveMessageResult,
} from './workerio.interface';
import { IPostMessageOptions } from './workerio-pool.interface';

/**
 * Interface for our WorkerIOPool so that we have something we can
 * correctly type which we do by creating an extension of this
 * that has proper signatures for our messages
 */
export interface IWorkerIOPool<_Message extends string> {
  /** Reference to our WorkerIO class that does the work of talking to our worker threads */
  workerio: IWorkerIO<_Message>;

  /**
   * Returns a copy of our work IDs
   */
  getIDs(): string[];

  /**
   * Send a message to our worker and wait for a response
   */
  postAndReceiveMessage<T extends _Message>(
    type: T,
    payload: PayloadToWorkerBaseMessage<T>,
    options?: IPostMessageOptions
  ): IPostAndReceiveMessageResult<T>;

  /**
   * Sends message to all worker threads
   */
  postToAll<T extends _Message>(
    type: T,
    payload: PayloadToWorkerBaseMessage<T>
  ): void;

  /**
   * Subscribe to all messages with the same ID from any worker
   */
  subscribeToGlobalMessages<T extends _Message>(
    type: T
  ): Subject<IMessageFromWorker<T>>;

  /**
   * Updates the logger that we use
   */
  setLog(newLog: LogManager): void;

  /**
   * Clean up our workerIO interface and stop all worker threads
   */
  destroy(): void;
}
