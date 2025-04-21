import { IDL_EVENT_LOOKUP } from '@idl/types/idl/idl-process';
import {
  FROM_IDL_WEB_SOCKET_MESSAGE_LOOKUP,
  FromIDLWebSocketMessage,
  FromIDLWebSocketMessage_IDLEvent,
  FromIDLWebSocketMessageTypes,
  IDL_WS_MESSAGE,
  ToIDLWebSocketMessage,
  ToIDLWebSocketMessageTypes,
  ToIDLWebSocketPayload,
} from '@idl/types/idl/ws-client';
import { io, Socket } from 'socket.io-client';

import { IDLProcess } from '../idl-process.class';

/**
 * CLient to IDL web socket server
 */
export class IDLWebSocketClient {
  /** Parent IDL Process class */
  process: IDLProcess;

  /** Socket client connection */
  socket: Socket;

  constructor(process: IDLProcess, url: string) {
    this.process = process;

    /**
     * Create socket connection
     */
    this.socket = io(url, { autoConnect: false });
  }

  /**
   * Listen to events on our connection
   */
  listen() {
    this.socket.on('connect', () => {
      console.log('IDL WS Client connected');
    });

    // handle disconnects
    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected from socket because: ${reason}`);
      this.process.emit(IDL_EVENT_LOOKUP.LOST_CONNECTION, reason);
    });

    this.socket.on(
      IDL_WS_MESSAGE,
      (msg: FromIDLWebSocketMessage<FromIDLWebSocketMessageTypes>) => {
        switch (msg.type) {
          /**
           * Re-emit the event to our parent class
           */
          case FROM_IDL_WEB_SOCKET_MESSAGE_LOOKUP.IDL_EVENT: {
            /** Typed event */
            const payload = (
              msg as FromIDLWebSocketMessage<FromIDLWebSocketMessage_IDLEvent>
            ).payload;

            // debug information
            // console.log(`Event from websocket`, payload);

            this.process.emit(payload.type, ...payload.args);
            break;
          }

          // unhandled, do nothing
          default:
            break;
        }
      }
    );

    // connect
    console.log('Trying to connect');
    this.socket.connect();
  }

  /**
   * Sends a message to the web socket server
   */
  send<T extends ToIDLWebSocketMessageTypes>(
    type: T,
    payload: ToIDLWebSocketPayload<T>
  ) {
    this._emitToServer({
      type,
      payload,
    });
  }

  /**
   * Emits messages to the server - normalizes and enforces type checking
   */
  private _emitToServer<T extends ToIDLWebSocketMessageTypes>(
    message: ToIDLWebSocketMessage<T>
  ) {
    this.socket.emit(IDL_WS_MESSAGE, message);
  }
}
