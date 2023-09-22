import { ISentMessageToWorker } from './workerio.interface';
import { WorkerIOSerializedMessageToWorker } from './workerio-messages.interface';

/**
 * Serializes a message to the worker
 */
export function WorkerIOSerializeMessageToWorker<T extends string>(
  msg: ISentMessageToWorker<T>
): WorkerIOSerializedMessageToWorker {
  return {
    msg: JSON.stringify(msg),
    cancel: msg.cancel,
  };
}

/**
 * Parses
 */
export function WorkerIOParseMessageToWorker<T extends string>(
  msg: WorkerIOSerializedMessageToWorker
): ISentMessageToWorker<T> {
  /**
   * Parse original message
   */
  const parsed: ISentMessageToWorker<T> = JSON.parse(msg.msg);

  // update props
  parsed.cancel = msg.cancel;

  // return correct message
  return parsed;
}
