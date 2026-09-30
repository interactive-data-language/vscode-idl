import { ChatStateModel, ChatTokenUsage } from '@idl/types/chat';

/**
 * Default state for the chat feature
 */
export const DEFAULT_STATE: ChatStateModel = {
  version: '1.0.0',
  sessions: [],
  loading: false,
  selectedInstructions: 'idl-envi',
  selectedModel: 'gpt-5.4', // Default to cheapest model
};

/**
 * Default token usage for sessions that haven't reported any yet (new or restored from an older state)
 */
export const DEFAULT_TOKEN_USAGE: ChatTokenUsage = {
  currentTokens: 0,
  tokenLimit: 0,
};
