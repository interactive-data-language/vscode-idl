/**
 * Set the theme mode explicitly
 */
export class SetThemeMode {
  static readonly type = '[Theme] Set Mode';
  constructor(public isDarkMode: boolean) {}
}

/**
 * Toggle between light and dark theme
 */
export class ToggleTheme {
  static readonly type = '[Theme] Toggle';
}

/**
 * Initialize theme from localStorage or system preference
 */
export class InitializeTheme {
  static readonly type = '[Theme] Initialize';
}
