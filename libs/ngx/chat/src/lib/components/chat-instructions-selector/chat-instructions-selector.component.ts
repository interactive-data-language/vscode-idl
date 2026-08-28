import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import type {
  ChatInstructionOption,
  ChatInstructionType,
} from '@idl/types/chat';
import { Store } from '@ngxs/store';

import { ChatApiService } from '../../services/chat-api.service';
import {
  SetDefaultInstructions,
  SetSessionInstructions,
} from '../../state/chat.actions';
import { ChatState } from '../../state/chat.state';

/**
 * Component for selecting the system instructions for a chat session
 */
@Component({
  selector: 'ngx-chat-instructions-selector',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './chat-instructions-selector.component.html',
  styleUrl: './chat-instructions-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatInstructionsSelectorComponent implements OnInit {
  /**
   * Available instruction options, loaded from the API
   */
  readonly instructionOptions = signal<ChatInstructionOption[]>([]);

  /**
   * Loading state
   */
  readonly loading = signal(false);

  private readonly store = inject(Store);

  /**
   * Currently selected session, as a signal
   */
  private readonly selectedSession = this.store.selectSignal(
    ChatState.selectedSession,
  );

  /**
   * Disabled when loading instruction options or a response is in progress
   */
  readonly isDisabled = computed(
    () => this.loading() || this.selectedSession()?.status === 'in-progress',
  );

  /**
   * Default instructions, as a signal
   */
  private readonly defaultInstructions = this.store.selectSignal(
    ChatState.defaultInstructions,
  );

  /**
   * Currently selected instructions — from the active session, or the pending selection
   */
  readonly selectedInstructions = computed(
    () => this.selectedSession()?.instructions ?? this.defaultInstructions(),
  );

  private readonly chatApiService = inject(ChatApiService);

  /**
   * Currently selected session ID
   */
  private readonly selectedSessionId = this.store.selectSignal(
    ChatState.selectedSessionId,
  );

  ngOnInit() {
    this.loadInstructionOptions();
  }

  /**
   * Handle instructions selection change
   */
  onInstructionsChange(value: ChatInstructionType) {
    const sessionId = this.selectedSessionId();
    if (sessionId) {
      this.store.dispatch(new SetSessionInstructions(sessionId, value));
    } else {
      this.store.dispatch(new SetDefaultInstructions(value));
    }
  }

  /**
   * Load the configured instruction options from the API and select the
   * default when nothing has been chosen yet
   */
  private loadInstructionOptions() {
    this.loading.set(true);
    this.chatApiService.getChatInstructions().subscribe({
      next: (response) => {
        this.instructionOptions.set(response.options);
        if (
          !this.selectedSessionId() &&
          this.defaultInstructions() === undefined
        ) {
          this.store.dispatch(
            new SetDefaultInstructions(response.defaultInstructions),
          );
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load chat instruction options:', error);
        this.loading.set(false);
      },
    });
  }
}
