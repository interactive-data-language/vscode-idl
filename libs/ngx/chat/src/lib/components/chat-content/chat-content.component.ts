import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngxs/store';

import { ChatState } from '../../state/chat.state';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';

/**
 * Content component displaying the chat messages.
 * Shows the selected chat session or a welcome message.
 */
@Component({
  selector: 'ngx-chat-content',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    ChatMessageComponent,
    ChatInputComponent,
  ],
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatContentComponent {
  /**
   * Currently selected chat session
   */
  protected readonly selectedSession = inject(Store).selectSignal(
    ChatState.selectedSession,
  );

  private readonly injector = inject(Injector);

  /**
   * Reference to the messages area for scrolling
   */
  private readonly messagesArea =
    viewChild<ElementRef<HTMLDivElement>>('messagesArea');

  private readonly store = inject(Store);

  constructor() {
    // Auto-scroll to bottom when messages change
    effect(
      () => {
        const session = this.selectedSession();
        const messages = session?.messages;

        if (messages && messages.length > 0) {
          // Use queueMicrotask to wait for DOM update
          queueMicrotask(() => {
            this.scrollToBottom();
          });
        }
      },
      { injector: this.injector },
    );
  }

  /**
   * Scroll the messages area to the bottom
   */
  private scrollToBottom(): void {
    const element = this.messagesArea()?.nativeElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
