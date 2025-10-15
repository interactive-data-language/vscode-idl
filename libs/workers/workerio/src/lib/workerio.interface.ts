import { CancellationToken } from '@idl/cancellation-tokens';

import { PayloadFromWorkerBaseMessage } from './messages/workerio.payloads.interface';

export interface IMessagePromise {
  reject: (data: any) => void;
  resolve: (data: any) => void;
  timeout: any | undefined;
}

/**
 * Base message for inbound and outbound communication
 */
interface IBaseMessage {
  /** ID of the message we are sending or receiving */
  _id: string;
}

/**
 * Message a user send through the worker pool to a worker
 */
export interface IMessageToWorker<_Message extends string> {
  /**
   * A reference to a shared array buffer that holds our
   * cancellation flag
   */
  cancel: SharedArrayBuffer;
  /**
   * Flag saying that we don't expect a response and that we are
   * simply sending a one-way message
   */
  noResponse?: boolean;
  /**
   * Associated payload for our message
   */
  payload: any;
  /**
   * Transfer ownership of vars to worker thread
   */
  transfer?: boolean;
  /**
   * Type of message that is coming back
   */
  type: _Message;
}

/**
 * Message we send to a worker internally
 */
export interface ISentMessageToWorker<_Message extends string>
  extends IBaseMessage,
    IMessageToWorker<_Message> {}

/**
 * Message we get back from a worker
 */
export interface IMessageFromWorker<_Message extends string>
  extends IBaseMessage {
  /**
   * Associated payload for our message
   */
  payload: any;
  /**
   * Type of message that is coming back
   */
  type: _Message;
}

/**
 * Response when we are waiting for a message
 */
export interface IPostAndReceiveMessageResult<_Message extends string> {
  /**
   * Response from the server
   */
  response: Promise<PayloadFromWorkerBaseMessage<_Message>>;
  /**
   * Cancellation token
   */
  token: CancellationToken;
}
