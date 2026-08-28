import { ChatStateModel } from '@idl/types/chat';

/**
 * Default state for the chat feature
 */
export const DEFAULT_STATE: ChatStateModel = {
  sessions: [],
  pendingPrompt: 'idl-envi',
  loading: false,
  selectedModel: 'gpt-5.4', // Default to cheapest model
};
