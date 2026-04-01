import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import type { ChatPromptType } from '@idl/types/chat';
import { Store } from '@ngxs/store';

import { SetPendingPrompt, SetSessionPrompt } from '../../state/chat.actions';
import { ChatState } from '../../state/chat.state';

/**
 * Prompt option for the selector
 */
interface PromptOption {
  description: string;
  id: ChatPromptType;
  name: string;
}

/**
 * Static list of available prompt types
 */
const PROMPT_OPTIONS: PromptOption[] = [
  { id: 'none', name: 'None', description: 'No system instructions' },
  { id: 'idl', name: 'IDL', description: 'IDL programming guidelines' },
  { id: 'envi', name: 'ENVI', description: 'ENVI remote sensing guidelines' },
  {
    id: 'idl-envi',
    name: 'IDL + ENVI',
    description: 'Combined IDL and ENVI guidelines',
  },
];

/**
 * Component for selecting the system prompt instructions for a chat session
 */
@Component({
  selector: 'ngx-chat-prompt-selector',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './chat-prompt-selector.component.html',
  styleUrl: './chat-prompt-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatPromptSelectorComponent {
  private readonly store = inject(Store);

  /**
   * Disabled when a response is in progress
   */
  readonly isDisabled = computed(
    () =>
      this.store.selectSnapshot(ChatState.selectedSession)?.status ===
      'in-progress',
  );

  /**
   * Available prompt options
   */
  readonly promptOptions = PROMPT_OPTIONS;

  /**
   * Currently selected prompt type — from the active session, or the pending selection
   */
  readonly selectedPrompt = computed(
    () =>
      this.store.selectSnapshot(ChatState.selectedSession)?.prompt ??
      this.store.selectSnapshot(ChatState.pendingPrompt),
  );

  /**
   * Currently selected session ID
   */
  private readonly selectedSessionId = this.store.selectSignal(
    ChatState.selectedSessionId,
  );

  /**
   * Handle prompt selection change
   */
  onPromptChange(value: ChatPromptType) {
    const sessionId = this.selectedSessionId();
    if (sessionId) {
      this.store.dispatch(new SetSessionPrompt(sessionId, value));
    } else {
      this.store.dispatch(new SetPendingPrompt(value));
    }
  }
}
