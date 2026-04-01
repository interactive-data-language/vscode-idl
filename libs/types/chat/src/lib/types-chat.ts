/**
 * Prompt type controlling which instruction file is injected as a system message
 */
export type ChatPromptType = 'envi' | 'idl-envi' | 'idl' | 'none';

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
  type: 'result' | 'text' | 'tool_call' | 'tool_error' | 'tool_result';
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
  /** Type of the message */
  type: 'system' | 'tool' | 'user';
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
   * Prompt type selected for this session
   */
  prompt: ChatPromptType;

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
   * Prompt type selected before a session is created
   */
  pendingPrompt?: ChatPromptType;

  /**
   * Currently selected model for chat completions
   */
  selectedModel: string;

  /**
   * ID of the currently selected chat session
   */
  selectedSessionId?: string;

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
  /** Prompt type to load as a system instruction */
  prompt: ChatPromptType;
  /** Unique identifier for the chat session */
  sessionId: string;
}

/** Streaming ended successfully */
export interface ChatStreamChunk_Done {
  type: 'done';
}

/** A fatal streaming error occurred */
export interface ChatStreamChunk_Error {
  /** Error message */
  error: string;
  type: 'error';
}

/** A chunk of assistant text to append to the current message */
export interface ChatStreamChunk_TextChunk {
  /** Text content to append */
  content: string;
  type: 'text_chunk';
}

/** LLM-generated title for the session (sent once, after the first turn) */
export interface ChatStreamChunk_Title {
  /** The generated session title */
  title: string;
  type: 'title';
}

/** The model is invoking a tool */
export interface ChatStreamChunk_ToolCall {
  /** Arguments passed to the tool */
  toolArgs: Record<string, unknown>;
  /** Name of the tool being called */
  toolName: string;
  type: 'tool_call';
}

/** Result (or error) returned from a tool invocation */
export interface ChatStreamChunk_ToolResult {
  /** Whether the tool returned an error */
  toolError: boolean;
  /** Tool name that was called */
  toolName: string;
  /** Tool output or error message */
  toolOutput: string;
  type: 'tool_result';
}

/**
 * Discriminated union of all chunk types streamed from the chat API via SSE
 */
export type ChatStreamChunk =
  | ChatStreamChunk_Done
  | ChatStreamChunk_Error
  | ChatStreamChunk_TextChunk
  | ChatStreamChunk_Title
  | ChatStreamChunk_ToolCall
  | ChatStreamChunk_ToolResult;

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
