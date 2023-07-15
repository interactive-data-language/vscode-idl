import {
  IDL_LANGUAGE_NAME,
  IDL_NOTEBOOK_CONTROLLER_NAME,
  IDL_NOTEBOOK_CONTROLLER_TRANSLATION_NAME,
  IDL_NOTEBOOK_NAME,
} from '@idl/shared';
import * as vscode from 'vscode';

/**
 * Controller for notebooks
 */
export class IDLNotebookController {
  /**
   * ID of our controller
   */
  readonly controllerId = IDL_NOTEBOOK_CONTROLLER_NAME;

  /**
   * Type of notebook
   */
  readonly notebookType = IDL_NOTEBOOK_NAME;

  /**
   * Label for our controller
   */
  readonly label = IDL_NOTEBOOK_CONTROLLER_TRANSLATION_NAME;

  /**
   * Languages we support
   */
  readonly supportedLanguages = [IDL_LANGUAGE_NAME];

  /**
   * Actual notebook controller
   */
  private readonly _controller: vscode.NotebookController;

  /**
   * Execution order?
   */
  private _executionOrder = 0;

  /**
   * The current cell that we are executing
   */
  private _executingThisCell?: vscode.NotebookCell;

  constructor() {
    this._controller = vscode.notebooks.createNotebookController(
      this.controllerId,
      this.notebookType,
      this.label
    );

    this._controller.supportedLanguages = this.supportedLanguages;
    this._controller.supportsExecutionOrder = true;
    this._controller.executeHandler = this._execute.bind(this);
  }

  /**
   * TODO: What all do we need to do here?
   */
  dispose(): void {
    this._controller.dispose();
  }

  /**
   * Execute cell
   */
  private async _executeCell(cell: vscode.NotebookCell): Promise<void> {
    // save cell as current
    this._executingThisCell = cell;

    /**
     * Create cell execution data
     */
    const execution = this._controller.createNotebookCellExecution(cell);

    // set cell order
    execution.executionOrder = ++this._executionOrder;

    // set start time
    execution.start(Date.now());

    /* Do some execution here; not implemented */

    /**
     * Update the output
     *
     * TODO: Do this live and capture output from IDL on-the-fly like we do with debugging
     */
    execution.replaceOutput([
      new vscode.NotebookCellOutput([
        vscode.NotebookCellOutputItem.text('Dummy output text!'),
      ]),
    ]);

    // set finish time
    execution.end(true, Date.now());

    // clear that we are executing this cell
    this._executingThisCell = undefined;
  }

  /**
   * Execute notebook cells
   */
  private _execute(
    cells: vscode.NotebookCell[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _notebook: vscode.NotebookDocument,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _controller: vscode.NotebookController
  ): void {
    for (let i = 0; i < cells.length; i++) {
      this._executeCell(cells[i]);
    }
  }
}
