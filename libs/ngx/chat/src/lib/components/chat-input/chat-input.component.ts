import { TextFieldModule } from '@angular/cdk/text-field';
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
import { ChatInstructionsSelectorComponent } from '../chat-instructions-selector/chat-instructions-selector.component';
import { ChatModelSelectorComponent } from '../chat-model-selector/chat-model-selector.component';

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
    TextFieldModule,
    ChatInstructionsSelectorComponent,
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
   * Whether any chat session (not just the selected one) is in-progress.
   * Only a single session can be processed at a time.
   */
  private readonly anySessionInProgress = this.store.selectSignal(
    ChatState.anySessionInProgress,
  );

  /**
   * Disabled when any session already has a response in progress
   */
  protected readonly isDisabled = computed(() => this.anySessionInProgress());

  private readonly snackBar = inject(MatSnackBar);

  /**
   * Sets the input text and sends it, used for example prompts selected from the welcome screen
   */
  sendPrompt(text: string): void {
    this.inputText.set(text);
    this.sendMessage();
  }

  /**
   * Sets the input text without sending it, used for example prompts
   * that require user edits (e.g. a file path) before sending
   */
  setPromptText(text: string): void {
    this.inputText.set(text);
  }

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

    // Check if there's already a message in progress in any session
    if (this.store.selectSnapshot(ChatState.anySessionInProgress)) {
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

    let currentSessionId = this.sessionId();

    // If no session exists, create one before sending
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: nanoid(),
        title: 'New Chat',
        createdAt: new Date(),
        lastMessageAt: new Date(),
        messageCount: 0,
        status: 'ready',
        messages: [],
      };
      this.store.dispatch(new AddChatSession(newSession));
      this.store.dispatch(new SelectChatSession(newSession.id));
      currentSessionId = newSession.id;
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
