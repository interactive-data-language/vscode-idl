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
   * Formats a notebook
   */
  FORMAT_NOTEBOOK: 'notebook.format',
  /**
   * Opens a file using the native VSCode Markdown Preview
   */
  MARKDOWN_PREVIEW: 'markdown.showPreview',
  /**
   * Opens a file using the native VSCode Markdown Preview
   */
  MARKDOWN_RENDER: 'markdown.api.render',
  /**
   * Clear outputs from notebook cells
   */
  NOTEBOOK_CLEAR_OUTPUTS: 'notebook.clearAllCellsOutputs',
  /**
   * Delete current cell
   */
  NOTEBOOK_CELL_DELETE: 'notebook.cell.delete',
  /**
   * Clear focus on top cell
   */
  NOTEBOOK_FOCUS_TOP: 'notebook.focusTop',
  /**
   * Add code cell to top
   */
  NOTEBOOK_INSERT_CODE_CELL_AT_TOP: 'notebook.cell.insertCodeCellAtTop',
  /**
   * Add code cell below
   */
  NOTEBOOK_INSERT_CODE_CELL_AT_BOTTOM: 'notebook.cell.insertCodeCellBelow',
  /**
   * Run all notebook cells
   */
  NOTEBOOK_RUN_ALL: 'notebook.execute',
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
   * Stop debugging
   */
  DEBUG_STOP: 'workbench.action.debug.stop',
  /**
   * Reloads/refreshes our window
   */
  RELOAD_WINDOW: 'workbench.action.reloadWindow',
  /**
   * Save active editor
   */
  SAVE_EDITOR: 'workbench.action.files.save',
};
