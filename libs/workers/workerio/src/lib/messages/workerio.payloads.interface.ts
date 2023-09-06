import {
  CancelMessage,
  ErrorMessage,
  WorkerIOBaseMessage,
} from './workerio.messages.interface';

/**
 * What is the response from our worker thread
 */
export type PayloadToWorkerBaseMessage<_Message = WorkerIOBaseMessage> =
  _Message extends CancelMessage ? { messageId: string } : any;

/**
 * What is the response from our worker thread
 */
export type PayloadFromWorkerBaseMessage<_Message = WorkerIOBaseMessage> =
  _Message extends ErrorMessage ? { message: string; err: any } : any;
