import { inject, Injectable } from '@angular/core';
import { ChatMessage, ChatSession, ChatStateModel } from '@idl/types/chat';
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
  SetSelectedModel,
} from './chat.actions';

/**
 * Default state for the chat feature
 */
const defaultState: ChatStateModel = {
  sessions: [],
  selectedSessionId: null,
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
  static selectedSessionId(state: ChatStateModel): null | string {
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
      role: 'system',
      content: [{ type: 'text', payload: '' }],
    };

    updatedSessions = state.sessions.map((session) => {
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
    const conversationHistory = targetSession.messages;

    this.chatApiService
      .sendMessage({
        sessionId: action.sessionId,
        message: action.message.content.map((c) => c.payload).join('\n'),
        model: state.selectedModel,
        conversationHistory,
      })
      .subscribe({
        next: (chunk) => {
          if (chunk.type === 'token') {
            // Append token to system message
            const currentState = ctx.getState();
            const sessions = currentState.sessions.map((session) => {
              if (session.id === action.sessionId) {
                const updatedMessages = session.messages.map((msg) => {
                  if (msg.id === systemMessageId) {
                    const currentContent = msg.content[0]?.payload || '';
                    return {
                      ...msg,
                      content: [
                        {
                          type: 'text' as const,
                          payload: currentContent + chunk.content,
                        },
                      ],
                    };
                  }
                  return msg;
                });
                return { ...session, messages: updatedMessages };
              }
              return session;
            });
            ctx.patchState({ sessions });
          } else if (chunk.type === 'done') {
            // Mark session as ready
            const currentState = ctx.getState();
            const sessions = currentState.sessions.map((session) => {
              if (session.id === action.sessionId) {
                return {
                  ...session,
                  status: 'ready' as const,
                  lastMessageAt: new Date(),
                };
              }
              return session;
            });
            ctx.patchState({ sessions });
          } else if (chunk.type === 'error') {
            // Mark session as error and show error message
            console.error('Streaming error:', chunk.error);
            const currentState = ctx.getState();
            const sessions = currentState.sessions.map((session) => {
              if (session.id === action.sessionId) {
                const updatedMessages = session.messages.map((msg) => {
                  if (msg.id === systemMessageId) {
                    return {
                      ...msg,
                      content: [
                        {
                          type: 'text' as const,
                          payload: `❌ Error: ${chunk.error || 'Unknown error occurred'}`,
                        },
                      ],
                    };
                  }
                  return msg;
                });
                return {
                  ...session,
                  messages: updatedMessages,
                  status: 'error' as const,
                };
              }
              return session;
            });
            ctx.patchState({ sessions });
          }
        },
        error: (error) => {
          console.error('API call error:', error);
          const currentState = ctx.getState();
          const sessions = currentState.sessions.map((session) => {
            if (session.id === action.sessionId) {
              const updatedMessages = session.messages.map((msg) => {
                if (msg.id === systemMessageId) {
                  return {
                    ...msg,
                    content: [
                      {
                        type: 'text' as const,
                        payload: `❌ Network error: ${error.message || 'Failed to connect to API'}`,
                      },
                    ],
                  };
                }
                return msg;
              });
              return {
                ...session,
                messages: updatedMessages,
                status: 'error' as const,
              };
            }
            return session;
          });
          ctx.patchState({ sessions });
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
          ? null
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
        title: 'Welcome Chat',
        createdAt: new Date(),
        lastMessageAt: new Date(),
        messageCount: 3,
        status: 'ready',
        messages: [
          {
            id: nanoid(),
            role: 'user',
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
            role: 'system',
            content: [
              {
                type: 'text',
                payload: 'Can you help me do XYZ?\n- Thing\n- Also',
              },
            ],
          },
          {
            id: nanoid(),
            role: 'user',
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
        title: 'Project Discussion',
        createdAt: new Date(Date.now() - 86400000),
        lastMessageAt: new Date(Date.now() - 3600000),
        messageCount: 15,
        status: 'in-progress',
        messages: [
          {
            id: nanoid(),
            role: 'user',
            content: [
              {
                type: 'text',
                payload: 'Can you help me do XYZ?',
              },
            ],
          },
          {
            id: nanoid(),
            role: 'system',
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
}
