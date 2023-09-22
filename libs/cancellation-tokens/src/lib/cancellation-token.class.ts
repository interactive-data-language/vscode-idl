import { CANCELLATION_MESSAGE } from './cancellation-token.interface';

/**
 * Helper function to get shared array buffer for cancellation token so
 * that it can have the right number of bytes
 */
export function GetCancellationTokenSharedArraybuffer() {
  return new SharedArrayBuffer(4);
}

/**
 * Base class for cancellation tokens
 */
export class CancellationToken {
  /**
   * A reference to the shared array buffer
   */
  buffer: SharedArrayBuffer;

  /**
   * Typed array from our shared buffer
   *
   * Int32 so we can use atomics
   */
  typed: Int32Array;

  constructor(buff?: SharedArrayBuffer) {
    if (buff !== undefined) {
      this.buffer = buff;
      this.typed = new Int32Array(this.buffer);
    } else {
      this.buffer = GetCancellationTokenSharedArraybuffer();
      this.typed = new Int32Array(this.buffer);
      this.typed[0] = 0;
    }
  }

  /**
   * Sets the cancel flag for our token
   */
  cancel() {
    this.typed[0] = 1;
    Atomics.notify(this.typed, 0);
  }

  /**
   * Returns a flag if we are cancelled
   */
  cancelRequested() {
    return this.typed[0] === 1;
  }

  /**
   * Checks for cancellation and, if cancelled, throws an error to halt execution
   */
  throwIfCancelled() {
    if (this.typed[0] === 1) {
      throw new Error(CANCELLATION_MESSAGE);
    }
  }
}
