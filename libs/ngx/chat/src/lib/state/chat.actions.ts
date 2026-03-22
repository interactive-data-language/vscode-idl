import { ChatMessage, ChatSession } from './chat.model';

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
