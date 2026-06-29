import type {
  AvailableModel,
  ChatMessageRequest,
  ChatStreamChunk,
} from '@idl/types/chat';

import type { ChatEngine } from '../config/env.config';
import type { IChatServiceConfig } from './chat.interface';
import { CopilotChatService } from './copilot-chat.service';
import { LangChainChatService } from './langchain-chat.service';

export type { IChatServiceConfig } from './chat.interface';

/**
 * Configuration for the public ChatService facade.
 */
export interface IChatServiceFacadeConfig extends IChatServiceConfig {
  /** Which engine to use for chat completions. Defaults to `copilot`. */
  chatEngine?: ChatEngine;
}

/**
 * Public chat service facade. Delegates to either CopilotChatService
 * or LangChainChatService based on the chatEngine config option.
 *
 * All consumers import from this module - the engine selection is transparent.
 */
export class ChatService {
  private readonly engine: CopilotChatService | LangChainChatService;

  constructor(config: IChatServiceFacadeConfig) {
    if (config.chatEngine === 'langchain') {
      this.engine = new LangChainChatService(config);
    } else {
      this.engine = new CopilotChatService(config);
    }
  }

  async disconnect(): Promise<void> {
    return this.engine.disconnect();
  }

  async listModels(): Promise<AvailableModel[]> {
    return this.engine.listModels();
  }

  streamChatCompletion(
    request: ChatMessageRequest,
  ): AsyncIterable<ChatStreamChunk> {
    return this.engine.streamChatCompletion(request);
  }
}
