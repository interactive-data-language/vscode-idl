import { GetExtensionPath } from '@idl/idl/files';
import { WEBSOCKET_ENABLED_MCP_TOOLS } from '@idl/mcp/websocket';
import type {
  AvailableModel,
  ChatMessageRequest,
  ChatPromptType,
  ChatStreamChunk,
  TodoItem,
} from '@idl/types/chat';
import type { IElectronConfig } from '@idl/types/electron';
import { copy } from 'fast-copy';
import { readFileSync } from 'fs';
import OpenAI from 'openai';
import { join } from 'path';

import { CopilotChatFramework } from '../orchestrators/copilot-chat-framework.class';
import { LangChainChatFramework } from '../orchestrators/langchain-chat-framework.class';

/**
 * Public chat service facade. Delegates to either CopilotChatService
 * or LangChainChatService based on the `agent.engine` config option.
 *
 * All consumers import from this module - the engine selection is transparent.
 */
export class ChatService {
  /**
   * Config for chat
   */
  private config: IElectronConfig;

  /**
   * Chat engine
   */
  private readonly framework: CopilotChatFramework | LangChainChatFramework;

  constructor(config: IElectronConfig) {
    this.config = config;
    if (config.agent.engine === 'langchain') {
      this.framework = new LangChainChatFramework(this, config);
    } else {
      this.framework = new CopilotChatFramework(this, config);
    }
  }

  async disconnect(): Promise<void> {
    return this.framework.disconnect();
  }

  /**
   * Format to-do messages
   */
  formatToDoList(todos: TodoItem[]): string {
    // check if no messages
    if (todos.length === 0) {
      return '';
    }

    const doneCount = todos.filter((t) => t.status === 'done').length;
    const total = todos.length;
    const statusSymbol: Record<TodoItem['status'], string> = {
      done: '[x]',
      'in-progress': '[~]',
      pending: '[ ]',
      skipped: '[-]',
    };

    return [
      `Current tasks (${doneCount}/${total} done):`,
      ...todos.map((todo) => `- ${statusSymbol[todo.status]} ${todo.text}`),
    ].join('\n');
  }

  /**
   * Generates a title for the chat
   */
  async generateTitle(firstMessage: string, model?: string) {
    /**
     * Init OpenAI client
     */
    let openai: OpenAI;

    // create client
    switch (true) {
      /**
       * Ollama
       */
      case this.config.agent.llm.model === 'ollama': {
        openai = new OpenAI({
          apiKey: 'ollama',
          baseURL: `${this.config.agent.llm.config.url}/v1`,
        });
        model = model || 'llama3.2';
        break;
      }

      /**
       * OpenAI
       */
      case this.config.agent.llm.model === 'openai': {
        openai = new OpenAI({
          apiKey: this.config.agent.llm.config.apiKey,
        });
        model = 'gpt-40-mini';
        break;
      }
      default:
        throw new Error(
          `Unknown model provider: ${this.config.agent.llm.model}`,
        );
        break;
    }

    /**
     * Attempt to generate a title
     */
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            content:
              `Create a concise 4-6 word title for a chat session that starts with this message. ` +
              `Reply with only the title, no quotes, no punctuation at the end:\n\n${firstMessage}`,
            role: 'user',
          },
        ],
        model,
        temperature: 0,
      });
      const content = completion.choices[0]?.message?.content;
      return typeof content === 'string' ? content.trim() : '';
    } catch (err) {
      console.log(
        '[CopilotChatService] Error while getting title for chat:',
        err,
      );
      return '';
    }
  }

  /**
   * Get tools that we are allowed to run from our MCP server
   */
  getAllowedTools() {
    switch (this.config.processing.mode) {
      case 'idl-machine':
        return ['*'];
      case 'websocket':
        return copy(WEBSOCKET_ENABLED_MCP_TOOLS);
      default:
        throw new Error(
          `Unknown processing mode "${this.config.processing.mode}"`,
        );
    }
  }

  /**
   * Lists what models are available for selection
   */
  async listModels(): Promise<AvailableModel[]> {
    switch (true) {
      /**
       * Ollama
       */
      case this.config.agent.llm.model === 'ollama': {
        const openai = new OpenAI({
          apiKey: 'ollama',
          baseURL: `${this.config.agent.llm.config.url}/v1`,
        });
        const page = await openai.models.list();
        return page.data
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((m) => ({ description: '', id: m.id, name: m.id }));
      }

      /**
       * OpenAI
       */
      case this.config.agent.llm.model === 'openai': {
        const openai = new OpenAI({
          apiKey: this.config.agent.llm.config.apiKey,
        });
        const page = await openai.models.list();
        return page.data
          .filter((m) => m.id.startsWith('gpt-5'))
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((m) => ({ description: '', id: m.id, name: m.id }));
        break;
      }
      default:
        throw new Error(
          `Unknown model provider: ${this.config.agent.llm.model}`,
        );
        break;
    }
  }

  /**
   * Load instruction file content for the given prompt type.
   */
  loadInstructions(prompt: 'todo' | ChatPromptType): string {
    const base = 'extension/agents/instructions';
    switch (prompt) {
      /**
       * ENVI instructions
       */
      case 'envi':
        return readFileSync(
          GetExtensionPath(join(base, 'envi.instructions.md')),
          'utf-8',
        );
      /**
       * IDL instructions
       */
      case 'idl':
        return readFileSync(
          GetExtensionPath(join(base, 'idl.instructions.md')),
          'utf-8',
        );
      /**
       * ENVI + IDL instructions
       */
      case 'idl-envi':
        return this.loadManyInstructions(['idl', 'envi']);
      /**
       * TODO instructions
       */
      case 'todo':
        return readFileSync(
          GetExtensionPath(
            join('extension/standalone-mcp', 'todo.instructions.md'),
          ),
          'utf-8',
        );
      default:
        return '';
    }
  }

  /**
   * Loads multiple instructions and joins them together
   */
  loadManyInstructions(prompts: ('todo' | ChatPromptType)[]) {
    const parts: string[] = [];
    for (let i = 0; i < prompts.length; i++) {
      parts.push(this.loadInstructions(prompts[i]));
    }
    return parts.join('\n\n---\n\n');
  }

  streamChatCompletion(
    request: ChatMessageRequest,
  ): AsyncIterable<ChatStreamChunk> {
    return this.framework.streamChatCompletion(request);
  }
}
