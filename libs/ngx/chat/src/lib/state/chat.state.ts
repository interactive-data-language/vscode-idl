import { inject, Injectable } from '@angular/core';
import {
  ChatMessage,
  ChatMessageContent,
  ChatSession,
  ChatStateModel,
} from '@idl/types/chat';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { nanoid } from 'nanoid';

import { ChatApiService } from '../services/chat-api.service';
import {
  AddChatSession,
  AddMessageToSession,
  DeleteChatSession,
  LoadTestChatSessions,
  ResetApplicationState,
  RestoreChatState,
  SelectChatSession,
  SetChatSessions,
  SetSelectedInstructions,
  SetSelectedModel,
} from './chat.actions';
import { DEFAULT_STATE } from './default-state.interface';
import { TEST_CHAT_SESSIONS } from './test-chat-sessions.interface';

/**
 * State management for our chat UI
 *
 * Note that this being saved and restored comes from these files:
 * libs\ngx\chat\src\lib\services\app-storage.service.ts
 * apps\agents\ui\src\app\app.config.ts
 *
 */
@State<ChatStateModel>({
  name: 'chat',
  defaults: DEFAULT_STATE,
})
@Injectable()
export class ChatState {
  private readonly chatApiService = inject(ChatApiService);

  /**
   * Whether any session (not just the selected one) is currently in-progress
   *
   * Only a single session can be processed at a time because the chat engages
   * with a single application that cannot process requests in parallel.
   */
  @Selector()
  static anySessionInProgress(state: ChatStateModel): boolean {
    return state.sessions.some((s) => s.status === 'in-progress');
  }

  /**
   * Get loading state
   */
  @Selector()
  static loading(state: ChatStateModel): boolean {
    return state.loading;
  }

  /**
   * Get the currently selected instructions
   */
  @Selector()
  static selectedInstructions(state: ChatStateModel) {
    return state.selectedInstructions;
  }

  /**
   * Get the currently selected model
   */
  @Selector()
  static selectedModel(state: ChatStateModel): string {
    return state.selectedModel;
  }

  /**
   * Get the currently selected session
   */
  @Selector()
  static selectedSession(state: ChatStateModel): ChatSession | null {
    if (!state.selectedSessionId) {
      return null;
    }
    return state.sessions.find((s) => s.id === state.selectedSessionId) || null;
  }

  /**
   * Get the currently selected session ID
   */
  @Selector()
  static selectedSessionId(state: ChatStateModel): string | undefined {
    return state.selectedSessionId;
  }

  /**
   * Get all chat sessions
   */
  @Selector()
  static sessions(state: ChatStateModel): ChatSession[] {
    return state.sessions;
  }

  /**
   * Get the full chat state, used to persist it to IndexedDB
   */
  @Selector()
  static state(state: ChatStateModel): ChatStateModel {
    return state;
  }

