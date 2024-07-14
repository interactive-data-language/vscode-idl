import {
  CleanIDLOutput,
  IDL_EVENT_LOOKUP,
  IDLEvaluateOptions,
  IDLInteractionManager,
  REGEX_NEW_LINE,
} from '@idl/idl';
import { IDL_DEBUG_NOTEBOOK_LOG, IDL_NOTEBOOK_LOG } from '@idl/logger';
import { IDLFileHelper, Sleep } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDLNotebookEmbeddedItems } from '@idl/types/notebooks';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import {
  IDL_LOGGER,
  VSCODE_NOTEBOOK_PRO_DIR,
  VSCODE_PRO_DIR,
} from '@idl/vscode/client';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import {
  DEFAULT_IDL_DEBUG_CONFIGURATION,
  IDL_DEBUG_CONFIGURATION_PROVIDER,
} from '@idl/vscode/debug';
import { IDL_DECORATIONS_MANAGER } from '@idl/vscode/decorations';
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
import { compareVersions } from 'compare-versions';
import copy from 'fast-copy';
import * as vscode from 'vscode';
import { URI } from 'vscode-uri';

import { ExecuteNotebookCell } from './helpers/execute-notebook-cell';
import { ReplaceNotebookPaths } from './helpers/replace-notebook-paths';
import { IDLNotebookController } from './idl-notebook-controller.class';
import {
  DEFAULT_END_CELL_EXECUTION_ACTIONS,
  DEFAULT_NOTEBOOK_EVALUATE_OPTIONS,
  ICurrentCell,
  IEndCellExecutionActions,
} from './idl-notebook-controller.interface';
import { ProcessIDLNotebookEmbeddedItems } from './process-idl-notebook-embedded-items';

/**
 * Controller for notebooks
 */
export class IDLNotebookExecutionManager {
  /**
   * Parent class for notebook controller
   */
  controller: IDLNotebookController;

  /**
   * Actual notebook controller
   */
  readonly vscodeController: vscode.NotebookController;

  /**
   * Execution order?
   */
  _executionOrder = 0;

  /** Are we listening to events from IDL or not? */
  private listening = false;

  /** Reference to our IDL class, manages process and input/output */
  _runtime: IDLInteractionManager;

  /**
   * The current cell that we are executing
   */
  _currentCell?: ICurrentCell;

  /**
   * Track pending executions
   */
  private queue: vscode.NotebookCell[][] = [];

  /**
   * Flag if we are processing our queue or not
   */
  private queueing: vscode.NotebookCell[] | undefined = undefined;

  constructor(
    controller: IDLNotebookController,
    vscodeController: vscode.NotebookController
  ) {
    // create our runtime session - does not immediately start IDL
    this._runtime = new IDLInteractionManager(
      IDL_LOGGER.getLog(IDL_DEBUG_NOTEBOOK_LOG),
      VSCODE_PRO_DIR
    );
    this.listenToEvents();

    // save class references
    this.controller = controller;
    this.vscodeController = vscodeController;
  }

  /**
   * Determine if we are started or not
   */
  isStarted() {
    return this._runtime.isStarted();
  }

  /**
   * Once IDL has started, we listen to events
   */
  private listenToEvents() {
    // return if we are already listening to things
    if (this.listening) {
      return;
    }

    // list for failures to start
    this._runtime.on(IDL_EVENT_LOOKUP.FAILED_START, () => {
      this._IDLCrashed('failed-start');
    });

    // listen for events when we continue processing
    this._runtime.on(IDL_EVENT_LOOKUP.CONTINUE, () => {
      // this.sendEvent(new ContinuedEvent(IDLDebugAdapter.THREAD_ID));
    });

    // listen for stops
    this._runtime.on(IDL_EVENT_LOOKUP.STOP, async (reason, stack) => {
      IDL_LOGGER.log({
        type: 'debug',
        log: IDL_NOTEBOOK_LOG,
        content: [`Stopped because: "${reason}"`, stack],
      });

      await this._endCellExecution(false, { decorateStack: true });
    });

    // listen for debug output
    this._runtime.on(IDL_EVENT_LOOKUP.OUTPUT, async (msg) => {
      await this._appendToCurrentCellOutput(msg);
    });

    // listen for standard out
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_OUT, async (msg) => {
      await this._appendToCurrentCellOutput(msg);
    });

