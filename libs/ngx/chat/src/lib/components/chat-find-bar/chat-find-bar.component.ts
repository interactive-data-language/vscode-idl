import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatSession } from '@idl/types/chat';

import { ChatSearchService } from '../../services/chat-search.service';

/**
 * Find bar for the open chat, positioned in the top right of its parent
 *
 * Opens with Ctrl/Cmd+F or when the sidebar search has text, and highlights
 * matches inside the element passed as `root`.
 */
@Component({
  selector: 'ngx-chat-find-bar',
  host: { '(document:keydown)': 'onDocumentKeydown($event)' },
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './chat-find-bar.component.html',
  styleUrl: './chat-find-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatFindBarComponent {
  /** Element containing the rendered messages to search */
  readonly root = input<HTMLElement | undefined>();

  /** Open chat; searched again whenever it changes so streamed text is found */
  readonly session = input<ChatSession | null | undefined>();

  protected readonly search = inject(ChatSearchService);

  private readonly findInput =
    viewChild<ElementRef<HTMLInputElement>>('findInput');

  private readonly injector = inject(Injector);

  constructor() {
    // Re-run the search after the DOM updates (query or new/streamed messages)
    effect(
      () => {
        this.search.normalizedQuery();
        this.session();
        afterNextRender(
          () => this.search.find(this.root(), this.session()?.id),
          { injector: this.injector },
        );
      },
      { injector: this.injector },
    );

    // markdown renders asynchronously, so search again whenever the messages' DOM changes
    effect(
      (onCleanup) => {
        const root = this.root();
        if (!root || !this.search.searching()) {
          return;
        }

        const observer = new MutationObserver(() =>
          this.search.find(root, this.session()?.id),
        );
        observer.observe(root, {
          attributeFilter: ['open'],
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
        });
        onCleanup(() => observer.disconnect());
      },
      { injector: this.injector },
    );

    inject(DestroyRef).onDestroy(() => this.search.clearHighlights());
  }

  /**
   * Open the find bar on Ctrl/Cmd+F instead of the (absent) browser find
   */
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      this.search.open();
      setTimeout(() => {
        this.findInput()?.nativeElement.focus();
        this.findInput()?.nativeElement.select();
      });
    }
  }

  /**
   * Update the shared search text
   */
  protected onInput(event: Event): void {
    this.search.query.set((event.target as HTMLInputElement).value);
  }

  /**
   * Enter goes to the next match (Shift+Enter previous), Escape closes
   */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search.step(event.shiftKey ? -1 : 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.search.close();
    }
  }
}
