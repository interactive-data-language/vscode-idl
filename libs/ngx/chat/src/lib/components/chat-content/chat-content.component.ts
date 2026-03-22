import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngxs/store';

import { ChatState } from '../../state/chat.state';

/**
 * Content component displaying the chat messages.
 * Shows the selected chat session or a welcome message.
 */
@Component({
  selector: 'ngx-chat-content',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatContentComponent {
  private readonly store = inject(Store);

  /**
   * Currently selected chat session
   */
  protected readonly selectedSession = this.store.selectSignal(
    ChatState.selectedSession,
  );
}
