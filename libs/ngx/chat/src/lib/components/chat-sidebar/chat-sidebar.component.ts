import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ChatSession } from '@idl/types/chat';
import { Store } from '@ngxs/store';

import { ChatLayoutService } from '../../services/chat-layout.service';
import {
  AddChatSession,
  DeleteChatSession,
  SelectChatSession,
} from '../../state/chat.actions';
import { ChatState } from '../../state/chat.state';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * Sidebar component displaying the list of chat sessions.
 */
@Component({
  selector: 'ngx-chat-sidebar',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
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

  private readonly chatLayoutService = inject(ChatLayoutService);

  private readonly dialog = inject(MatDialog);

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // Load chat sessions on component initialization
    // this.store.dispatch(new LoadTestChatSessions());
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
      messages: [],
    };
    this.store.dispatch(new AddChatSession(newSession));
    this.store.dispatch(new SelectChatSession(newSession.id));
    this.chatLayoutService.closeList();
  }

  /**
   * Confirm and delete a chat session, without selecting it
   */
  protected deleteSession(event: Event, sessionId: string): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: 'Delete chat',
        message: 'This chat session will be permanently deleted.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(new DeleteChatSession(sessionId));
      }
    });
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
    this.chatLayoutService.closeList();
  }
}
