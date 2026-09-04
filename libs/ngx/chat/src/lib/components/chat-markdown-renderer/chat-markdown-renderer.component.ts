import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

/**
 * Component for rendering markdown content with consistent styling.
 *
 * Requires MarkdownModule.forRoot() in the main app component.
 */
@Component({
  selector: 'ngx-chat-markdown-renderer',
  imports: [CommonModule, MarkdownModule],
  templateUrl: './chat-markdown-renderer.component.html',
  styleUrl: './chat-markdown-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatMarkdownRendererComponent {
  /**
   * The markdown content to render
   */
  readonly data = input.required<string>();
}
