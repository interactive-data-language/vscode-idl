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
import { SetSelectedInstructions } from '../../state/chat.actions';
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
   * Available instruction options from the API
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
   * Currently selected instructions from state
   */
  readonly selectedInstructions = this.store.selectSignal(
    ChatState.selectedInstructions,
  );

  private readonly chatApiService = inject(ChatApiService);

  ngOnInit() {
    this.loadInstructionOptions();
  }

  /**
   * Handle instructions selection change
   */
  onInstructionsChange(value: ChatInstructionType) {
    this.store.dispatch(new SetSelectedInstructions(value));
  }

  /**
   * Load the configured instruction options from the API
   */
  private loadInstructionOptions() {
    this.loading.set(true);
    this.chatApiService.getChatInstructions().subscribe({
      next: (response) => {
        if (
          response.options
            .map((option) => option.id)
            .includes(response.defaultInstructions)
        ) {
          this.store.dispatch(
            new SetSelectedInstructions(response.defaultInstructions),
          );
        } else {
          this.store.dispatch(
            new SetSelectedInstructions(response.options[0].id),
          );
        }
        this.instructionOptions.set(response.options);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load chat instruction options:', error);
        this.loading.set(false);
      },
    });
  }
}
