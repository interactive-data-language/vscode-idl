import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
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
import { ChatSidebarItemComponent } from '../chat-sidebar-item/chat-sidebar-item.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * Chats last used yesterday or earlier go in the collapsed "older" group
 */
function IsBeforeToday(session: ChatSession): boolean {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return new Date(session.lastMessageAt) < startOfToday;
}

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
    ChatSidebarItemComponent,
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
   * Whether the group of older chats is expanded
   */
  protected readonly olderOpen = signal(false);

  /**
   * All available chat sessions
   */
  protected readonly sessions = this.store.selectSignal(ChatState.sessions);

  /**
   * Chats last used yesterday or earlier
   */
  protected readonly olderSessions = computed(() =>
    this.sessions().filter(IsBeforeToday),
  );

  /**
   * Currently selected session ID
   */
  protected readonly selectedSessionId = this.store.selectSignal(
    ChatState.selectedSessionId,
  );

  /**
   * Chats created or used today
   */
  protected readonly todaySessions = computed(() =>
    this.sessions().filter((session) => !IsBeforeToday(session)),
  );

  private readonly chatLayoutService = inject(ChatLayoutService);

  private readonly dialog = inject(MatDialog);

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // Load chat sessions on component initialization
    // this.store.dispatch(new LoadTestChatSessions());
  }

  /**
   * Create a new chat session, unless the selected chat is still empty
   */
  protected createNewChat(): void {
    if (
      this.store.selectSnapshot(ChatState.selectedSession)?.messages.length ===
      0
    ) {
      return;
    }

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
  protected deleteSession(sessionId: string): void {
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
   * Select a chat session
   */
  protected selectSession(sessionId: string): void {
    this.store.dispatch(new SelectChatSession(sessionId));
    this.chatLayoutService.closeList();
  }

  /**
   * Expand or collapse the group of older chats
   */
  protected toggleOlder(): void {
    this.olderOpen.update((open) => !open);
  }
}
