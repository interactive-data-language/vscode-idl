import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { Store } from '@ngxs/store';
import { nanoid } from 'nanoid';

import { AddMessageToSession } from '../../state/chat.actions';
import { ChatState } from '../../state/chat.state';

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

  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);

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
    const currentSessionId = this.sessionId();

    if (!text || !currentSessionId) {
      return;
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
        role: 'user',
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
