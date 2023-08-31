import { CANCELLATION_MESSAGE } from './cancellation-token.interface';

/**
 * Base class for cancellation tokens
 */
export class CancellationToken {
  /**
   * Track if we have been cancelled or not
   */
  private cancelled: boolean;

  /**
   * Sets the cancel flag for our token
   */
  cancel() {
    this.cancelled = true;
  }

  /**
   * Returns a flag if we are cancelled
   */
  cancelRequested() {
    return this.cancelled;
  }

  /**
   * Checks for cancellation and, if cancelled, throws an error to halt execution
   */
  throwIfCancelled() {
    if (this.cancelled) {
      throw new Error(CANCELLATION_MESSAGE);
    }
  }
}
