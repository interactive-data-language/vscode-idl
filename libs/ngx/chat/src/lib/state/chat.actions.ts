import { ChatMessage, ChatPromptType, ChatSession } from '@idl/types/chat';

/**
 * Load all chat sessions
 */
export class LoadChatSessions {
  static readonly type = '[Chat] Load Sessions';
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
 * Set the prompt type for a specific chat session
 */
export class SetSessionPrompt {
  static readonly type = '[Chat] Set Session Prompt';
  constructor(
    public sessionId: string,
    public prompt: ChatPromptType,
  ) {}
}

/**
 * Set the pending prompt type before a session is created
 */
export class SetPendingPrompt {
  static readonly type = '[Chat] Set Pending Prompt';
  constructor(public prompt: ChatPromptType) {}
}
