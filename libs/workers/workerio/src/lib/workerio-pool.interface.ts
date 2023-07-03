/**
 * Options when we send messages
 */
export interface IPostMessageOptions {
  /**
   * How lone before our message should timeout
   */
  timeout?: number;
  /**
   * Callback to retrieve the ID of the worker that we should use.
   *
   * By default, this passes in the worker ID that we want to use
   */
  id?: (id: string) => string;
}
