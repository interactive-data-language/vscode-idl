import {
  ChatInstructionType,
  ChatMessage,
  ChatSession,
  ChatStateModel,
} from '@idl/types/chat';

/**
 * Load all chat sessions
 */
export class LoadTestChatSessions {
  static readonly type = '[Chat] Load Test Sessions';
}

/**
 * Set the list of chat sessions
 */
export class SetChatSessions {
  static readonly type = '[Chat] Set Sessions';
  constructor(public sessions: ChatSession[]) {}
}

/**
 * Select a specific chat session
 */
export class SelectChatSession {
  static readonly type = '[Chat] Select Session';
  constructor(public sessionId: string) {}
}

/**
 * Add a new chat session
 */
export class AddChatSession {
  static readonly type = '[Chat] Add Session';
  constructor(public session: ChatSession) {}
}

/**
 * Delete a chat session
 */
export class DeleteChatSession {
  static readonly type = '[Chat] Delete Session';
  constructor(public sessionId: string) {}
}

/**
 * Add a message to an existing chat session
 */
export class AddMessageToSession {
  static readonly type = '[Chat] Add Message';
  constructor(
    public sessionId: string,
    public message: ChatMessage,
  ) {}
}

/**
 * Set the selected model for chat completions
 */
export class SetSelectedModel {
  static readonly type = '[Chat] Set Selected Model';
  constructor(public model: string) {}
}

/**
 * Set the instruction type for a specific chat session
 */
export class SetSessionInstructions {
  static readonly type = '[Chat] Set Session Instructions';
  constructor(
    public sessionId: string,
    public instructions: ChatInstructionType,
  ) {}
}

/**
 * Restore persisted chat state (e.g. from IndexedDB)
 */
export class RestoreChatState {
  static readonly type = '[Chat] Restore State';
  constructor(public state: Partial<ChatStateModel>) {}
}

/**
 * Set the default instructions when making a new session
 */
export class SetDefaultInstructions {
  static readonly type = '[Chat] Set Default Instructions';
  constructor(public instructions: ChatInstructionType) {}
}

/**
 * Reset the entire application state back to its default value
 */
export class ResetApplicationState {
  static readonly type = '[Chat] Reset Application State';
}
