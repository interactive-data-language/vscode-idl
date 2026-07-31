import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatSession } from '@idl/types/chat';
import { Store } from '@ngxs/store';
import { nanoid } from 'nanoid';

import {
  AddChatSession,
  AddMessageToSession,
  SelectChatSession,
} from '../../state/chat.actions';
import { ChatState } from '../../state/chat.state';
import { ChatModelSelectorComponent } from '../chat-model-selector/chat-model-selector.component';
import { ChatPromptSelectorComponent } from '../chat-prompt-selector/chat-prompt-selector.component';

/**
 * Input component for typing and sending chat messages.
 * Anchored to the bottom of the chat interface.
 */
@Component({
  selector: 'ngx-chat-input',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ChatPromptSelectorComponent,
    ChatModelSelectorComponent,
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatInputComponent {
  /**
   * ID of the current chat session
   */
  readonly sessionId = input<null | string>(null);

  /**
   * Current input text
   */
  protected readonly inputText = signal('');

  private readonly store = inject(Store);

  /**
   * Disabled when a response is already in progress
   */
  protected readonly isDisabled = computed(
    () =>
      this.store.selectSnapshot(ChatState.selectedSession)?.status ===
      'in-progress',
  );

  private readonly snackBar = inject(MatSnackBar);

  /**
   * Handle keyboard events (Enter to send, Shift+Enter for new line)
   */
  protected onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Send the current message
   */
  protected sendMessage(): void {
    const text = this.inputText().trim();
    if (!text) {
      return;
    }

    let currentSessionId = this.sessionId();

    // If no session exists, create one before sending
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: nanoid(),
        title: 'New Chat',
        createdAt: new Date(),
        lastMessageAt: new Date(),
        prompt: 'envi',
        messageCount: 0,
        status: 'ready',
        messages: [],
      };
      this.store.dispatch(new AddChatSession(newSession));
      this.store.dispatch(new SelectChatSession(newSession.id));
      currentSessionId = newSession.id;
    }

    // Check if there's already a message in progress
    const currentSession = this.store.selectSnapshot(ChatState.selectedSession);
    if (currentSession?.status === 'in-progress') {
      this.snackBar.open(
        'Please wait for the current response to complete',
        'OK',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        },
      );
      return;
    }

    // Dispatch action to add message to the session
    this.store.dispatch(
      new AddMessageToSession(currentSessionId, {
        id: nanoid(),
        type: 'user',
        content: [
          {
            type: 'text',
            payload: text,
          },
        ],
      }),
    );

    // Clear the input
    this.inputText.set('');
  }
}
