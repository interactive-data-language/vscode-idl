/**
 * Data format for a serialized message
 *
 * This allows us to send the raw string content and also pass
 * custom values as they are without serialization (which ruins
 * shared array buffers)
 */
export interface WorkerIOSerializedMessageToWorker {
  /**
   * Stringified message
   */
  msg: string;
  /**
   * Actual shared array buffer to share
   */
  cancel: SharedArrayBuffer;
}
