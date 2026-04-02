import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChatMessage } from '@idl/types/chat';
import { MarkdownModule } from 'ngx-markdown';

import { ChatToolMessageComponent } from '../chat-tool-message/chat-tool-message.component';

/**
 * Component for displaying a single chat message.
 * Delegates tool messages to ChatToolMessageComponent.
 * Styles differently based on message role (user or system).
 *
 * Requires MarkdownModule.forRoot() in the main app component.
 */
@Component({
  selector: 'ngx-chat-message',
  imports: [
    CommonModule,
    MatCardModule,
    MarkdownModule,
    ChatToolMessageComponent,
  ],
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
   * Whether this message is a tool call/result
   */
  protected readonly isToolMessage = computed(
    () => this.message().type === 'tool',
  );
}
