import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@idl/ngx/theme';
import { WorkflowTemplateDialogComponent } from '@idl/ngx/workflow-templates';
import { ChatSession } from '@idl/types/chat';
import { Store } from '@ngxs/store';
import { nanoid } from 'nanoid';

import { ChatLayoutService } from '../../services/chat-layout.service';
import {
  AddChatSession,
  AddMessageToSession,
  ResetApplicationState,
  SelectChatSession,
} from '../../state/chat.actions';
import { ChatState } from '../../state/chat.state';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/**
 * Header component for the chat interface.

 * Displays the application title and theme toggle.
 */
@Component({
  selector: 'ngx-chat-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatHeaderComponent {
  protected readonly chatLayoutService = inject(ChatLayoutService);

  /**
   * Title, tooltip, and whether to show the logo to display in the header,
   * based on the current mobile/list/session state
   */
  protected readonly headerDisplay = computed(() => {
    if (
      this.chatLayoutService.isMobile() &&
      this.chatLayoutService.mobileListOpen()
    ) {
      return { title: 'Chats', tooltip: '', showLogo: false };
    }

    if (this.chatLayoutService.isMobile() && this.selectedSession()) {
      const title = this.selectedSession()?.title ?? '';
      return { title, tooltip: title, showLogo: false };
    }

    return {
      title: 'IDL Agent and ENVI Agent',
      tooltip: '',
      showLogo: true,
    };
  });

  private readonly themeService = inject(ThemeService);

  /**
   * Current theme mode
   */
  protected readonly isDarkMode = this.themeService.isDarkMode;

  private readonly store = inject(Store);

  /**
   * Currently selected chat session, used for the mobile title
   */
  protected readonly selectedSession = this.store.selectSignal(
    ChatState.selectedSession,
  );

  private readonly dialog = inject(MatDialog);

  /**
   * Opens the Agent Workflow Template stepper dialog and, if the user starts
   * a workflow, sends the composed message into the current (or a new) chat session
   */
  protected newWorkflow(): void {
    const dialogRef = this.dialog.open(WorkflowTemplateDialogComponent, {
      disableClose: true,
      panelClass: 'workflow-template-dialog-panel',
      width: '90vw',
      maxWidth: '1100px',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((message) => {
      if (!message) {
        return;
      }

      let sessionId = this.selectedSession()?.id;

      // If no session exists, create one before sending
      if (!sessionId) {
        const newSession: ChatSession = {
          id: nanoid(),
          title: 'New Chat',
          createdAt: new Date(),
          lastMessageAt: new Date(),
          messageCount: 0,
          status: 'ready',
          messages: [],
        };
        this.store.dispatch(new AddChatSession(newSession));
        this.store.dispatch(new SelectChatSession(newSession.id));
        sessionId = newSession.id;
      }

      this.store.dispatch(
        new AddMessageToSession(sessionId, {
          id: nanoid(),
          type: 'user',
          content: [
            {
              type: 'text',
              payload: message,
            },
          ],
        }),
      );
    });
  }

  /**
   * Confirm and reset the entire application state back to its defaults
   */
  protected resetApplication(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: { title: 'Reset application' },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(new ResetApplicationState());
      }
    });
  }

  /**
   * Toggle between light and dark theme
   */
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
