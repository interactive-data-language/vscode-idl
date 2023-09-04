import { IPostMessageOptions, IWorkerIOPool } from '@idl/workers/workerio';
import { Subject } from 'rxjs';

import { LSPWorkerThreadMessage } from './lsp-worker-thread.messages.interface';
import {
  PayloadFromLSPWorker,
  PayloadToLSPWorker,
} from './lsp-worker-thread.payloads.interface';
import {
  ILSPWorkerWorkerIO,
  ILSPWorkerWorkerIOPostAndReceiveMessageResult,
} from './lsp-workerio.interface';

/**
 * Strictly typed interface for sending and receiving messages to a pool of
 * child processes
 */
export interface ILSPWorkerThreadPool<_Message extends LSPWorkerThreadMessage>
  extends IWorkerIOPool<_Message> {
  /** Reference to our WorkerIO class that does the work of talking to our worker threads */
  workerio: ILSPWorkerWorkerIO<_Message>;

  /**
   * Send a message to our worker and wait for a response
   */
  postAndReceiveMessage<T extends _Message>(
    type: T,
    payload: PayloadToLSPWorker<T>,
    options?: IPostMessageOptions
  ): ILSPWorkerWorkerIOPostAndReceiveMessageResult<T>;

  /**
   * Sends message to all worker threads
   */
  postToAll<T extends _Message>(type: T, payload: PayloadToLSPWorker<T>): void;

  /**
   * Subscribe to all messages with the same ID from any worker
   */
  subscribeToGlobalMessages<T extends _Message>(
    type: T
  ): Subject<PayloadFromLSPWorker<T>>;
}
