import type { CancellationToken } from '@idl/cancellation-tokens';
import type {
  IPostAndReceiveMessageResult,
  IWorkerIO,
} from '@idl/workers/workerio';
import type { Subject } from 'rxjs';

import type { LSPWorkerThreadMessage } from './lsp-worker-thread.messages.interface';
import type {
  PayloadFromLSPWorker,
  PayloadToLSPWorker,
} from './lsp-worker-thread.payloads.interface';

/**
 * Response when we are waiting for a message
 */
export interface ILSPWorkerWorkerIOPostAndReceiveMessageResult<
  _Message extends LSPWorkerThreadMessage,
> extends IPostAndReceiveMessageResult<_Message> {
  /**
   * Response from the server
   */
  response: Promise<PayloadFromLSPWorker<_Message>>;
}

/**
 * Interface for our WorkerIO so that we have something we can
 * correctly type which we do by creating an extension of this
 * that has proper signatures for our messages
 */
export interface ILSPWorkerWorkerIO<_Message extends LSPWorkerThreadMessage>
  extends IWorkerIO<_Message> {
  /**
   * Send a message to our worker and wait for a response
   */
  postAndReceiveMessage<T extends _Message>(
    workerId: string,
    type: T,
    payload: PayloadToLSPWorker<T>,
    timeout?: number,
    cancel?: CancellationToken,
  ): ILSPWorkerWorkerIOPostAndReceiveMessageResult<T>;

  /**
   * Send a message to our worker, but don't want for a response
   */
  postMessage<T extends _Message>(
    workerId: string,
    type: T,
    payload: PayloadToLSPWorker<T>,
  ): string;

  /**
   * Subscribe to all messages with the same ID from any worker
   */
  subscribeToGlobalMessages<T extends _Message>(
    type: T,
  ): Subject<PayloadFromLSPWorker<T>>;

  /**
   * Subscribe to messages from a specific worker
   */
  subscribeToWorkerMessages<T extends _Message>(
    workerId: string,
    type: T,
  ): Subject<PayloadFromLSPWorker<T>>;
}
