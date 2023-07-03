export interface IMessagePromise {
  resolve: (data: any) => void;
  reject: (data: any) => void;
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
   * Type of message that is coming back
   */
  type: _Message;
  /**
   * Associated payload for our message
   */
  payload: any;
  /**
   * Flag saying that we don't expect a response and that we are
   * simply sending a one-way message
   */
  noResponse?: boolean;
  /**
   * Transfer ownership of vars to worker thread
   */
  transfer?: boolean;
}

/**
 * Message we send to a worker internally
 */
export interface ISentMessageToWorker<_Message extends string>
  extends IMessageToWorker<_Message>,
    IBaseMessage {}

/**
 * Message we get back from a worker
 */
export interface IMessageFromWorker<_Message extends string>
  extends IBaseMessage {
  /**
   * Type of message that is coming back
   */
  type: _Message;
  /**
   * Associated payload for our message
   */
  payload: any;
}
