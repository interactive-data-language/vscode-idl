import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ChatMessage } from '../../state/chat.model';

/**
 * Component for displaying a single chat message.
 * Styles differently based on message role (user vs system).
 */
@Component({
  selector: 'ngx-chat-message',
  imports: [CommonModule, MatCardModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatMessageComponent {
  /**
   * The chat message to display
   */
  readonly message = input.required<ChatMessage>();
}
