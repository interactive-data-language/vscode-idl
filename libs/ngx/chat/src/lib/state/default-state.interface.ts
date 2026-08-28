import { ChatStateModel } from '@idl/types/chat';

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
