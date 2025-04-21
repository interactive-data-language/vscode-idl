import { IStartIDLConfig } from '@idl/types/idl/idl-process';

/** When IDL needs to run something */
export type ToIDLWebSocketMessage_Evaluate = 'evaluate';

/** Command to evaluate */
export type ToIDLWebSocketPayload_Evaluate = {
  /** Command to run */
  command: string;
  /** Are we silent or not */
  silent: boolean;
};

/** When IDL should pause */
export type ToIDLWebSocketMessage_PauseIDL = 'pause-idl';

/** Payload to pause IDL */
export type ToIDLWebSocketPayload_PauseIDL = void;

/** When IDL starts via web socket */
export type ToIDLWebSocketMessage_StartIDL = 'start-idl';

/** Payload to start IDL */
export type ToIDLWebSocketPayload_StartIDL = {
  /** Startup message */
  startupMessage: string;
  /** Startup config */
  config: IStartIDLConfig;
};

/** When IDL should stop */
export type ToIDLWebSocketMessage_StopIDL = 'stop-idl';

/** Payload to stop IDL */
export type ToIDLWebSocketPayload_StopIDL = void;

/**
 * All message types sent via web socket
 */
export type ToIDLWebSocketMessageTypes =
  | ToIDLWebSocketMessage_Evaluate
  | ToIDLWebSocketMessage_PauseIDL
  | ToIDLWebSocketMessage_StartIDL
  | ToIDLWebSocketMessage_StopIDL;

/**
 * Payloads by message type
 */
export type ToIDLWebSocketPayload<T extends ToIDLWebSocketMessageTypes> =
  T extends ToIDLWebSocketMessage_Evaluate
    ? ToIDLWebSocketPayload_Evaluate
    : T extends ToIDLWebSocketMessage_PauseIDL
    ? ToIDLWebSocketPayload_PauseIDL
    : T extends ToIDLWebSocketMessage_StartIDL
    ? ToIDLWebSocketPayload_StartIDL
    : T extends ToIDLWebSocketMessage_StopIDL
    ? ToIDLWebSocketPayload_StopIDL
    : never;

/**
 * Messages from the IDL Web Socket connection
 */
export type ToIDLWebSocketMessage<T extends ToIDLWebSocketMessageTypes> = {
  /** Type of message */
  type: T;
  /** Payload for the message */
  payload: ToIDLWebSocketPayload<T>;
};

interface IToIDLWebSocketMessageLookup {
  /** Run a command in IDL */
  EVALUATE: ToIDLWebSocketMessage_Evaluate;
  /** Interrupt IDL execution */
  PAUSE_IDL: ToIDLWebSocketMessage_PauseIDL;
  /**
   * Event to start IDL
   */
  START_IDL: ToIDLWebSocketMessage_StartIDL;
  /** Stop IDL process */
  STOP_IDL: ToIDLWebSocketMessage_StopIDL;
}

/**
 * Lookup of message types we send to IDL via web socket
 */
export const TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP: IToIDLWebSocketMessageLookup = {
  EVALUATE: 'evaluate',
  PAUSE_IDL: 'pause-idl',
  START_IDL: 'start-idl',
  STOP_IDL: 'stop-idl',
};
