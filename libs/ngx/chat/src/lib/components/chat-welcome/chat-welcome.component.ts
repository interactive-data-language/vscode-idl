import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ExamplePromptsService } from '../../services/example-prompts.service';
import { GetRandomExamplePrompts } from './get-random-example-prompts';

/**
 * Number of example prompts to show at once
 */
const EXAMPLE_PROMPT_COUNT = 4;

/**
 * Welcome screen shown when a chat session has no messages yet.
 * Displays a set of example prompts that can be clicked to start a conversation.
 */
@Component({
  selector: 'ngx-chat-welcome',
  imports: [CommonModule, MatIconModule],
  templateUrl: './chat-welcome.component.html',
  styleUrl: './chat-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatWelcomeComponent {
  /**
   * Emits the prompt text when an example prompt is clicked
   */
  readonly promptSelected = output<string>();

  private readonly examplePromptsService = inject(ExamplePromptsService);

  /**
   * Randomly-selected example prompts to display, split into the full
   * prompt text (emitted on click) and the display text shown on the card
   * (only the text before the newline, if one is present, hiding the
   * placeholder file path that follows it)
   */
  protected readonly examplePrompts = computed(() =>
    GetRandomExamplePrompts(
      this.examplePromptsService.prompts(),
      EXAMPLE_PROMPT_COUNT,
    ).map((prompt) => {
      // check for new line character (multi-line prompts should only show the first one)
      const newlineIdx = prompt.indexOf('\n');
      return {
        full: prompt,
        display: newlineIdx === -1 ? prompt : prompt.slice(0, newlineIdx),
      };
    }),
  );

  /**
   * Handle a click on an example prompt
   */
  protected onPromptClick(prompt: string): void {
    this.promptSelected.emit(prompt);
  }
}
