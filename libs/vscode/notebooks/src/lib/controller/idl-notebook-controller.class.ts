import { CancellationToken } from '@idl/cancellation-tokens';
import {
  CleanIDLOutput,
  IDL,
  IDL_EVENT_LOOKUP,
  REGEX_NEW_LINE,
} from '@idl/idl';
import { IDL_DEBUG_NOTEBOOK_LOG, IDL_NOTEBOOK_LOG } from '@idl/logger';
import { NOTEBOOK_FOLDER } from '@idl/notebooks/shared';
import { IDLNotebookEmbeddedItems } from '@idl/notebooks/types';
import { Parser } from '@idl/parser';
import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import { TreeBranchToken } from '@idl/parsing/syntax-tree';
import { IsSingleLine } from '@idl/parsing/syntax-validators';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import {
  CleanPath,
  IDL_LANGUAGE_NAME,
  IDL_NOTEBOOK_CONTROLLER_NAME,
  IDL_NOTEBOOK_LANGUAGE_NAME,
  Sleep,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
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
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
import copy from 'fast-copy';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import * as vscode from 'vscode';

import { ICurrentCell } from './idl-notebook-controller.interface';
import { ProcessIDLNotebookEmbeddedItems } from './process-idl-notebook-embedded-items';

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
  readonly notebookType = IDL_NOTEBOOK_LANGUAGE_NAME;

  /**
   * Label for our controller
   *
   * Can't use translation ( but we have it anyways in case it works in the future)
   */
  readonly label = 'IDL'; // IDL_NOTEBOOK_CONTROLLER_TRANSLATION_NAME;

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

  /** Are we listening to events from IDL or not? */
  private listening = false;

  /** Reference to our IDL class, manages process and input/output */
  _runtime: IDL;

  /**
   * The current cell that we are executing
   */
  private _currentCell?: ICurrentCell;

  /**
   * Track pending executions
   */
  private queue: vscode.NotebookCell[][] = [];

  /**
   * Flag if we are processing our queue or not
   */
  private queueing: vscode.NotebookCell[] | undefined = undefined;

  constructor() {
    // create our runtime session - does not immediately start IDL
    this._runtime = new IDL(
      IDL_LOGGER.getLog(IDL_DEBUG_NOTEBOOK_LOG),
      VSCODE_PRO_DIR
    );
    this.listenToEvents();

    // create notebook controller
    this._controller = vscode.notebooks.createNotebookController(
      this.controllerId,
      this.notebookType,
      this.label
    );

    // update notebook controller properties
    this._controller.supportedLanguages = this.supportedLanguages;
    this._controller.supportsExecutionOrder = true;
    this._controller.executeHandler = this._execute.bind(this);
  }

  /**
   * Determine if we are started or not
   */
  isStarted() {
    return this._runtime.started;
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
      await this._endCellExecution(false);
      // this.stopped = {
      //   reason,
      //   stack,
      // };
      // this.sendEvent(
      //   new StoppedEvent(this.stopped.reason, IDLDebugAdapter.THREAD_ID)
      // );
    });

    // listen for debug output
    this._runtime.on(IDL_EVENT_LOOKUP.OUTPUT, (msg) => {
      this._appendCellOutput(msg);
    });

    // listen for standard out
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_OUT, (msg) => {
      this._appendCellOutput(msg);
    });

    // pass all stderr output back to the console
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_ERR, (msg) => {
      this._appendCellOutput(msg);
    });

    // detect when we close IDL
    this._runtime.on(IDL_EVENT_LOOKUP.CLOSED_CLEANLY, async () => {
      await this._endCellExecution(false);
    });

    // listen to end events
    this._runtime.on(IDL_EVENT_LOOKUP.END, async () => {
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
      this._appendCellOutput(IDL_TRANSLATION.notebooks.errors.crashed);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.crashed],
        alert: IDL_TRANSLATION.notebooks.errors.crashed,
      });
    } else {
      this._appendCellOutput(IDL_TRANSLATION.debugger.adapter.failedStart);
    }

    // mark as failed execution
    await this._endCellExecution(false);
  }

  /**
   * Output to append
   */
  private _appendCellOutput(content: string) {
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

      // only save output if we are not finished
      if (!this._currentCell.finished) {
        // update our cell if we have finished launching
        if (this.isStarted()) {
          this._currentCell.execution.replaceOutput(
            new vscode.NotebookCellOutput([
              new vscode.NotebookCellOutputItem(
                Buffer.from(
                  this._currentCell.output.replace(REGEX_NEW_LINE, '\n')
                ),
                'text/plain'
              ),
            ])
          );
        }
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
  private async _endCellExecution(success: boolean, postExecute = true) {
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
        if (success && postExecute && this.isStarted()) {
          await this.postCellExecution(success, cell);
        }
      }
    } catch (err) {
      success = false;
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.failedExecute, err],
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
  private async _postLaunchAndReset() {
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
  async launchIDL(title: string): Promise<boolean> {
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

    // stop listening if we are
    if (this.listening) {
      this._runtime.removeAllListeners();
      this.listening = false;
    }

    // create new instance of runtime
    this._runtime = new IDL(
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
    this._runtime.vscodeProDir = VSCODE_PRO_DIR;

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
    this._endCellExecution(false, false);

    // return a prom
    return launchPromise;
  }

  /**
   * TODO: What all do we need to do here?
   */
  dispose(): void {
    if (this.listening) {
      this._runtime.removeAllListeners();
    }
    this._runtime.stop();
    this._controller.dispose();
  }

  /**
   * Execute cell
   */
  async _executeCell(cell: vscode.NotebookCell): Promise<ICurrentCell> {
    /**
     * Create cell execution data
     */
    const execution = this._controller.createNotebookCellExecution(cell);

    /**
     * Track current cell
     */
    const current: ICurrentCell = {
      cell,
      execution,
      output: '',
      finished: false,
      success: true,
    };

    // attempt to launch IDL if we havent started yet
    if (!this.isStarted()) {
      try {
        if (
          !(await this.launchIDL(
            IDL_TRANSLATION.notebooks.notifications.startingIDL
          ))
        ) {
          execution.end(false, Date.now());
          current.success = false;
          return current;
        }
      } catch (err) {
        execution.end(false, Date.now());
        current.success = false;
        return current;
      }
    }

    // save cell as current
    this._currentCell = current;

    // set cell order
    execution.executionOrder = ++this._executionOrder;

    // set start time
    execution.start(Date.now());

    // reset cell output
    execution.clearOutput();

    /** Folder where we write notebook cell  */
    const nbDir =
      cell.notebook.uri.scheme === 'file'
        ? dirname(CleanPath(cell.notebook.uri.fsPath))
        : NOTEBOOK_FOLDER;

    /**
     * temp folder for notebook cell
     */
    const fsPath = join(nbDir, 'notebook_cell.pro');

    // make our folder if it doesnt exist
    if (!existsSync(nbDir)) {
      mkdirSync(nbDir, { recursive: true });
    }

    /**
     * Get strings for our cell
     */
    const strings = cell.document.getText().split(/\r?\n/g);

    /**
     * Flag if we have a main level program or not
     */
    let hasMain = true;

    /**
     * Parse code and see if we have a main level program
     */
    const parsed = Parser(strings, new CancellationToken());

    // check for main level program
    if (parsed.tree[parsed.tree.length - 1]?.name === TOKEN_NAMES.MAIN_LEVEL) {
      hasMain = true;

      // check if we are a single line
      if (
        IsSingleLine(parsed.tree[parsed.tree.length - 1] as TreeBranchToken)
      ) {
        strings.push('end');
      } else {
        /**
         * Get problem codes
         */
        const codes = parsed.parseProblems.map((problem) => problem.code);

        // check special cases
        for (let i = 0; i < codes.length; i++) {
          // check for missing end to the main level program
          if (codes[i] === IDL_PROBLEM_CODES.MISSING_MAIN_END) {
            strings.push('end');
            break;
          }

          // check for empty main
          if (codes[i] === IDL_PROBLEM_CODES.EMPTY_MAIN) {
            await this._endCellExecution(true);
            return current;
          }
        }
      }
    } else {
      hasMain = false;
    }

    // write file
    writeFileSync(fsPath, strings.join('\n'));

    // reset syntax errors
    this._runtime.errorsByFile = {};

    // compile our code
    await this.evaluate(`.compile -v '${fsPath}'`);

    // delete file
    rmSync(fsPath);

    // check for syntax errors
    if (Object.keys(this._runtime.errorsByFile).length > 0) {
      // set finish time
      await this._endCellExecution(false);
    } else {
      // run main level program
      if (hasMain) {
        await this.evaluate(`.go`);
      }

      /**
       * End cell execution and post-process
       */
      await this._endCellExecution(true);
    }

    // return as success
    return current;
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
        IDL_LOGGER.log({
          type: 'error',
          log: IDL_NOTEBOOK_LOG,
          content: [IDL_TRANSLATION.notebooks.errors.failedExecute, err],
          alert: IDL_TRANSLATION.notebooks.errors.failedExecute,
        });

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
  async evaluate(command: string) {
    // return if we havent started
    if (!this.isStarted()) {
      return '';
    }

    return await this._runtime.evaluate(command, {
      echo: false,
      idlInfo: false,
      cut: false,
      silent: false,
    });
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

    // stop IDL if we can
    if (this.isStarted()) {
      this._runtime.stop();
    }
  }
}
