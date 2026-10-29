import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { ChatMessage } from '@idl/types/chat';

import { ChatMessageComponent } from '../chat-message/chat-message.component';

/**
 * Formats a duration in milliseconds as a short label like "12s" or "1m 5s"
 */
function FormatDuration(ms: number): string {
  const seconds = Math.max(1, Math.round(ms / 1000));
  if (seconds < 60) {
    return `${seconds}s`;
  }
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

/**
 * Collapsible block with everything the agent did before its answer:
 * thinking, tool calls, and interim text.
 *
 * Open while the agent is working, collapsed once it is done.
 */
@Component({
  selector: 'ngx-chat-activity-group',
  imports: [MatIconModule, MatProgressSpinnerModule, ChatMessageComponent],
  templateUrl: './chat-activity-group.component.html',
  styleUrl: './chat-activity-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatActivityGroupComponent {
  /**
   * True while the agent is still working, which keeps the block open
   */
  readonly active = input.required<boolean>();

  /**
   * Messages in this group, in order
   */
  readonly messages = input.required<ChatMessage[]>();

  /**
   * Time from the first message starting to the last one finishing, when known
   */
  protected readonly duration = computed(() => {
    const messages = this.messages();
    const starts = messages
      .map((m) => m.startedAt)
      .filter((t): t is number => t !== undefined);
    const ends = messages
      .map((m) => m.endedAt)
      .filter((t): t is number => t !== undefined);
    if (starts.length === 0 || ends.length === 0) {
      return '';
    }
    return FormatDuration(Math.max(...ends) - Math.min(...starts));
  });

  /**
   * Header text: the latest title while working, a summary once done
   */
  protected readonly label = computed(() => {
    const messages = this.messages();
    if (this.active()) {
      const titled = [...messages].reverse().find((m) => m.title);
      return titled?.title ?? 'Working...';
    }
    return this.duration() ? `Worked for ${this.duration()}` : 'Worked';
  });

  /**
   * Number of finished thinking blocks and tool calls in the group
   */
  protected readonly stepsCompleted = computed(
    () =>
      this.messages().filter((m) =>
        m.type === 'thinking'
          ? m.status !== 'in-progress'
          : m.type === 'tool' &&
            m.content.some(
              (c) => c.type === 'tool_result' || c.type === 'tool_error',
            ),
      ).length,
  );
}
