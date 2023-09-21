import { GetCancellationTokenSharedArraybuffer } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { nanoid } from 'nanoid';
import { Worker } from 'worker_threads';

import { PayloadToWorkerBaseMessage } from './messages/workerio.payloads.interface';
import { WorkerIO } from './workerio.class';
import {
  IMessageToWorker,
  IPostAndReceiveMessageResult,
} from './workerio.interface';
import { IWorkerIOPool } from './workerio-pool.class.interface';
import { IPostMessageOptions } from './workerio-pool.interface';

/**
 * Class that manages pools of the same worker thread that have the same
 * messages that they respond to. This way you can farm out work to different
 * threads and share the load
 */
export class WorkerIOPool<_Message extends string>
  implements IWorkerIOPool<_Message>
{
  /** IDs of the workers we have created */
  private ids: string[] = [];

  /** Reference to our WorkerIO class that does the work of talking to our worker threads */
  workerio: WorkerIO<_Message>;

  /**
   * Logger for logging messages
   *
   * Stored, but only used in our child worker
   */
  private log: LogManager;

  constructor(log: LogManager, workers: Worker[], errorAlert?: string) {
    this.log = log;
    this.workerio = new WorkerIO(log, errorAlert);

    // make some workers!
    for (let i = 0; i < workers.length; i++) {
      const id = nanoid();
      this.ids.push(id);
      this.workerio.addWorker(id, workers[i]);
    }
  }

  /**
   * Returns a copy of our work IDs
   */
  getIDs() {
    return this.ids.slice();
  }

  /**
   * Updates the logger that we use
   */
  setLog(newLog: LogManager) {
    this.log = newLog;
    this.workerio.setLog(newLog);
  }

  /**
   * Clean up threads that we create
   */
  destroy() {
    for (let i = 0; i < this.ids.length; i++) {
      this.workerio.removeWorker(this.ids[i]);
    }
  }

  /**
   * Send a message to our worker and wait for a response
   */
  postAndReceiveMessage<T extends _Message>(
    type: T,
    payload: PayloadToWorkerBaseMessage<T>,
    options?: IPostMessageOptions
  ): IPostAndReceiveMessageResult<T> {
    // get the next ID and shift our array
    let next = this.ids.shift() as string;
    this.ids.push(next);

    // if we have a callback to handle worker IDs, call it
    if (options?.id !== undefined) {
      next = options.id(next);
    }

    // submit for processing and return our promise
    return this.workerio.postAndReceiveMessage(
      next,
      type,
      payload,
      options?.timeout
    );
  }

  /**
   * Sends message to all worker threads
   */
  postToAll<T extends _Message>(
    type: T,
    payload: PayloadToWorkerBaseMessage<T>
  ): void {
    // make the message we are sending to errybody
    const msg: IMessageToWorker<T> = {
      type,
      payload,
      noResponse: true,
      cancel: GetCancellationTokenSharedArraybuffer(),
    };

    // prepare payload so we only have to do this once
    const prepared = this.workerio.prepareMessage(
      Object.assign(msg, { _id: nanoid() })
    );

    for (let i = 0; i < this.ids.length; i++) {
      this.workerio.postMessageRaw(this.ids[i], prepared);
    }
  }

  /**
   * Subscribe to all messages with the same ID from any worker
   */
  subscribeToGlobalMessages<T extends _Message>(messageId: T) {
    return this.workerio.subscribeToGlobalMessages(messageId);
  }
}
