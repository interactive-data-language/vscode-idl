import { computed, Injectable, signal } from '@angular/core';
import type { ChatSession } from '@idl/types/chat';

/** Names of the CSS custom highlights styled in the global stylesheet */
const MATCH_HIGHLIGHT = 'chat-find';
const ACTIVE_MATCH_HIGHLIGHT = 'chat-find-active';

/**
 * The registry is map-like, but the DOM typings only expose forEach
 */
function GetHighlights(): Map<string, Highlight> {
  return CSS.highlights as unknown as Map<string, Highlight>;
}

/**
 * Check if a chat title or any user/assistant text contains the (lowercased) query
 */
function SessionMatches(session: ChatSession, query: string): boolean {
  if (session.title.toLowerCase().includes(query)) {
    return true;
  }

  return session.messages.some((message) =>
    message.content.some(
      (item) =>
        (item.type === 'text' || item.type === 'result') &&
        item.payload.toLowerCase().includes(query),
    ),
  );
}

/**
 * Chat search shared by the sidebar and the open chat
 *
 * - The sidebar uses it to filter the list of chats
 * - The open chat uses it to find and highlight matches in the rendered messages
 */
@Injectable({
  providedIn: 'root',
})
export class ChatSearchService {
  /** Index of the match we are focused on */
  readonly activeMatch = signal(0);

  /** Whether the find bar was opened with Ctrl/Cmd+F */
  readonly findOpen = signal(false);

  /** Number of matches in the open chat */
  readonly matchCount = signal(0);

  /** Raw text typed by the user */
  readonly query = signal('');

  /** Lowercased, trimmed text to match against; empty when not searching */
  readonly normalizedQuery = computed(() => this.query().trim().toLowerCase());

  /** Whether we are searching */
  readonly searching = computed(() => this.normalizedQuery() !== '');

  /** Find bar shows when opened by shortcut or when there is search text */
  readonly visible = computed(() => this.findOpen() || this.query() !== '');

  /** Query and chat the current matches belong to; a change restarts at the first match */
  private findKey = '';

  /** DOM ranges for each match, rebuilt whenever the text or query changes */
  private matches: Range[] = [];

  /** Scroll to the active match after the next search, i.e. when the query changes but not while streaming */
  private scrollOnNextFind = false;

  /**
   * Remove all match highlights
   */
  clearHighlights(): void {
    GetHighlights().delete(MATCH_HIGHLIGHT);
    GetHighlights().delete(ACTIVE_MATCH_HIGHLIGHT);
  }

  /**
   * Close the find bar and clear the search
   */
  close(): void {
    this.findOpen.set(false);
    this.query.set('');
  }

  /**
   * Keep only the chats that match the search, or all of them when it's empty
   */
  filterSessions(sessions: ChatSession[]): ChatSession[] {
    const query = this.normalizedQuery();
    return query ? sessions.filter((s) => SessionMatches(s, query)) : sessions;
  }

  /**
   * Find all case-insensitive occurrences of the query in the rendered messages
   *
   * @param root - Element containing the rendered messages
   * @param sessionId - ID of the open chat, so switching chats starts at the first match
   */
  find(root: HTMLElement | undefined, sessionId: string | undefined): void {
    const query = this.normalizedQuery();

    const key = `${sessionId}:${query}`;
    if (key !== this.findKey) {
      this.findKey = key;
      this.activeMatch.set(0);
      this.scrollOnNextFind = true;
    }

    this.matches = [];
    if (root && query) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        // collapsed <details> bodies stay in the DOM, but nobody can see matches there
        const parent = node.parentElement;
        if (
          !parent ||
          parent.closest('details:not([open]) > :not(summary)') ||
          !parent.checkVisibility()
        ) {
          continue;
        }

        const text = (node.textContent ?? '').toLowerCase();
        let index = text.indexOf(query);
        while (index !== -1) {
          const range = new Range();
          range.setStart(node, index);
          range.setEnd(node, index + query.length);
          this.matches.push(range);
          index = text.indexOf(query, index + query.length);
        }
      }
    }

    this.matchCount.set(this.matches.length);
    if (this.activeMatch() >= this.matches.length) {
      this.activeMatch.set(0);
    }

    this.paint(this.scrollOnNextFind);
    // markdown renders after the chat switches, so keep waiting until something matches
    if (this.matches.length > 0) {
      this.scrollOnNextFind = false;
    }
  }

  /**
   * Open the find bar
   */
  open(): void {
    this.findOpen.set(true);
  }

  /**
   * Move to the next or previous match, wrapping around
   */
  step(direction: -1 | 1): void {
    const count = this.matches.length;
    if (count === 0) {
      return;
    }
    this.activeMatch.set((this.activeMatch() + direction + count) % count);
    this.paint(true);
  }

  /**
   * Apply the highlights, and optionally scroll the active match into view
   */
  private paint(scroll: boolean): void {
    this.clearHighlights();
    if (this.matches.length === 0) {
      return;
    }

    const active = this.matches[this.activeMatch()];
    const activeHighlight = new Highlight(active);
    // draw over the regular highlight
    activeHighlight.priority = 1;

    GetHighlights().set(MATCH_HIGHLIGHT, new Highlight(...this.matches));
    GetHighlights().set(ACTIVE_MATCH_HIGHLIGHT, activeHighlight);

    if (scroll) {
      active.startContainer.parentElement?.scrollIntoView({ block: 'center' });
    }
  }
}
