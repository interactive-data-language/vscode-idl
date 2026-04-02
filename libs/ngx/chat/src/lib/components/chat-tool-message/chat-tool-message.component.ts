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

/**
 * Displays a single tool-call/tool-result chat message.
 * Accepts the raw ChatMessage and derives all display state internally.
 */
@Component({
  selector: 'ngx-chat-tool-message',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './chat-tool-message.component.html',
  styleUrl: './chat-tool-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatToolMessageComponent {
  /**
   * The tool chat message to display. Must have type === 'tool'.
   */
  readonly message = input.required<ChatMessage>();

  /**
   * Parsed tool call data (name + args) from the message content
   */
  protected readonly toolCallData = computed(() => {
    const callBlock = this.message().content.find(
      (c): c is Extract<typeof c, { type: 'tool_call' }> =>
        c.type === 'tool_call',
    );
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
   * Tool args formatted as a readable JSON string, or null if empty
   */
  protected readonly formattedArgs = computed(() => {
    const data = this.toolCallData();
    if (!data?.args || Object.keys(data.args).length === 0) return null;
    return JSON.stringify(data.args, null, 2);
  });

  /**
   * The tool result or error content block, if present
   */
  protected readonly toolResult = computed(() => {
    return (
      this.message().content.find(
        (c): c is Extract<typeof c, { type: 'tool_error' | 'tool_result' }> =>
          c.type === 'tool_result' || c.type === 'tool_error',
      ) ?? null
    );
  });

  /**
   * Tool output formatted as pretty-printed JSON when possible
   */
  protected readonly formattedOutput = computed(() => {
    const result = this.toolResult();
    if (!result?.payload) return null;
    try {
      return JSON.stringify(JSON.parse(result.payload), null, 2);
    } catch {
      return result.payload;
    }
  });
}
