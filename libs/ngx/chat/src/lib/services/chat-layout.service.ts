import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

/** Viewport width below which the sidebar collapses into a full-screen overlay */
const MOBILE_BREAKPOINT = '(max-width: 599.98px)';

/**
 * Tracks responsive layout state for the chat UI (mobile sidebar overlay behavior).
 */
@Injectable({
  providedIn: 'root',
})
export class ChatLayoutService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /** Whether the viewport is narrow enough to use the mobile (full-screen overlay) layout */
  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe(MOBILE_BREAKPOINT)
      .pipe(map((state) => state.matches)),
    { initialValue: this.breakpointObserver.isMatched(MOBILE_BREAKPOINT) },
  );

  /** Whether the full-screen chat list overlay is open (mobile layout only) */
  readonly mobileListOpen = signal(false);

  /**
   * Close the full-screen chat list overlay, revealing the chat content
   */
  closeList(): void {
    this.mobileListOpen.set(false);
  }

  /**
   * Open the full-screen chat list overlay
   */
  openList(): void {
    this.mobileListOpen.set(true);
  }

  /**
   * Open or close the list
   */
  toggleList(): void {
    this.mobileListOpen.set(!this.mobileListOpen());
  }
}
