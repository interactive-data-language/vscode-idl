/**
 * Content for a chat message
 *
 * Typed so that we can have specific types of content to display:
 *
 * - Markdown
 * - Maps
 * - Etc.
 */
export interface ChatMessageContent {
  /** Payload content based on the type of chat message */
  payload: string;
  /** Type of chat message */
  type: 'result' | 'text';
}

/**
 * Chat message
 */
export interface ChatMessage {
  /**
   * Content of the message
   */
  content: ChatMessageContent[];
  /** ID of the chat message */
  id: string;
  /** Role of the message (system or user) */
  role: 'system' | 'user';
}

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
   * Status of the chat
   */
  status: 'error' | 'in-progress' | 'ready';

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
