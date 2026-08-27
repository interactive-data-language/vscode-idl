import { inject, Injectable, signal } from '@angular/core';
import type { ExamplePrompt } from '@idl/types/chat';
import { firstValueFrom } from 'rxjs';

import { ChatApiService } from './chat-api.service';

/**
 * Loads the server-configured example prompts once on app launch and makes
 * them available to any component that wants to display a random subset.
 */
@Injectable({ providedIn: 'root' })
export class ExamplePromptsService {
  /** All example prompts loaded from the server */
  readonly prompts = signal<ExamplePrompt[]>([]);

  private readonly chatApiService = inject(ChatApiService);

  /**
   * Fetches the example prompts from the server. Safe to call once during
   * app initialization — failures are swallowed so the app can still start.
   */
  async init(): Promise<void> {
    try {
      const resp = await firstValueFrom(
        this.chatApiService.getExamplePrompts(),
      );
      this.prompts.set(resp.prompts);
    } catch (error) {
      console.error('Failed to load example prompts:', error);
    }
  }
}
