import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@idl/ngx/theme';
import { Store } from '@ngxs/store';

import { ChatLayoutService } from '../../services/chat-layout.service';
import { ChatState } from '../../state/chat.state';

/**
 * Header component for the chat interface.

 * Displays the application title and theme toggle.
 */
@Component({
  selector: 'ngx-chat-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule],
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

  /**
   * Toggle between light and dark theme
   */
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
