import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngxs/store';

import { ChatLayoutService } from '../../services/chat-layout.service';
import { ChatState } from '../../state/chat.state';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatTodoListComponent } from '../chat-todo-list/chat-todo-list.component';
import { ChatWelcomeComponent } from '../chat-welcome/chat-welcome.component';

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
    ChatMessageComponent,
    ChatInputComponent,
    ChatTodoListComponent,
    ChatWelcomeComponent,
  ],
  templateUrl: './chat-content.component.html',
  styleUrl: './chat-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatContentComponent {
  protected readonly chatLayoutService = inject(ChatLayoutService);

  /**
   * Currently selected chat session
   */
  protected readonly selectedSession = inject(Store).selectSignal(
    ChatState.selectedSession,
  );

  /**
   * True when there is no session selected, or the selected session has no messages yet
   */
  protected readonly showWelcome = computed(
    () => (this.selectedSession()?.messages?.length ?? 0) === 0,
  );

  protected readonly todos = computed(
    () => this.selectedSession()?.todos ?? [],
  );

  /**
   * Reference to the input component, used to send example prompts
   */
  private readonly chatInput = viewChild(ChatInputComponent);

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

        if (messages && messages.length > 1) {
          /**
           * Force scroll on user
           *
           * We have empty system messages immediately after sending a user message
           *
           * See addMessageToSession in chat.state.model.ts
           */
          const force =
            messages[messages.length - 2].type === 'user' &&
            messages[messages.length - 1].type === 'system' &&
            messages[messages.length - 1].content[0].payload === '';

          // Use queueMicrotask to wait for DOM update
          queueMicrotask(() => {
            this.scrollToBottom(force);
          });
        }
      },
      { injector: this.injector },
    );
  }

  /**
   * Forward an example prompt selected on the welcome screen to the input component.
   *
   * Prompts containing a newline (e.g. those with a placeholder file path) are
   * placed in the input box for editing instead of being sent immediately.
   */
  protected onPromptSelected(prompt: string): void {
    if (prompt.includes('\n')) {
      this.chatInput()?.setPromptText(prompt);
    } else {
      this.chatInput()?.sendPrompt(prompt);
    }
  }

  /**
   * Smoothly scrolls to the bottom of the message container.
   * Pass force = true to bypass the scroll-position threshold check (e.g. on initial load).
   */
  private scrollToBottom(force = false): void {
    const el = this.messagesArea()?.nativeElement;
    if (!el) return;

    /**
     * Timeout to run as microtask
     */
    setTimeout(() => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;

      // Adjust threshold tolerance (e.g. 150px) or force scroll
      if (force || distanceFromBottom <= 150) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth',
        });
      }
    });
  }
}
