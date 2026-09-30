import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngxs/store';

import { ChatState } from '../../state/chat.state';
import { ChatTokenUsagePopoverComponent } from '../chat-token-usage-popover/chat-token-usage-popover.component';

/**
 * Delay before closing the hover popover, so moving the pointer from the
 * ring into the menu panel doesn't cause it to flicker-close
 */
const CLOSE_DELAY_MS = 200;

/**
 * Circular indicator showing how much of the context window the currently
 * active chat session has used, with a hover popover for exact counts
 */
@Component({
  selector: 'ngx-chat-token-usage-indicator',
  imports: [
    CommonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ChatTokenUsagePopoverComponent,
  ],
  templateUrl: './chat-token-usage-indicator.component.html',
  styleUrl: './chat-token-usage-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTokenUsageIndicatorComponent {
  private readonly store = inject(Store);

  /**
   * Token usage for the currently active chat, defaulting to zero when not yet reported
   */
  protected readonly tokenUsage = this.store.selectSignal(
    ChatState.selectedSessionTokenUsage,
  );

  /**
   * Percentage of the context window currently used, clamped to [0, 100]
   */
  protected readonly percentage = computed(() => {
    const usage = this.tokenUsage();
    return usage.tokenLimit > 0
      ? Math.min(100, (usage.currentTokens / usage.tokenLimit) * 100)
      : 0;
  });

  /**
   * Color tier driving the ring's stroke color
   */
  protected readonly tier = computed<'high' | 'low' | 'medium'>(() => {
    const percentage = this.percentage();
    if (percentage > 90) return 'high';
    if (percentage > 70) return 'medium';
    return 'low';
  });

  /**
   * Pending close timeout, tracked so re-entering the ring/popover can cancel it
   */
  private closeTimeout: ReturnType<typeof setTimeout> | undefined;

  /**
   * Cancels a scheduled close, e.g. when the pointer re-enters the ring or popover
   */
  protected cancelClose(): void {
    if (this.closeTimeout !== undefined) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }
  }

  /**
   * Schedules the menu to close after a short delay, giving the pointer time
   * to move from the ring into the popover panel without flicker
   */
  protected scheduleClose(trigger: MatMenuTrigger): void {
    this.cancelClose();
    this.closeTimeout = setTimeout(() => trigger.closeMenu(), CLOSE_DELAY_MS);
  }
}
