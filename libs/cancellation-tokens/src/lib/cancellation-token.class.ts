import { CANCELLATION_MESSAGE } from './cancellation-token.interface';

/**
 * Base class for cancellation tokens
 */
export class CancellationToken {
  /**
   * Track if we have been cancelled or not
   */
  buffer: SharedArrayBuffer;

  constructor(buffer = new SharedArrayBuffer(1)) {
    this.buffer = buffer;
  }

  /**
   * Sets the cancel flag for our token
   */
  cancel() {
    this.buffer[0] = 1;
  }

  /**
   * Returns a flag if we are cancelled
   */
  cancelRequested() {
    return this.buffer[0] === 1;
  }

  /**
   * Checks for cancellation and, if cancelled, throws an error to halt execution
   */
  throwIfCancelled() {
    if (this.buffer[0] === 1) {
      throw new Error(CANCELLATION_MESSAGE);
    }
  }
}
