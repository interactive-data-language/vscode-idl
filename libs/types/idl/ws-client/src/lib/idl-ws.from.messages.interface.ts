import { IDLEvent, IDLListenerArgs } from '@idl/types/idl/idl-process';

/** Message from our IDL Process that */
export type FromIDLWebSocketMessage_IDLEvent = 'idl-event';

/**
 * Payload for when we have an event from IDL
 */
export type FromIDLWebSocketPayload_IDLEvent<T extends IDLEvent> = {
  /** Type of event from IDL */
  type: T;
  /** Arguments from event */
  args: IDLListenerArgs<T>;
};

/**
 * Messages from our websocket connection to IDL
 */
export type FromIDLWebSocketMessageTypes = FromIDLWebSocketMessage_IDLEvent;

/**
 * Payloads by message type
 */
export type FromIDLWebSocketPayload<T extends FromIDLWebSocketMessageTypes> =
  T extends FromIDLWebSocketMessage_IDLEvent
    ? FromIDLWebSocketPayload_IDLEvent<IDLEvent>
    : never;

/**
 * Messages from the IDL Web Socket connection
 */
export type FromIDLWebSocketMessage<T extends FromIDLWebSocketMessageTypes> = {
  /** Type of message */
  type: T;
  /** Payload for the message */
  payload: FromIDLWebSocketPayload<T>;
};

interface IFromIDLWebSocketMessageLookup {
  /**
   * Event from the IDL process to send via web socket connection
   */
  IDL_EVENT: FromIDLWebSocketMessage_IDLEvent;
}

/**
 * Lookup of message types we get from IDL via web socket
 */
export const FROM_IDL_WEB_SOCKET_MESSAGE_LOOKUP: IFromIDLWebSocketMessageLookup =
  {
    IDL_EVENT: 'idl-event',
  };
