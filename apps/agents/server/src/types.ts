/**
 * Public type surface of the `@idl/agents-server` package, available to
 * consumers as `@idl/agents-server/types`.
 *
 * Add or remove exports here to change what the package publishes. Keep this to
 * types that are safe in a browser (no Node types, no `Date` fields).
 *
 * The type file is built by tools/node/build-agents-server-types.js
 *
 * And all of that is called by `npm run package-agents-server`
 */

export * from './protocol.interface';
export type { ConfigProblemCode, IConfigProblem } from '@idl/mcp/agents-server';
export type {
  AvailableModel,
  AvailableModelsRequest,
  AvailableModelsResponse,
  ChatInstructionOption,
  ChatInstructionsResponse,
  ChatInstructionType,
  ChatMessage,
  ChatMessageContent,
  ChatMessageRequest,
  ChatStreamChunk,
  ChatStreamChunk_Cancelled,
  ChatStreamChunk_Done,
  ChatStreamChunk_Error,
  ChatStreamChunk_TextChunk,
  ChatStreamChunk_ThinkingChunk,
  ChatStreamChunk_Title,
  ChatStreamChunk_TodoUpdate,
  ChatStreamChunk_TokenUsage,
  ChatStreamChunk_ToolCall,
  ChatStreamChunk_ToolResult,
  ChatTokenUsage,
  ExamplePrompt,
  ExamplePromptsResponse,
  TodoItem,
  TodoItemStatus,
} from '@idl/types/chat';
