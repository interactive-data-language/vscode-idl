import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import {
  AddChatSession,
  DeleteChatSession,
  LoadChatSessions,
  SelectChatSession,
  SetChatSessions,
} from './chat.actions';
import { ChatSession, ChatStateModel } from './chat.model';

/**
 * Default state for the chat feature
 */
const defaultState: ChatStateModel = {
  sessions: [],
  selectedSessionId: null,
  loading: false,
};

@State<ChatStateModel>({
  name: 'chat',
  defaults: defaultState,
})
@Injectable()
export class ChatState {
  /**
   * Get loading state
   */
  @Selector()
  static loading(state: ChatStateModel): boolean {
    return state.loading;
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
        id: '1',
        title: 'Welcome Chat',
        createdAt: new Date(),
        lastMessageAt: new Date(),
        messageCount: 3,
      },
      {
        id: '2',
        title: 'Project Discussion',
        createdAt: new Date(Date.now() - 86400000),
        lastMessageAt: new Date(Date.now() - 3600000),
        messageCount: 15,
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
