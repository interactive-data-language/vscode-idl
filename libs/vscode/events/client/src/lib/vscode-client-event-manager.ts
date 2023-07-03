import {
  LanguageServerMessage,
  LanguageServerPayload,
  MessageNameNormalizer,
} from '@idl/vscode/events/messages';
import { LanguageClient } from 'vscode-languageclient/node';

/**
 * Class for sending/receiving messages between the VSCode client and language server
 */
export class VSCodeClientEventManager {
  /** Reference to the language client to send/receive messages to the language server */
  private client: LanguageClient;

  constructor(client: LanguageClient) {
    this.client = client;
  }

  /**
   * Send message to the language server
   */
  sendNotification<T extends LanguageServerMessage>(
    message: T,
    payload: LanguageServerPayload<T>
  ) {
    this.client.sendNotification(MessageNameNormalizer(message), payload);
  }

  /**
   * Respond to messages from the language server
   */
  onNotification<T extends LanguageServerMessage>(
    message: T,
    callback: (payload: LanguageServerPayload<T>) => void
  ) {
    this.client.onNotification(MessageNameNormalizer(message), callback);
  }
}
