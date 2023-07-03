import {
  LanguageServerMessage,
  LanguageServerPayload,
  MessageNameNormalizer,
} from '@idl/vscode/events/messages';
import { _Connection } from 'vscode-languageserver/node';

/**
 * Class for sending/receiving messages between the VSCode language server and client
 */
export class VSCodeServerEventManager {
  /** Connection to the language client */
  private connection: _Connection;

  constructor(client: _Connection) {
    this.connection = client;
  }

  /**
   * Send message to the language server
   */
  sendNotification<T extends LanguageServerMessage>(
    message: T,
    payload: LanguageServerPayload<T>
  ) {
    this.connection.sendNotification(MessageNameNormalizer(message), payload);
  }

  /**
   * Respond to messages from the language server
   */
  onNotification<T extends LanguageServerMessage>(
    message: T,
    callback: (payload: LanguageServerPayload<T>) => void
  ) {
    this.connection.onNotification(MessageNameNormalizer(message), callback);
  }
}