  /**
   * Add a message to an existing chat session and get AI response
   */
  @Action(AddMessageToSession)
  addMessageToSession(
    ctx: StateContext<ChatStateModel>,
    action: AddMessageToSession,
  ) {
    const state = ctx.getState();

    // Find the target session
    const targetSession = state.sessions.find((s) => s.id === action.sessionId);
    if (!targetSession) {
      console.error(`Session ${action.sessionId} not found`);
      return;
    }

    // Only one session can be processed at a time, the backend can't run in parallel
    if (state.sessions.some((s) => s.status === 'in-progress')) {
      console.error('Another session is already in-progress');
      return;
    }

    // 1. Add user message immediately
    let updatedSessions = state.sessions.map((session) => {
      if (session.id === action.sessionId) {
        return {
          ...session,
          messages: [...session.messages, action.message],
          messageCount: session.messageCount + 1,
          lastMessageAt: new Date(),
          status: 'in-progress' as const,
        };
      }
      return session;
    });

    ctx.patchState({ sessions: updatedSessions });

    // 2. Create empty system message with in-progress status
    const systemMessageId = nanoid();
    const systemMessage: ChatMessage = {
      id: systemMessageId,
      type: 'system',
      content: [{ type: 'text', payload: '' }],
    };

    // Get the latest state after adding user message
    const stateAfterUserMessage = ctx.getState();
    updatedSessions = stateAfterUserMessage.sessions.map((session) => {
      if (session.id === action.sessionId) {
        return {
          ...session,
          messages: [...session.messages, systemMessage],
          messageCount: session.messageCount + 1,
        };
      }
      return session;
    });

    ctx.patchState({ sessions: updatedSessions });

    // 3. Call API with streaming
    const conversationHistory = targetSession.messages.filter(
      (m) => m.type !== 'thinking' && m.type !== 'tool',
    );

    // Track the latest tool message ID so tool_result can update it
    // Map from toolCallId -> message ID so concurrent tool calls each resolve
    // to the correct in-progress tool card in the UI.
    const toolMessageIdByCallId = new Map<string, string>();

    // Map from thinkingId (reasoningId) -> message ID so multiple reasoning
    // blocks in a single turn each resolve to their own thinking card.
    const thinkingMessageIdByReasoningId = new Map<string, string>();

    // ID of the most recently created thinking message (and its reasoning
    // ID), used to close it out if the backend sends a text chunk before
    // the thinking "done" event (the backend can emit these out of order).
    let lastThinkingMessageId: string | undefined;
    let lastThinkingReasoningId: string | undefined;

    // Track the current system message accumulating LLM text. After each
    // tool_result a new system message is created so text and tool calls
    // interleave naturally in the message list.
    let currentSystemMessageId = systemMessageId;
    let needsNewSystemMessage = false;

    this.chatApiService
      .sendMessage({
        sessionId: action.sessionId,
        message: action.message.content.map((c) => c.payload).join('\n'),
        model: state.selectedModel,
        instructions: state.selectedInstructions,
        conversationHistory,
        currentTodos: targetSession.todos ?? [],
      })
      .subscribe({
        next: (chunk) => {
          switch (chunk.type) {
            case 'done': {
              // Remove the trailing system message if it has no text content
              // (happens when the last LLM iteration ended with a tool call)
              const doneState = ctx.getState();
              const doneSession = doneState.sessions.find(
                (s) => s.id === action.sessionId,
              );
              if (doneSession) {
                const lastMsg =
                  doneSession.messages[doneSession.messages.length - 1];
                if (
                  lastMsg?.type === 'system' &&
                  lastMsg.id === currentSystemMessageId &&
                  (lastMsg.content[0]?.payload ?? '') === ''
                ) {
                  const trimmedSessions = doneState.sessions.map((session) => {
                    if (session.id !== action.sessionId) return session;
                    return {
                      ...session,
                      messages: session.messages.slice(0, -1),
                      messageCount: session.messageCount - 1,
                    };
                  });
                  ctx.patchState({ sessions: trimmedSessions });
                }
              }
              this.updateSession(ctx, action.sessionId, {
                status: 'ready',
                lastMessageAt: new Date(),
              });
              break;
            }

            case 'error':
              console.error('Streaming error:', chunk.error);
              // don't leave a thinking card spinning forever if the stream dies mid-reasoning
              for (const thinkingMessageId of thinkingMessageIdByReasoningId.values()) {
                this.updateMessage(ctx, action.sessionId, thinkingMessageId, {
                  status: 'done',
                });
              }
              thinkingMessageIdByReasoningId.clear();
              lastThinkingMessageId = undefined;
              lastThinkingReasoningId = undefined;
              this.setMessageError(
                ctx,
                action.sessionId,
                currentSystemMessageId,
                chunk.error || 'Unknown error occurred',
              );
              break;

            case 'text_chunk':
              // Backend can send a text chunk before closing out the
              // thinking message it belongs after, so close the last
              // in-progress thinking message here as a safety net.
              if (lastThinkingMessageId) {
                this.updateMessage(
                  ctx,
                  action.sessionId,
                  lastThinkingMessageId,
                  { status: 'done' },
                );
                thinkingMessageIdByReasoningId.delete(
                  lastThinkingReasoningId as string,
                );
                lastThinkingMessageId = undefined;
                lastThinkingReasoningId = undefined;
              }

              if (needsNewSystemMessage) {
                // Start a fresh system message after a tool call/result pair
                currentSystemMessageId = nanoid();
                const newSystemMessage: ChatMessage = {
                  id: currentSystemMessageId,
                  type: 'system',
                  content: [{ type: 'text', payload: '' }],
                };
                this.appendMessageToSession(
                  ctx,
                  action.sessionId,
                  newSystemMessage,
                );
                needsNewSystemMessage = false;
              }
              this.appendToMessage(
                ctx,
                action.sessionId,
                currentSystemMessageId,
                chunk.content,
              );
              break;

            case 'thinking_chunk': {
              let thinkingMessageId = thinkingMessageIdByReasoningId.get(
                chunk.thinkingId,
              );
              if (!thinkingMessageId) {
                thinkingMessageId = nanoid();
                thinkingMessageIdByReasoningId.set(
                  chunk.thinkingId,
                  thinkingMessageId,
                );
                const thinkingMessage: ChatMessage = {
                  id: thinkingMessageId,
                  type: 'thinking',
                  status: 'in-progress',
                  content: [{ type: 'thinking', payload: '' }],
                };
                this.appendMessageToSession(
                  ctx,
                  action.sessionId,
                  thinkingMessage,
                );
              }
              lastThinkingMessageId = thinkingMessageId;
              lastThinkingReasoningId = chunk.thinkingId;

              if (chunk.done) {
                this.updateMessage(ctx, action.sessionId, thinkingMessageId, {
                  status: 'done',
                });
                thinkingMessageIdByReasoningId.delete(chunk.thinkingId);
                if (lastThinkingMessageId === thinkingMessageId) {
                  lastThinkingMessageId = undefined;
                  lastThinkingReasoningId = undefined;
                }
              } else if (chunk.content) {
                this.appendThinkingDelta(
                  ctx,
                  action.sessionId,
                  thinkingMessageId,
                  chunk.content,
                );
              }
              break;
            }

            case 'title':
              if (chunk.title) {
                this.updateSession(ctx, action.sessionId, {
                  title: chunk.title,
                });
              }
              break;

            case 'todo_update':
              this.updateSession(ctx, action.sessionId, {
                todos: chunk.todos,
              });
              break;

            case 'tool_call': {
              // Append the tool message after whatever text has accumulated
              const toolMessageId = nanoid();
              toolMessageIdByCallId.set(chunk.toolCallId, toolMessageId);
              const toolMessage: ChatMessage = {
                id: toolMessageId,
                type: 'tool',
                content: [
                  {
                    type: 'tool_call',
                    payload: JSON.stringify({
                      name: chunk.toolName,
                      args: chunk.toolArgs ?? {},
                    }),
                  },
                ],
              };
              this.appendMessageToSession(ctx, action.sessionId, toolMessage);
              break;
            }

            case 'tool_result': {
              const targetMessageId = toolMessageIdByCallId.get(
                chunk.toolCallId,
              );
              if (targetMessageId) {
                const contentType = chunk.toolError
                  ? 'tool_error'
                  : 'tool_result';
                this.appendContentToMessage(
                  ctx,
                  action.sessionId,
                  targetMessageId,
                  {
                    type: contentType,
                    payload: chunk.toolOutput,
                  },
                );
                toolMessageIdByCallId.delete(chunk.toolCallId);
                // Open a new system message once all in-flight tools complete
                if (toolMessageIdByCallId.size === 0) {
                  needsNewSystemMessage = true;
                }
              }
              break;
            }

            default:
              break;
          }
        },
        error: (error) => {
          console.error('API call error:', error);
          this.setMessageError(
            ctx,
            action.sessionId,
            currentSystemMessageId,
            error.message || 'Failed to connect to API',
          );
        },
      });
  }

