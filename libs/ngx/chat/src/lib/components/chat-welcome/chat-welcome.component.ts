import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ChatApiService } from '../../services/chat-api.service';
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
export class ChatWelcomeComponent implements OnInit {
  /**
   * Emits the prompt text when an example prompt is clicked
   */
  readonly promptSelected = output<string>();

  /**
   * Randomly-selected example prompts to display, split into the full
   * prompt text (emitted on click) and the display text shown on the card
   * (only the text before the newline, if one is present, hiding the
   * placeholder file path that follows it)
   */
  protected readonly examplePrompts = signal<
    { full: string; display: string }[]
  >([]);

  private readonly chatApiService = inject(ChatApiService);

  ngOnInit() {
    this.loadExamplePrompts();
  }

  /**
   * Handle a click on an example prompt
   */
  protected onPromptClick(prompt: string): void {
    this.promptSelected.emit(prompt);
  }

  /**
   * Load example prompts from the API and pick a random subset to display
   */
  private loadExamplePrompts() {
    this.chatApiService.getExamplePrompts().subscribe({
      next: (response) => {
        this.examplePrompts.set(
          GetRandomExamplePrompts(response.prompts, EXAMPLE_PROMPT_COUNT).map(
            (prompt) => {
              // check for new line character (multi-line prompts should only show the first one)
              const newlineIdx = prompt.indexOf('\n');
              return {
                full: prompt,
                display:
                  newlineIdx === -1 ? prompt : prompt.slice(0, newlineIdx),
              };
            },
          ),
        );
      },
      error: (error) => {
        console.error('Failed to load example prompts:', error);
      },
    });
  }
}
