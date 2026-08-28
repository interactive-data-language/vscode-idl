import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@idl/ngx/theme';
import { Store } from '@ngxs/store';

import { ChatLayoutService } from '../../services/chat-layout.service';
import { ResetApplicationState } from '../../state/chat.actions';
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