  /**
   * Add a new chat session
   */
  @Action(AddChatSession)
  addSession(ctx: StateContext<ChatStateModel>, action: AddChatSession) {
    const state = ctx.getState();
    ctx.patchState({
      sessions: [...state.sessions, action.session],
    });
  }

  /**
   * Delete a chat session
   */
  @Action(DeleteChatSession)
  deleteSession(ctx: StateContext<ChatStateModel>, action: DeleteChatSession) {
    const state = ctx.getState();
    ctx.patchState({
      sessions: state.sessions.filter((s) => s.id !== action.sessionId),
      selectedSessionId:
        state.selectedSessionId === action.sessionId
          ? undefined
          : state.selectedSessionId,
    });
  }

  /**
   * Load chat sessions (placeholder - would call a service in real app)
   */
  @Action(LoadTestChatSessions)
  loadSessions(ctx: StateContext<ChatStateModel>) {
    ctx.patchState({ loading: true });
    ctx.dispatch(new SetChatSessions(TEST_CHAT_SESSIONS));
  }

  /**
   * Reset the entire application state back to its default value
   */
  @Action(ResetApplicationState)
  resetApplicationState(ctx: StateContext<ChatStateModel>) {
    // copy default state, but keep selections since they were loaded from a REST API
    const state = ctx.getState();
    ctx.setState({
      ...DEFAULT_STATE,
      selectedInstructions: state.selectedInstructions,
      selectedModel: state.selectedModel,
    });
  }

  /**
   * Restore persisted chat state (e.g. from IndexedDB)
   *
   * Reset fields that we don't care about saving
   */
  @Action(RestoreChatState)
  restoreChatState(
    ctx: StateContext<ChatStateModel>,
    action: RestoreChatState,
  ) {
    ctx.patchState({ ...action.state, loading: false });
  }

