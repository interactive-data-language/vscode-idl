/**
 * Data structure for handlers of events coming from the IDL Machine
 */
export interface IRequestHandlers {
  /**
   * Notification messages that we handle
   */
  notifications: { [key: string]: (msg: any) => void | Promise<void> };

  /**
   * Request messages that we handle
   */
  requests: { [key: string]: (msg: any) => void | Promise<any> };
}

/**
 * Track callbacks for when a request sent to the server
 * resolves and returns information
 */
export interface IRequestResolver {
  [key: string]: { resolve: (msg: any) => void; reject: (msg: any) => void };
}
