import { CancellationToken } from '@idl/cancellation-tokens';

import { WorkerIOBaseMessage } from './messages/workerio.messages.interface';
import { WorkerIO } from './workerio.class';

/**
 * Cancellation token for workers that manages sending a cancellation
 * message to a worker if cancelled
 */
export class WorkerIOCancellationToken extends CancellationToken {
  /**
   * The worker to send a cancellation message to
   */
  private io: WorkerIO<WorkerIOBaseMessage>;

  /**
   * The ID of the worker to send a message to
   */
  private workerId: string;

  /**
   * The ID of the message that we cancel
   */
  private messageId: string;

  constructor(io: WorkerIO<string>, workerId: string, messageId: string) {
    super();

    // set properties
    this.io = io;
    this.workerId = workerId;
    this.messageId = messageId;
  }

  /**
   * Cancels our token
   */
  cancel() {
    super.cancel();

    // send message
    this.io.postMessage(this.workerId, 'cancel', { messageId: this.messageId });

    // delete references to clean up
    delete this.io;
  }
}
