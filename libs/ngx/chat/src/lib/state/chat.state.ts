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
  LoadChatSessions,
  SelectChatSession,
  SetChatSessions,
  SetPendingPrompt,
  SetSelectedModel,
  SetSessionPrompt,
} from './chat.actions';

/**
 * Default state for the chat feature
 */
const defaultState: ChatStateModel = {
  sessions: [],
  pendingPrompt: 'envi',
  loading: false,
  selectedModel: 'gpt-4o-mini', // Default to cheapest model
};

@State<ChatStateModel>({
  name: 'chat',
  defaults: defaultState,
})
@Injectable()
export class ChatState {
  private readonly chatApiService = inject(ChatApiService);

  /**
   * Get loading state
   */
  @Selector()
  static loading(state: ChatStateModel): boolean {
    return state.loading;
  }

  /**
   * Get the pending prompt (selected before any session exists)
   */
  @Selector()
  static pendingPrompt(state: ChatStateModel) {
    return state.pendingPrompt;
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
      (m) => m.type !== 'tool',
    );

    // Track the latest tool message ID so tool_result can update it
    let currentToolMessageId: null | string = null;

    // Track the current system message accumulating LLM text. After each
    // tool_result a new system message is created so text and tool calls
    // interleave naturally in the message list.
    let currentSystemMessageId = systemMessageId;
    let needsNewSystemMessage = false;

    this.chatApiService
      .sendMessage({
        sessionId: action.sessionId,
        message: action.message.content
          .flatMap((c) => ('payload' in c ? [c.payload] : []))
          .join('\n'),
        model: state.selectedModel,
        prompt: targetSession.prompt,
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
                  lastMsg.content[0]?.type === 'text' &&
                  (lastMsg.content[0].payload ?? '') === ''
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
              this.setMessageError(
                ctx,
                action.sessionId,
                currentSystemMessageId,
                chunk.error || 'Unknown error occurred',
              );
              break;

            case 'map_data': {
              // Each map gets its own system message so it renders cleanly
              const mapMessageId = nanoid();
              const mapMessage: ChatMessage = {
                id: mapMessageId,
                type: 'system',
                content: [{ type: 'map', mapData: chunk.mapData }],
              };
              this.appendMessageToSession(ctx, action.sessionId, mapMessage);
              // Keep needsNewSystemMessage true so subsequent text opens a fresh message
              needsNewSystemMessage = true;
              break;
            }

            case 'text_chunk':
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
              currentToolMessageId = nanoid();
              const toolMessage: ChatMessage = {
                id: currentToolMessageId,
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

            case 'tool_result':
              if (currentToolMessageId) {
                const contentType = chunk.toolError
                  ? 'tool_error'
                  : 'tool_result';
                this.appendContentToMessage(
                  ctx,
                  action.sessionId,
                  currentToolMessageId,
                  {
                    type: contentType,
                    payload: chunk.toolOutput,
                  },
                );
                currentToolMessageId = null;
                // Next text_chunk should open a new system message
                needsNewSystemMessage = true;
              }
              break;

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
    const session = state.pendingPrompt
      ? { ...action.session, prompt: state.pendingPrompt }
      : action.session;
    ctx.patchState({
      sessions: [...state.sessions, session],
      pendingPrompt: undefined,
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
  @Action(LoadChatSessions)
  loadSessions(ctx: StateContext<ChatStateModel>) {
    ctx.patchState({ loading: true });

    // Placeholder: Create some demo sessions
    const demoSessions: ChatSession[] = [
      {
        id: nanoid(),
        prompt: 'envi',
        title: 'Welcome Chat',
        createdAt: new Date(),
        lastMessageAt: new Date(),
        messageCount: 3,
        status: 'ready',
        messages: [
          {
            id: nanoid(),
            type: 'user',
            content: [
              {
                type: 'text',
                payload:
                  'Can you help me do XYZ? with some other really long text and blah blah blah blah blah thingajshdlfkjhaslkhdflkjashdflkj ksjhdflkhfas lashdflkj alkdsjhflkja lkajshdfk lkahdslkfha lkajhdslfkj alkdjhsflkjahs',
              },
            ],
          },
          {
            id: nanoid(),
            type: 'system',
            content: [
              {
                type: 'text',
                payload: 'Can you help me do XYZ?\n- Thing\n- Also',
              },
            ],
          },
          {
            id: nanoid(),
            type: 'user',
            content: [
              {
                type: 'text',
                payload: '[link](https://www.google.com)',
              },
            ],
          },
        ],
      },
      {
        id: nanoid(),
        prompt: 'envi',
        title: 'Project Discussion',
        createdAt: new Date(Date.now() - 86400000),
        lastMessageAt: new Date(Date.now() - 3600000),
        messageCount: 15,
        status: 'in-progress',
        messages: [
          {
            id: nanoid(),
            type: 'user',
            content: [
              {
                type: 'text',
                payload: 'Can you help me do XYZ?',
              },
            ],
          },
          {
            id: nanoid(),
            type: 'system',
            content: [
              {
                type: 'text',
                payload: 'Can you help me do XYZ?',
              },
            ],
          },
        ],
      },
    ];

    ctx.dispatch(new SetChatSessions(demoSessions));
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
   * Set pending prompt before a session exists
   */
  @Action(SetPendingPrompt)
  setPendingPrompt(
    ctx: StateContext<ChatStateModel>,
    action: SetPendingPrompt,
  ) {
    ctx.patchState({ pendingPrompt: action.prompt });
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
   * Set the prompt type for a specific chat session
   */
  @Action(SetSessionPrompt)
  setSessionPrompt(
    ctx: StateContext<ChatStateModel>,
    action: SetSessionPrompt,
  ) {
    const state = ctx.getState();
    ctx.patchState({
      sessions: state.sessions.map((s) =>
        s.id === action.sessionId ? { ...s, prompt: action.prompt } : s,
      ),
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

    const firstBlock = message.content[0];
    const currentContent =
      firstBlock?.type === 'text' ? firstBlock.payload : '';
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
