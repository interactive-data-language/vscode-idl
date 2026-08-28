/**
 * Instruction type controlling which instruction file is injected as a system message
 */
export type ChatInstructionType = 'envi' | 'idl-envi' | 'idl' | 'none';

/**
 * Status of a to-do item in the LLM task list
 */
export type TodoItemStatus = 'done' | 'in-progress' | 'pending' | 'skipped';

/**
 * A single to-do item tracked by the LLM during a workflow
 */
export interface TodoItem {
  /** Unique identifier */
  id: string;
  /** Status of the item */
  status: TodoItemStatus;
  /** Short description of the task step */
  text: string;
}

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
  type:
    | 'result'
    | 'text'
    | 'thinking'
    | 'tool_call'
    | 'tool_error'
    | 'tool_result';
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
  /** Streaming status, currently only populated for 'thinking' messages */
  status?: 'done' | 'in-progress';
  /** Type of the message */
  type: 'system' | 'thinking' | 'tool' | 'user';
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
   * Instruction type selected for this session
   */
  instructions: ChatInstructionType;

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

  /**
   * Current to-do list for this session, managed by the LLM during workflows
   */
  todos?: TodoItem[];
}

/**
 * State model for the chat feature
 */
export interface ChatStateModel {
  /**
   * Instruction type selected before a session is created
   */
  defaultInstructions?: ChatInstructionType;

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
  /** Current to-do list state, sent from the frontend so the server remains stateless */
  currentTodos?: TodoItem[];
  /** Instruction type to load as a system instruction */
  instructions: ChatInstructionType;
  /** The user's message content */
  message: string;
  /** The model to use for completion (e.g., 'gpt-4o-mini') */
  model: string;
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
  /** Unique identifier correlating this call to its tool_result chunk */
  toolCallId: string;
  /** Name of the tool being called */
  toolName: string;
  type: 'tool_call';
}

/** Result (or error) returned from a tool invocation */
export interface ChatStreamChunk_ToolResult {
  /** Unique identifier correlating this result to its tool_call chunk */
  toolCallId: string;
  /** Whether the tool returned an error */
  toolError: boolean;
  /** Tool name that was called */
  toolName: string;
  /** Tool output or error message */
  toolOutput: string;
  type: 'tool_result';
}

/** The LLM updated the to-do list; carries the full current list */
export interface ChatStreamChunk_TodoUpdate {
  /** Full current to-do list after the update */
  todos: TodoItem[];
  type: 'todo_update';
}

/** Extended-thinking/reasoning content, streamed before the final answer */
export interface ChatStreamChunk_ThinkingChunk {
  /** Delta text to append; empty string on the finalize (done=true) event */
  content: string;
  /** Whether this is the finalize event for the reasoning block identified by thinkingId */
  done: boolean;
  /** Correlates deltas and the finalize event for a single reasoning block */
  thinkingId: string;
  type: 'thinking_chunk';
}

/**
 * Discriminated union of all chunk types streamed from the chat API via SSE
 */
export type ChatStreamChunk =
  | ChatStreamChunk_Done
  | ChatStreamChunk_Error
  | ChatStreamChunk_TextChunk
  | ChatStreamChunk_ThinkingChunk
  | ChatStreamChunk_Title
  | ChatStreamChunk_TodoUpdate
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
  /** ID for the model to select by default */
  defaultModelID: string;
  /** List of available models */
  models: AvailableModel[];
}

/**
 * A single example prompt shown on the chat welcome screen.
 *
 * Can be a single string, or an array of strings that are joined together
 * with two new-line characters when displayed. When there is more than one
 * line, only the first line is shown for the card's display text.
 */
export type ExamplePrompt = string | string[];

/**
 * Response containing the configured list of example prompts
 */
export interface ExamplePromptsResponse {
  /** All configured example prompts */
  prompts: ExamplePrompt[];
}

/**
 * A single selectable chat instruction option
 */
export interface ChatInstructionOption {
  /** Description shown to help users pick the right option */
  description: string;
  /** Instruction type identifier */
  id: ChatInstructionType;
  /** Display name for the option */
  name: string;
}

/**
 * Response containing the configured list of chat instruction options and the
 * instruction type that should be selected by default
 */
export interface ChatInstructionsResponse {
  /** Instruction type selected by default */
  defaultInstructions: ChatInstructionType;
  /** All configured chat instruction options */
  options: ChatInstructionOption[];
}
