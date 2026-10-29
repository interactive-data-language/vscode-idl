import type { IWorkerIOClient } from '@idl/workers/workerio';

import type { LSPWorkerThreadMessage } from './lsp-worker-thread.messages.interface';
import type {
  LSPMessageHandler,
  PayloadFromLSPWorker,
} from './lsp-worker-thread.payloads.interface';

/**
 * Strictly typed interface for sending and receiving messages from
 * our parent process
 */
export interface ILSPWorkerThreadClient<_Message extends LSPWorkerThreadMessage>
  extends IWorkerIOClient<_Message> {
  on<T extends _Message>(
    message: T,
    promiseGenerator: LSPMessageHandler<T>,
  ): void;

  postMessage<T extends _Message>(type: T, payload: PayloadFromLSPWorker<T>);
}
