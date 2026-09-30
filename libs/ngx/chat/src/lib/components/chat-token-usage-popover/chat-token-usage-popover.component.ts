import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChatTokenUsage } from '@idl/types/chat';

/**
 * Displays the exact token counts behind the usage indicator's percentage
 */
@Component({
  selector: 'ngx-chat-token-usage-popover',
  imports: [CommonModule, MatCardModule],
  templateUrl: './chat-token-usage-popover.component.html',
  styleUrl: './chat-token-usage-popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTokenUsagePopoverComponent {
  /**
   * Token usage snapshot to display
   */
  readonly tokenUsage = input.required<ChatTokenUsage>();

  /**
   * Percentage of the context window currently used, rounded for display
   */
  readonly percentage = computed(() => {
    const usage = this.tokenUsage();
    return usage.tokenLimit > 0
      ? Math.round((usage.currentTokens / usage.tokenLimit) * 100)
      : 0;
  });

  /**
   * Formats a token count to a rounded 'k' format (e.g. 17100 -> '17.1k')
   */
  protected formatTokens(value: number): string {
    return FormatTokens(value);
  }
}

/**
 * Formats a token count to a rounded 'k' format (e.g., 17100 -> '17.1k').
 */
export function FormatTokens(value: number): string {
  if (value < 1000) {
    return value.toString();
  }
  const rounded = Math.round(value / 100) / 10;
  return `${rounded}k`;
}