    // pass all stderr output back to the console
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_ERR, async (msg) => {
      await this._appendToCurrentCellOutput(msg);
    });

    // detect when we close IDL
    this._runtime.on(IDL_EVENT_LOOKUP.CLOSED_CLEANLY, async () => {
      await this._endCellExecution(false);
    });

    // listen to end events
    this._runtime.on(IDL_EVENT_LOOKUP.END, async () => {
      IDL_DECORATIONS_MANAGER.reset('notebook');
      await this._endCellExecution(false);
    });

    // listen for IDL crashing
    this._runtime.on(IDL_EVENT_LOOKUP.CRASHED, () => {
      this._IDLCrashed('crash');
    });

    // update flag that we have started listening to events
    this.listening = true;
  }

  /**
   * Method we call when IDL was stopped - not via user, but a likely crash
   */
  private async _IDLCrashed(reason: 'crash' | 'failed-start') {
    if (reason === 'crash') {
      await this._appendToCurrentCellOutput(
        IDL_TRANSLATION.notebooks.errors.crashed
      );
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.crashed],
        alert: IDL_TRANSLATION.notebooks.errors.crashed,
      });
    } else {
      await this._appendToCurrentCellOutput(
        IDL_TRANSLATION.debugger.adapter.failedStart
      );
    }

    // reset decorations
    IDL_DECORATIONS_MANAGER.reset('notebook');

    // mark as failed execution
    await this._endCellExecution(false);
  }

  /**
   * Output to append
   */
  async _appendToCurrentCellOutput(content: string) {
    // log output
    IDL_LOGGER.log({
      log: IDL_NOTEBOOK_LOG,
      type: 'debug',
      content: `IDL output: ${JSON.stringify(content)}`,
    });

    // check what we need to do
    if (this._currentCell !== undefined) {
      // update overall output
      this._currentCell.output = `${this._currentCell.output}${content}`;

      // replace the output for the cell
      await this._replaceCellOutput(
        this._currentCell,
        this._currentCell.output
      );
    }
  }

  /**
   * Replaces the output for a notebook cell and
   * normalizes the results to look the same
   */
  async _replaceCellOutput(
    cell: ICurrentCell,
    content: string,
    forceUpdate = false
  ) {
    // only save output if we are not finished
    if (!cell.finished) {
      // update our cell if we have finished launching
      if (this.isStarted() || forceUpdate) {
        await cell.execution.replaceOutput(
          new vscode.NotebookCellOutput([
            new vscode.NotebookCellOutputItem(
              Buffer.from(
                ReplaceNotebookPaths(
                  this.controller,
                  content.replace(REGEX_NEW_LINE, '\n')
                )
              ),
              'text/plain'
            ),
          ])
        );
      }
    }
  }

  /**
   * Post-evaluation expression
   *
   * You should check the "launched" property before calling this
   */
  private async postCellExecution(magic: boolean, cell?: ICurrentCell) {
    // return if we havent started
    if (!this.isStarted()) {
      return;
    }

    // return from current scope
    await this.evaluate(`retall`);

    // return if no cell
    if (cell === undefined) {
      return;
    }

    // check if we need to look for magic
    if (magic) {
      const output = await this.evaluate(`IDLNotebook.Export`);

      try {
        // get exported items
        const exported: IDLNotebookEmbeddedItems = JSON.parse(
          CleanIDLOutput(output)
        );

        // process the items to embed
        ProcessIDLNotebookEmbeddedItems(cell, exported);
      } catch (err) {
        // return from current scope if error
        await this.evaluate(`retall`);

        // alert user
        IDL_LOGGER.log({
          type: 'error',
          log: IDL_NOTEBOOK_LOG,
          content: [
            IDL_TRANSLATION.notebooks.errors.checkingGraphics,
            err,
            output.replace(/\r*\n/g, '\n'),
          ],
          alert: IDL_TRANSLATION.notebooks.errors.checkingGraphics,
        });
      }
    }
  }

  /**
   * Method that updates flags about the current cell's execution status
   * and sends VSCode an "end" execution event.
   *
   * We also do post-processing and, if we succeeded, we try to retrieve any
   * graphics.
   */
  async _endCellExecution(
    success: boolean,
    inActions: Partial<IEndCellExecutionActions> = {}
  ) {
    /**
     * Get current cell
     */
    const cell = this._currentCell;

    // clear current cell
    this._currentCell = undefined;

    // return if nothing
    if (cell === undefined) {
      return;
    }

    /** Get default actions */
    const actions = { ...DEFAULT_END_CELL_EXECUTION_ACTIONS, ...inActions };

    /**
     * Function to handle edge case of canceling execution right at this point
     */
    const onDidCloseWhileBusy = () => {
      cell.execution.end(success, Date.now());
    };

    // add handler for end
    this._runtime.once(IDL_EVENT_LOOKUP.CLOSED_CLEANLY, onDidCloseWhileBusy);
    this._runtime.once(IDL_EVENT_LOOKUP.END, onDidCloseWhileBusy);
    this._runtime.once(IDL_EVENT_LOOKUP.CRASHED, onDidCloseWhileBusy);

    // check if we need to decorate our call stack
    if (this.isStarted() && actions.decorateStack) {
      // get the current scope
      const stack = await this._runtime.getCurrentStack();

      // get the fsPath for the current cell
      const fsPath = IDLFileHelper.notebookCellUriToFSPath(
        cell.cell.document.uri
      );

      /** Check if any of our scope items are in this notebook cell */
      const ourFile = stack.filter((item) => item.file === fsPath);

      // see if we have a location we stopped on
      if (ourFile.length > 0) {
        // decorate the whole call stack
        for (let i = 0; i < stack.length; i++) {
          // skip non-notebook cells
          if (!IDLFileHelper.isNotebookCell(stack[i].file)) {
            continue;
          }

          /**
           * Add decoration, leave logic for all files in case we need it
           * even though we have a filter up above
           */
          IDL_DECORATIONS_MANAGER.addStackTraceDecorations(
            IDLFileHelper.isNotebookCell(stack[i].file)
              ? IDLFileHelper.notebookCellFSPathToUri(stack[i].file)
              : URI.file(stack[i].file),
            [stack[i].line - 1], // in notebooks, we need zero-based instead of one
            i === 0
          );
        }

        /**
         * Old way of highlighting which just showed where we stopped in our current
         * cell.
         *
         * This code requires a "reverse()" of the call stack or grabbing the last
         * element of the array
         */
        // IDL_DECORATIONS_MANAGER.addStackTraceDecorations(
        //   cell.cell.document.uri,
        //   ourFile.map((item) => item.line - 1) // in notebooks, we need zero-based instead of one
        // );
      }
    }

    /**
     * Wrap in try/catch so we don't have to worry about unhandled promise exceptions
     */
    try {
      if (!cell.finished) {
        // update flag we are finished to hide outputs
        cell.finished = true;

        // update success state
        cell.success = success;

        /**
         * Do post-cell work, change behavior on success (i.e. try to fetch magic).
         *
         * Only run this if launched. If not launched we hang forever, for some reason
         */
        if (success && actions.postExecute && this.isStarted()) {
          await this.postCellExecution(success, cell);
        }
      }
    } catch (err) {
      success = false;
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.failedExecute, err, 1],
        alert: IDL_TRANSLATION.notebooks.errors.failedExecute,
      });
    }

    // always return from current scope
    if (this.isStarted()) {
      /**
       * Commands to run after executing a cell
       *
       * Quiet makes sure that we exclude output that goofs up processing and hides compile statements
       *
       * Magic forces embedding and, for embedding, resets window ID
       */
      const commands = [
        `retall`,
        `!quiet = ${IDL_EXTENSION_CONFIG.notebooks.quietMode ? '1' : '0'}`,
        `!magic.embed = ${
          IDL_EXTENSION_CONFIG.notebooks.embedGraphics ? '1' : '0'
        }`,
        '!magic.window = -1',
        `IDLNotebook.Reset`,
        `retall`,
      ];

      /**
       * Clean things up and get our !magic system variable
       */
      await this.evaluate(commands.join(' & '));
    }

    // remove listener
    this._runtime.off(IDL_EVENT_LOOKUP.CLOSED_CLEANLY, onDidCloseWhileBusy);
    this._runtime.off(IDL_EVENT_LOOKUP.END, onDidCloseWhileBusy);
    this._runtime.off(IDL_EVENT_LOOKUP.CRASHED, onDidCloseWhileBusy);

    // always mark cell as finished before we end
    cell.execution.end(success, Date.now());
    cell.success = success;
  }

  /**
   * After launch and reset, commands we execute
   */
  async _postLaunchAndReset() {
    if (!this.isStarted()) {
      return;
    }

    /**
     * Compile statements when we startup
     */
    const compile = [
      `compile_opt idl2`,
      `!quiet = ${IDL_EXTENSION_CONFIG.notebooks.quietMode ? '1' : '0'}`,
      `!magic.embed = ${
        IDL_EXTENSION_CONFIG.notebooks.embedGraphics ? '1' : '0'
      }`,
      `vscode_notebookInit`,
    ];

    // capture outputs from all commands
    const outputs: string[] = [];

    // set compile opt and be quiet
    outputs.push(await this.evaluate(compile.join(' & ')));

    // see if we need to resolve more
    if (IDL_EXTENSION_CONFIG.notebooks.embedGraphics) {
      /**
       * Handle object graphics and override with our custom method
       */
      await this.evaluate('.compile idlittool__define');
      // outputs.push(await this.evaluate('.compile idlittool__define'));
      outputs.push(
        await this.evaluate(
          `.compile '${VSCODE_NOTEBOOK_PRO_DIR}/idlititool__refreshcurrentview.pro'`
        )
      );

      /**
       * Handle functions graphics and override with our custom method
       */
      await this.evaluate('.compile graphic__define');
      // outputs.push(await this.evaluate('.compile graphic__define'));
      outputs.push(
        await this.evaluate(
          `.compile '${VSCODE_NOTEBOOK_PRO_DIR}/graphic__refresh.pro'`
        )
      );
    }

    /**
     * Check to see if the notebooks started right or not
     */
    if (/%\s*Syntax/gim.test(outputs.join(''))) {
      IDL_LOGGER.log({
        log: IDL_NOTEBOOK_LOG,
        type: 'error',
        content: [
          `Notebook session of IDL failed to start or reset correctly`,
          outputs,
        ],
        alert: IDL_TRANSLATION.notebooks.errors.didntStartRight,
      });
    } else {
      IDL_LOGGER.log({
        log: IDL_NOTEBOOK_LOG,
        type: 'debug',
        content: [
          `IDL post-launch and reset output (should be empty)`,
          outputs,
        ],
      });
    }
  }

  /**
   * Launches IDL for a notebooks session
   */
  async launchIDL(title: string, current?: ICurrentCell): Promise<boolean> {
    // track when we start IDL for notebooks
    VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.RUN_COMMAND, {
      idl_command: 'notebooks.launchIDL',
    });

    // verify that we have the right info, otherwise alert, terminate, and return
    if (IDL_EXTENSION_CONFIG.IDL.directory === '') {
      IDL_LOGGER.log({
        log: IDL_NOTEBOOK_LOG,
        content:
          'The IDL directory has not been configured, cannot run notebook cell',
        type: 'error',
        alert: IDL_TRANSLATION.debugger.adapter.noIDLDir,
        alertMeta: {
          idlLoc: true,
        },
      });

      // return and dont continue
      return false;
    }

    // reset decorations
    IDL_DECORATIONS_MANAGER.reset('notebook');

    // stop listening if we are
    if (this.listening) {
      this._runtime.removeAllListeners();
      this.listening = false;
    }

    // create new instance of runtime
    this._runtime = new IDLInteractionManager(
      IDL_LOGGER.getLog(IDL_DEBUG_NOTEBOOK_LOG),
      VSCODE_PRO_DIR
    );

    // listen to events
    this.listenToEvents();

    // check for a workspace folder
    let folder: vscode.WorkspaceFolder;

    // verify we have a workspace folder opened
    if (vscode.workspace.workspaceFolders !== undefined) {
      // get the folder that we are opening for debugging (first)
      folder =
        vscode.workspace.workspaceFolders.length > 0
          ? vscode.workspace.workspaceFolders[0]
          : undefined;
    }

    // get our configuration
    const config =
      await IDL_DEBUG_CONFIGURATION_PROVIDER.resolveDebugConfiguration(
        folder,
        copy(DEFAULT_IDL_DEBUG_CONFIGURATION)
      );

    /**
     * Create promise to track if we launch or not
     */
    const launchPromise = new Promise<boolean>((res) => {
      // listen for when we started
      this._runtime.once(IDL_EVENT_LOOKUP.IDL_STARTED, async () => {
        // set everything up
        await this._postLaunchAndReset();

        // get information about IDL
        const version = CleanIDLOutput(
          await this._runtime.evaluate('vscode_getIDLInfo', {
            echo: false,
            silent: true,
            idlInfo: false,
          })
        );

        try {
          // attempt to parse the response
          const parsed = JSON.parse(version);

          /**
           * Alert user if they don't have a supported version of IDL
           */
          if (compareVersions(parsed.release, '8.8.0') === -1) {
            if (current !== undefined) {
              current.execution.start(Date.now());
              await this._replaceCellOutput(
                current,
                IDL_TRANSLATION.notebooks.notifications.notValidIDLVersion,
                true
              );
            }

            // stop IDL
            this.stop();

            // alert user we have started IDL for their notebook
            vscode.window.showErrorMessage(
              IDL_TRANSLATION.notebooks.notifications.notValidIDLVersion
            );

            // reject
            res(false);

            // return and dont do anything
            return;
          }

          // update kernel text
          this.vscodeController.label = `IDL ${parsed.release}`;

          // send usage metric
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.IDL_STARTUP, {
            idl_version: parsed.release,
            idl_type: parsed.dir.toLowerCase().includes('envi')
              ? 'idl-envi'
              : 'idl',
          });
        } catch (err) {
          console.log(err);
          // IDL_LOGGER.log({
          //   type: 'error',
          //   log: IDL_NOTEBOOK_LOG,
          //   content: [IDL_TRANSLATION.notebooks.notifications.startedIDLKernel, err],
          //   alert: IDL_TRANSLATION.debugger.errors.idlDetails,
          // });
        }

        // resolve promise
        res(true);
      });

      // listen for failures to launch
      this._runtime.once(IDL_EVENT_LOOKUP.FAILED_START, () => {
        if (!this.isStarted()) {
          // emit event that we failed to start - handled status bar update
          this._IDLCrashed('failed-start');
          res(false);
        }
      });
    });

    // update folder for PRO Code
    this._runtime.setVscodeProDir(VSCODE_PRO_DIR);

    // start IDL
    this._runtime.start(config);

    // show startup progress
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title,
      },
      () => {
        return launchPromise;
      }
    );

    // make sure cells are done executing
    this._endCellExecution(false, { postExecute: false });

    // return a prom
    return launchPromise;
  }

  /**
   * TODO: What all do we need to do here?
   */
  async dispose(): Promise<void> {
    this._runtime.stop();

    // stop listening
    if (this.listening) {
      this._runtime.removeAllListeners();
    }
  }

  /**
   * Execute cell
   */
  async _executeCell(cell: vscode.NotebookCell): Promise<ICurrentCell> {
    return ExecuteNotebookCell(this, cell);
  }

  /**
   * Set failed execution for all cells so VSCode knows that we stopped
   */
  private setExecutionFailures(cells: vscode.NotebookCell[]) {
    for (let i = 0; i < cells.length; i++) {
      // // create execution
      // const execution = this._controller.createNotebookCellExecution(cells[i]);
      // // set failed execution
      // execution.end(false);
    }
  }

  /**
   * Clears our queue
   */
  private clearQueue() {
    // remove from queue
    const removed = this.queue.splice(0, this.queue.length);

    // set as failed executions
    for (let i = 0; i < removed.length; i++) {
      this.setExecutionFailures(removed[i]);
    }

    // check if we have cells to clear execution for
    if (this.queueing !== undefined) {
      if (this.queueing.length !== 0) {
        this.setExecutionFailures(this.queueing);
      }
    }

    // update flag for queue or not
    this.queueing = undefined;
  }

  /**
   * Actually execute our notebook cells
   */
  async _doExecute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _notebook: vscode.NotebookDocument,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _controller: vscode.NotebookController
  ): Promise<void> {
    /**
     * Get next cells to process
     */
    const cells = this.queue.shift();

    // if nothing to process, return
    if (cells === undefined) {
      this.queueing = undefined;
      return;
    }

    // set queueing flag
    this.queueing = cells;

    /** Get the next cell to process */
    let cell = this.queueing.shift();

    while (cell !== undefined) {
      try {
        // attempt to run cell
        const current = await this._executeCell(cell);

        /**
         * Short pause so APIs catch up
         *
         * This also helps ensure notebooks always run consistently
         *
         * Without this, tests have intermittent failures
         */
        await Sleep(100);

        // execute cell and, if we dont succeed, then stop and return
        if (!current.finished || !current.success) {
          // clear queue
          this.clearQueue();

          // return
          return;
        }
      } catch (err) {
        // clear queue
        this.clearQueue();

        // alert user
        if (err !== 'Canceled') {
          IDL_LOGGER.log({
            type: 'error',
            log: IDL_NOTEBOOK_LOG,
            content: [
              IDL_TRANSLATION.notebooks.errors.failedExecute,
              err,
              'Within _doExecute',
            ],
            alert: IDL_TRANSLATION.notebooks.errors.failedExecute,
          });
        }

        // return
        return;
      }

      // get the next cell
      cell = this.queueing.shift();
    }

    // check if we have more cells to process
    this._doExecute(_notebook, _controller);
  }

  /**
   * Execute notebook cells wrapped around a queue
   */
  async _execute(
    cells: vscode.NotebookCell[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _notebook: vscode.NotebookDocument,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _controller: vscode.NotebookController
  ): Promise<void> {
    try {
      this.queue.push(cells);

      /**
       * Return if we are processing our queue
       */
      if (this.queueing !== undefined) {
        return;
      }

      await this._doExecute(_notebook, _controller);
    } catch (err) {
      // do nothing, should be caught elsewhere
    }
  }

  /**
   * If IDL has started, evaluates a command in IDL
   *
   * You should check the "launched" property before calling this
   */
  async evaluate(command: string, inOptions: IDLEvaluateOptions = {}) {
    // return if we havent started
    if (!this.isStarted()) {
      return '';
    }

    /** Get execute options */
    const options = { ...DEFAULT_NOTEBOOK_EVALUATE_OPTIONS, ...inOptions };

    /** Have IDL execute */
    const res = await this._runtime.evaluate(command, options);

    // check for errors
    this._runtime.errorCheck(res);

    // return result
    return res;
  }

  /**
   * Reset our IDL session
   */
  async reset() {
    if (!this.isStarted()) {
      return;
    }

    // stop
    await this.stop();

    // short pause, otherwise we fail to start and get in a weird state
    await Sleep(100);

    // launch IDL again without the notification
    await this.launchIDL(IDL_TRANSLATION.notebooks.notifications.resettingIDL);

    // error if we didnt launch
    if (!this.isStarted()) {
      throw new Error('Failed to start IDL');
    }
  }

  /**
   * Stop kernel execution
   */
  async stop() {
    // clear our queue
    this.clearQueue();

    // reset decorations
    IDL_DECORATIONS_MANAGER.reset('notebook');

    // reset the label
    this.vscodeController.label = `IDL`;

    // stop IDL if we can
    if (this.isStarted()) {
      this._runtime.stop();
    }
  }
}
