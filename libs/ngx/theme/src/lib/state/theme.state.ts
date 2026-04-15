import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { InitializeTheme, SetThemeMode, ToggleTheme } from './theme.actions';
import { ThemeStateModel } from './theme.model';

/**
 * Default state for the theme feature
 */
const defaultState: ThemeStateModel = {
  isDarkMode: false,
};

@State<ThemeStateModel>({
  name: 'theme',
  defaults: defaultState,
})
@Injectable()
export class ThemeState {
  /**
   * Get whether dark mode is enabled
   */
  @Selector()
  static isDarkMode(state: ThemeStateModel): boolean {
    return state.isDarkMode;
  }

  /**
   * Initialize theme from system preference
   */
  @Action(InitializeTheme)
  initializeTheme(ctx: StateContext<ThemeStateModel>) {
    // Use system preference
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    ctx.patchState({ isDarkMode });
    this.applyTheme(isDarkMode);
  }

  /**
   * Set the theme mode explicitly
   */
  @Action(SetThemeMode)
  setThemeMode(ctx: StateContext<ThemeStateModel>, action: SetThemeMode) {
    ctx.patchState({ isDarkMode: action.isDarkMode });
    this.applyTheme(action.isDarkMode);
  }

  /**
   * Toggle between light and dark theme
   */
  @Action(ToggleTheme)
  toggleTheme(ctx: StateContext<ThemeStateModel>) {
    const state = ctx.getState();
    const newMode = !state.isDarkMode;
    ctx.patchState({ isDarkMode: newMode });
    this.applyTheme(newMode);
  }

  /**
   * Apply the theme to the document body
   */
  private applyTheme(isDark: boolean): void {
    const body = document.body;

    if (isDark) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}
