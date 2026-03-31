import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { type AvailableModel, DEFAULT_MODELS } from '@idl/types/chat';
import { Store } from '@ngxs/store';

import { ChatApiService } from '../../services/chat-api.service';
import { SetSelectedModel } from '../../state/chat.actions';
import { ChatState } from '../../state/chat.state';

/**
 * Component for selecting the AI model for chat completions
 */
@Component({
  selector: 'ngx-chat-model-selector',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './chat-model-selector.component.html',
  styleUrl: './chat-model-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatModelSelectorComponent implements OnInit {
  /**
   * Available models from the API
   */
  readonly availableModels = signal<AvailableModel[]>([]);
  /**
   * Loading state
   */
  readonly loading = signal(false);

  private readonly store = inject(Store);

  /**
   * Currently selected model from state
   */
  readonly selectedModel = this.store.selectSignal(ChatState.selectedModel);

  private readonly chatApiService = inject(ChatApiService);

  ngOnInit() {
    this.loadAvailableModels();
  }

  /**
   * Handle model selection change
   */
  onModelChange(modelId: string) {
    this.store.dispatch(new SetSelectedModel(modelId));
  }

  /**
   * Load available models from the API
   */
  private loadAvailableModels() {
    this.loading.set(true);
    this.chatApiService.getAvailableModels().subscribe({
      next: (response) => {
        this.availableModels.set(response.models);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load models:', error);

        // update loading state
        this.loading.set(false);

        // Set default models as fallback
        this.availableModels.set(DEFAULT_MODELS);
      },
    });
  }
}
