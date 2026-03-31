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
   * Chat messages
   */
  messages: ChatMessage[];

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
   * Currently selected model for chat completions
   */
  selectedModel: string;

  /**
   * ID of the currently selected chat session
   */
  selectedSessionId: null | string;

  /**
   * All available chat sessions
   */
  sessions: ChatSession[];
}

// ==============================================================================
// API Request/Response Types
// ==============================================================================

/**
 * Request payload for sending a chat message to the API
 */
export interface ChatMessageRequest {
  /** Conversation history to provide context */
  conversationHistory: ChatMessage[];
  /** The user's message content */
  message: string;
  /** The model to use for completion (e.g., 'gpt-4o-mini') */
  model: string;
  /** Unique identifier for the chat session */
  sessionId: string;
}

/**
 * Chunk of data streamed from the chat API via SSE
 */
export interface ChatStreamChunk {
  /** The streamed content (token text, empty for done, or error message) */
  content: string;
  /** Optional error message if type is 'error' */
  error?: string;
  /** Tool name when type is 'tool_call' or 'tool_result' */
  toolName?: string;
  /** Type of chunk */
  type: 'done' | 'error' | 'token' | 'tool_call' | 'tool_result';
}

/**
 * Available OpenAI models for chat completions
 */
export interface AvailableModel {
  /** Human-readable description of the model */
  description: string;
  /** Unique model identifier */
  id: string;
  /** Display name for the model */
  name: string;
}

/**
 * Default models
 */
export const DEFAULT_MODELS: AvailableModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and affordable',
  },
];

/**
 * Response containing list of available models
 */
export interface AvailableModelsResponse {
  /** List of available models */
  models: AvailableModel[];
}
