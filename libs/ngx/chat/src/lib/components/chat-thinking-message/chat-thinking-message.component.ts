import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { ChatMessage } from '@idl/types/chat';

import { ChatMarkdownRendererComponent } from '../chat-markdown-renderer/chat-markdown-renderer.component';

/**
 * Displays a single extended-thinking/reasoning chat message.
 * Starts collapsed, labelled "Thinking..." while streaming and "Thought" once done.
 */
@Component({
  selector: 'ngx-chat-thinking-message',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ChatMarkdownRendererComponent,
  ],
  templateUrl: './chat-thinking-message.component.html',
  styleUrl: './chat-thinking-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatThinkingMessageComponent {
  /**
   * The thinking chat message to display. Must have type === 'thinking'.
   */
  readonly message = input.required<ChatMessage>();

  /**
   * The accumulated reasoning text streamed so far
   */
  protected readonly content = computed(() =>
    (this.message().content[0]?.payload || '').trim(),
  );

  /**
   * Whether the reasoning block is still streaming
   */
  protected readonly isInProgress = computed(
    () => this.message().status === 'in-progress',
  );
}
