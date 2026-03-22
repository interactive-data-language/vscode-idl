import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngxs/store';

import {
  AddChatSession,
  LoadChatSessions,
  SelectChatSession,
} from '../../state/chat.actions';
import { ChatSession } from '../../state/chat.model';
import { ChatState } from '../../state/chat.state';

/**
 * Sidebar component displaying the list of chat sessions.
 * Uses NGXS for state management.
 */
@Component({
  selector: 'ngx-chat-sidebar',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatSidebarComponent implements OnInit {
  private readonly store = inject(Store);

  /**
   * Loading state
   */
  protected readonly loading = this.store.selectSignal(ChatState.loading);

  /**
   * Currently selected session ID
   */
  protected readonly selectedSessionId = this.store.selectSignal(
    ChatState.selectedSessionId,
  );

  /**
   * All available chat sessions
   */
  protected readonly sessions = this.store.selectSignal(ChatState.sessions);

  ngOnInit(): void {
    // Load chat sessions on component initialization
    this.store.dispatch(new LoadChatSessions());
  }

  /**
   * Create a new chat session
   */
  protected createNewChat(): void {
    const newSession: ChatSession = {
      id: `${Date.now()}`,
      title: 'New Chat',
      createdAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0,
      status: 'ready',
    };
    this.store.dispatch(new AddChatSession(newSession));
    this.store.dispatch(new SelectChatSession(newSession.id));
  }

  /**
   * Format the last message time for display
   */
  protected formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  }

  /**
   * Select a chat session
   */
  protected selectSession(sessionId: string): void {
    this.store.dispatch(new SelectChatSession(sessionId));
  }
}