  /**
   * Select a chat session
   */
  @Action(SelectChatSession)
  selectSession(ctx: StateContext<ChatStateModel>, action: SelectChatSession) {
    ctx.patchState({
      selectedSessionId: action.sessionId,
    });
  }

  /**
   * Set the currently selected instructions for chat completions
   */
  @Action(SetSelectedInstructions)
  setSelectedInstructions(
    ctx: StateContext<ChatStateModel>,
    action: SetSelectedInstructions,
  ) {
    ctx.patchState({ selectedInstructions: action.instructions });
  }

  /**
   * Set the selected model for chat completions
   */
  @Action(SetSelectedModel)
  setSelectedModel(
    ctx: StateContext<ChatStateModel>,
    action: SetSelectedModel,
  ) {
    ctx.patchState({
      selectedModel: action.model,
    });
  }

  /**
   * Set the list of chat sessions
   */
  @Action(SetChatSessions)
  setSessions(ctx: StateContext<ChatStateModel>, action: SetChatSessions) {
    ctx.patchState({
      sessions: action.sessions,
      loading: false,
    });
  }

  /**
   * Helper: Append a new content block to an existing message
   */
  private appendContentToMessage(
    ctx: StateContext<ChatStateModel>,
    sessionId: string,
    messageId: string,
    newContent: ChatMessageContent,
  ): void {
    const state = ctx.getState();
    const session = state.sessions.find((s) => s.id === sessionId);
    const message = session?.messages.find((m) => m.id === messageId);

    if (!message) return;

    this.updateMessage(ctx, sessionId, messageId, {
      content: [...message.content, newContent],
    });
  }

  /**
   * Helper: Append a message to the end of a session's message list
   */
  private appendMessageToSession(
    ctx: StateContext<ChatStateModel>,
    sessionId: string,
    newMessage: ChatMessage,
  ): void {
    const state = ctx.getState();
    const sessions = state.sessions.map((session) => {
      if (session.id !== sessionId) return session;
      return {
        ...session,
        messages: [...session.messages, newMessage],
        messageCount: session.messageCount + 1,
      };
    });
    ctx.patchState({ sessions });
  }

  /**
   * Helper: Append a reasoning delta to a thinking message's single content block
   */
  private appendThinkingDelta(
    ctx: StateContext<ChatStateModel>,
    sessionId: string,
    messageId: string,
    content: string,
  ): void {
    const state = ctx.getState();
    const session = state.sessions.find((s) => s.id === sessionId);
    const message = session?.messages.find((m) => m.id === messageId);

    if (!message) return;

    const currentContent = message.content[0]?.payload || '';
    this.updateMessage(ctx, sessionId, messageId, {
      content: [
        {
          type: 'thinking' as const,
          payload: currentContent + content,
        },
      ],
    });
  }

  /**
   * Helper: Append content to a message
   */
  private appendToMessage(
    ctx: StateContext<ChatStateModel>,
    sessionId: string,
    messageId: string,
    content: string,
  ): void {
    const state = ctx.getState();
    const session = state.sessions.find((s) => s.id === sessionId);
    const message = session?.messages.find((m) => m.id === messageId);

    if (!message) return;

    const currentContent = message.content[0]?.payload || '';
    this.updateMessage(ctx, sessionId, messageId, {
      content: [
        {
          type: 'text' as const,
          payload: currentContent + content,
        },
      ],
    });
  }

  /**
   * Helper: Set message content to an error message
   */
  private setMessageError(
    ctx: StateContext<ChatStateModel>,
    sessionId: string,
    messageId: string,
    errorMessage: string,
  ): void {
    this.updateMessage(ctx, sessionId, messageId, {
      content: [
        {
          type: 'text' as const,
          payload: `❌ Error: ${errorMessage}`,
        },
      ],
    });
    this.updateSession(ctx, sessionId, { status: 'error' });
  }

  /**
   * Helper: Update a specific message within a session
   */
  private updateMessage(
    ctx: StateContext<ChatStateModel>,
    sessionId: string,
    messageId: string,
    updates: Partial<ChatMessage>,
  ): void {
    const state = ctx.getState();
    const sessions = state.sessions.map((session) => {
      if (session.id === sessionId) {
        const messages = session.messages.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg,
        );
        return { ...session, messages };
      }
      return session;
    });
    ctx.patchState({ sessions });
  }

  /**
   * Helper: Update a specific session
   */
  private updateSession(
    ctx: StateContext<ChatStateModel>,
    sessionId: string,
    updates: Partial<ChatSession>,
  ): void {
    const state = ctx.getState();
    const sessions = state.sessions.map((session) =>
      session.id === sessionId ? { ...session, ...updates } : session,
    );
    ctx.patchState({ sessions });
  }
}
