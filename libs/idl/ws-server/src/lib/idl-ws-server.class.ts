import { GetExtensionPath } from '@idl/idl/files';
import { IDLProcess } from '@idl/idl/idl-process';
import { Logger } from '@idl/logger';
import {
  FROM_IDL_WEB_SOCKET_MESSAGE_LOOKUP,
  FromIDLWebSocketMessage,
  FromIDLWebSocketMessageTypes,
  FromIDLWebSocketPayload,
  IDL_WS_MESSAGE,
  TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP,
  ToIDLWebSocketMessage,
  ToIDLWebSocketMessage_Evaluate,
  ToIDLWebSocketMessage_StartIDL,
  ToIDLWebSocketMessageTypes,
} from '@idl/types/idl/ws-client';
import { join } from 'path';
import { Socket } from 'socket.io';

import { IDLTempFolderManager } from './idl-temp-folder-manager';

export class IDlWebSocketServer {
  /** Manage temp folders */
  folderManager = new IDLTempFolderManager();

  /** Logger */
  log: Logger;

  /** IDL process */
  process?: IDLProcess;

  /** Socket connection from server */
  socket: Socket;

  constructor(socket: Socket, log: Logger) {
    this.log = log;
    this.socket = socket;
  }

  /**
   * Cleanup when disconnected
   */
  cleanup() {
    if (this.process) {
      this.process.stop();
    }

    // remove our temp folder
    this.folderManager.removeTempFolder(this.socket);
  }

  /**
   * Listen to events on our connection
   *
   * TODO: Handle errors and async things
   */
  listen() {
    this.socket.on(
      IDL_WS_MESSAGE,
      (msg: ToIDLWebSocketMessage<ToIDLWebSocketMessageTypes>) => {
        switch (msg.type) {
          /**
           * Run a command
           */
          case TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.EVALUATE: {
            /** Typed payload */
            const payload = (
              msg as ToIDLWebSocketMessage<ToIDLWebSocketMessage_Evaluate>
            ).payload;
            if (this.process) {
              this.log.log({
                type: 'info',
                content: [
                  `Run command in IDL for connection ${this.socket.id}`,
                  payload,
                ],
              });
              this.process.silent = payload.silent;
              this.process.evaluate(payload.command);
            }
            break;
          }

          /**
           * Pause the IDL process
           */
          case TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.PAUSE_IDL:
            if (this.process) {
              this.log.log({
                type: 'info',
                content: `Request to pause IDL for connection ${this.socket.id}`,
              });
              this.process.pause();
            }
            break;

          /**
           * Start IDL session
           */
          case TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.START_IDL: {
            this.log.log({
              type: 'info',
              content: `Start IDL session for connection ${this.socket.id}`,
            });

            // stop if already started
            if (this.process) {
              this.process.stop();
            }

            // create a temp folder for our connection
            const temp = this.folderManager.createTempFolder(this.socket);

            /**
             * TODO: Update environment for .idl location and anything else
             * to use this instead of home
             */

            /** Typed payload */
            const payload = (
              msg as ToIDLWebSocketMessage<ToIDLWebSocketMessage_StartIDL>
            ).payload;

            // create process
            this.process = new IDLProcess(
              this.log,
              GetExtensionPath(join('idl', 'vscode')),
              payload.startupMessage
            );

            /**
             * Get original emit handler
             */
            const emitOrig = this.process.emit;

            /**
             * Re-route the emit handler for our process to send the messages
             * via our web socket connection
             *
             * TODO: This might break everything since we use some of these
             * events to listen to and capture things ourselves
             */
            this.process.emit = (...args) => {
              /** Send original emit */
              emitOrig.apply(this.process, args);

              // debug logs
              // console.log({
              //   type: args[0],
              //   args: args.slice(1, args.length),
              // });

              /** Send to socket connection */
              this.send(FROM_IDL_WEB_SOCKET_MESSAGE_LOOKUP.IDL_EVENT, {
                type: args[0],
                args: args.slice(1, args.length),
              });
              return true;
            };

            // start the IDL process
            this.process.start(payload.config);
            break;
          }

          /**
           * Stop the IDL process
           */
          case TO_IDL_WEB_SOCKET_MESSAGE_LOOKUP.STOP_IDL:
            if (this.process) {
              this.log.log({
                type: 'info',
                content: `Stoping IDL session for connection ${this.socket.id}`,
              });
              this.process.stop();
            }
            break;

          // do nothing
          default:
            break;
        }
      }
    );
  }

  /**
   * Sends a message to the web socket client
   */
  send<T extends FromIDLWebSocketMessageTypes>(
    type: T,
    payload: FromIDLWebSocketPayload<T>
  ) {
    this._emit({
      type,
      payload,
    });
  }

  /**
   * Emits messages to the client- normalizes and enforces type checking
   */
  private _emit<T extends FromIDLWebSocketMessageTypes>(
    message: FromIDLWebSocketMessage<T>
  ) {
    this.socket.emit(IDL_WS_MESSAGE, message);
  }
}
