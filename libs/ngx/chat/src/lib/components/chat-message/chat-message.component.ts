import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChatMessage } from '@idl/types/chat';

import { ChatMarkdownRendererComponent } from '../chat-markdown-renderer/chat-markdown-renderer.component';
import { ChatThinkingMessageComponent } from '../chat-thinking-message/chat-thinking-message.component';
import { ChatToolMessageComponent } from '../chat-tool-message/chat-tool-message.component';

/**
 * Component for displaying a single chat message.
 * Delegates tool messages to ChatToolMessageComponent.
 * Styles differently based on message role (user or system).
 */
@Component({
  selector: 'ngx-chat-message',
  imports: [
    CommonModule,
    MatCardModule,
    ChatMarkdownRendererComponent,
    ChatToolMessageComponent,
    ChatThinkingMessageComponent,
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
   * Whether generation for this message was cancelled by the user mid-stream
   */
  protected readonly isStopped = computed(
    () => this.message().status === 'stopped',
  );

  /**
   * Whether this message is an extended-thinking/reasoning block
   */
  protected readonly isThinkingMessage = computed(
    () => this.message().type === 'thinking',
  );

  /**
   * Whether this message is a tool call/result
   */
  protected readonly isToolMessage = computed(
    () => this.message().type === 'tool',
  );
}
