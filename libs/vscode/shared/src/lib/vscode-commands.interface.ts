/**
 * Useful VSCode commands that we want to remember
 */
export const VSCODE_COMMANDS = {
  /**
   * Cl;oses the currently active editor window
   */
  CLOSE_EDITOR: 'workbench.action.closeActiveEditor',
  /**
   * Evaluates text in the debug console
   */
  EVALUATE_IN_DEBUG_CONSOLE: 'editor.debug.action.selectionToRepl',
  /**
   * Opens a file using the native VSCode Markdown Preview
   */
  MARKDOWN_PREVIEW: 'markdown.showPreview',
  /**
   * Opens a file using the native VSCode Markdown Preview
   */
  MARKDOWN_RENDER: 'markdown.api.render',
  /**
   * To open a file in vscode
   */
  OPEN_FILE: 'vscode.open',

  /**
   * Open settings UI in VSCode
   */
  OPEN_SETTINGS: 'workbench.action.openSettings',
  /**
   * Command to show the debug console.
   *
   * Can find this command by:
   * 1. Open commands
   * 2. "View: Toggle Debug Console"
   * 3. Click on settings on the right
   * 4. Command is located in the "when" column
   */
  SHOW_DEBUG_CONSOLE: 'workbench.debug.action.toggleRepl',
  /**
   * Continue button when debugging
   */
  DEBUG_CONTINUE: 'workbench.action.debug.continue',
  /**
   * Step into routine when debugging
   */
  DEBUG_STEP_INTO: 'workbench.action.debug.stepInto',

  /**
   * Step over when debugging
   */
  DEBUG_STEP_OVER: 'workbench.action.debug.stepOver',
  /**
   * Step out of routine when debugging
   */
  DEBUG_STEP_OUT: 'workbench.action.debug.stepOut',
  /**
   * Reloads/refreshes our window
   */
  RELOAD_WINDOW: 'workbench.action.reloadWindow',
};
