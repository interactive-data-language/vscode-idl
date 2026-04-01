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
import { ChatMessage } from '@idl/types/chat';
import { MarkdownModule } from 'ngx-markdown';

/**
 * Component for displaying a single chat message.
 * Styles differently based on message role (user, system, or tool).
 *
 * Requires     MarkdownModule.forRoot(), in main app component
 */
@Component({
  selector: 'ngx-chat-message',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MarkdownModule,
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
   * Parse tool call payload into structured data
   */
  protected readonly toolCallData = computed(() => {
    const msg = this.message();
    if (msg.type !== 'tool') return null;
    const callBlock = msg.content.find((c) => c.type === 'tool_call');
    if (!callBlock) return null;
    try {
      return JSON.parse(callBlock.payload) as {
        name: string;
        args: Record<string, unknown>;
      };
    } catch {
      return null;
    }
  });

  /**
   * Format tool args as a readable string
   */
  protected readonly formattedArgs = computed(() => {
    const data = this.toolCallData();
    if (!data?.args || Object.keys(data.args).length === 0) return null;
    return JSON.stringify(data.args, null, 2);
  });

  /**
   * Get the tool result content block (if any)
   */
  protected readonly toolResult = computed(() => {
    const msg = this.message();
    if (msg.type !== 'tool') return null;
    return (
      msg.content.find(
        (c) => c.type === 'tool_result' || c.type === 'tool_error',
      ) ?? null
    );
  });

  /**
   * Format tool output for display
   */
  protected readonly formattedOutput = computed(() => {
    const result = this.toolResult();
    if (!result || !result.payload) return null;
    try {
      const parsed = JSON.parse(result.payload);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return result.payload;
    }
  });

  /**
   * Check if message is from system
   */
  protected readonly isSystemMessage = computed(
    () => this.message().type === 'system',
  );

  /**
   * Check if message is a tool status message
   */
  protected readonly isToolMessage = computed(
    () => this.message().type === 'tool',
  );
}
