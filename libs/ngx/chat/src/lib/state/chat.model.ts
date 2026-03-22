/**
 * Represents a chat session in the application
 */
export interface ChatSession {
  /**
   * Timestamp when the chat was created
   */
  createdAt: Date;

  /**
   * Unique identifier for the chat session
   */
  id: string;

  /**
   * Timestamp of the last message in the chat
   */
  lastMessageAt: Date;

  /**
   * Number of messages in this chat session
   */
  messageCount: number;

  /**
   * Display name/title of the chat session
   */
  title: string;
}

/**
 * State model for the chat feature
 */
export interface ChatStateModel {
  /**
   * Whether chat sessions are currently being loaded
   */
  loading: boolean;

  /**
   * ID of the currently selected chat session
   */
  selectedSessionId: null | string;

  /**
   * All available chat sessions
   */
  sessions: ChatSession[];
}
