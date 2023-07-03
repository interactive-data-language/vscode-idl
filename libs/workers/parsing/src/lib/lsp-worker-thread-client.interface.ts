import { IWorkerIOClient } from '@idl/workers/workerio';

import { LSPWorkerThreadMessage } from './lsp-worker-thread.messages.interface';
import {
  LSPMessageHandler,
  PayloadFromLSPWorker,
} from './lsp-worker-thread.payloads.interface';

/**
 * Strictly typed interface for sending and receiving messages from
 * our parent process
 */
export interface ILSPWorkerThreadClient<_Message extends LSPWorkerThreadMessage>
  extends IWorkerIOClient<_Message> {
  postMessage<T extends _Message>(type: T, payload: PayloadFromLSPWorker<T>);

  on<T extends _Message>(
    message: T,
    promiseGenerator: LSPMessageHandler<T>
  ): void;
}
