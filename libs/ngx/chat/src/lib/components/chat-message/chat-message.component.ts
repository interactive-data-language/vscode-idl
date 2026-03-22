import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MarkdownModule } from 'ngx-markdown';

import { ChatMessage } from '../../state/chat.model';

/**
 * Component for displaying a single chat message.
 * Styles differently based on message role (user vs system).
 *
 * Requires     MarkdownModule.forRoot(), in main app component
 */
@Component({
  selector: 'ngx-chat-message',
  imports: [CommonModule, MatCardModule, MarkdownModule],
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

  /**
   * Check if message is from system
   */
  protected readonly isSystemMessage = computed(
    () => this.message().role === 'system',
  );
}
