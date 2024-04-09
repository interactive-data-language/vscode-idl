import { CANCELLATION_MESSAGE } from '@idl/cancellation-tokens';
import {
  LanguageServerMessage,
  LanguageServerPayload,
  LanguageServerResponse,
  MessageNameNormalizer,
  SerializeServerMessage,
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
   * Helper that checks to see if we can send a message or not
   */
  private canSendNotification(asString: string) {
    return !asString.includes(CANCELLATION_MESSAGE);
  }

  /**
   * Send message to the VSCode Client
   */
  sendNotification<T extends LanguageServerMessage>(
    message: T,
    payload: LanguageServerPayload<T>
  ) {
    // serialize our message
    const serialized = SerializeServerMessage(payload);

    // check if we can send our notification
    if (this.canSendNotification(serialized)) {
      this.connection.sendNotification(MessageNameNormalizer(message), payload);
    }
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

  /**
   * Respond to requests from the language server
   */
  onRequest<T extends LanguageServerMessage>(
    message: T,
    callback: (
      payload: LanguageServerPayload<T>
    ) => Promise<LanguageServerResponse<T>> | LanguageServerResponse<T>
  ) {
    this.connection.onRequest(MessageNameNormalizer(message), callback);
  }
}
