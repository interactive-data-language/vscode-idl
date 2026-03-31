import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@idl/ngx/theme';

import { ChatModelSelectorComponent } from '../chat-model-selector/chat-model-selector.component';

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
    ChatModelSelectorComponent,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatHeaderComponent {
  private readonly themeService = inject(ThemeService);

  /**
   * Current theme mode
   */
  protected readonly isDarkMode = this.themeService.isDarkMode;

  /**
   * Toggle between light and dark theme
   */
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
