import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import {
  InitializeTheme,
  SetThemeMode,
  ToggleTheme,
} from '../state/theme.actions';
import { ThemeState } from '../state/theme.state';

/**
 * Service for managing the application theme (light/dark mode).
 * Uses NGXS for state management and persists to localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly store = inject(Store);

  /**
   * Signal that tracks whether dark mode is enabled
   */
  readonly isDarkMode = this.store.selectSignal(ThemeState.isDarkMode);

  /**
   * Initialize the theme from localStorage or system preference
   */
  initialize(): void {
    this.store.dispatch(new InitializeTheme());
  }

  /**
   * Set the theme explicitly
   */
  setTheme(isDark: boolean): void {
    this.store.dispatch(new SetThemeMode(isDark));
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    this.store.dispatch(new ToggleTheme());
  }
}
