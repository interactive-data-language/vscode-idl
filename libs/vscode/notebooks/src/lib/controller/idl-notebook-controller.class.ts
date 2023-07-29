import {
  CleanIDLOutput,
  IDL,
  IDL_EVENT_LOOKUP,
  REGEX_NEW_LINE,
} from '@idl/idl';
import { IDL_DEBUG_NOTEBOOK_LOG, IDL_NOTEBOOK_LOG } from '@idl/logger';
import { NOTEBOOK_FOLDER } from '@idl/notebooks';
import { Parser } from '@idl/parser';
import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import { TreeBranchToken } from '@idl/parsing/syntax-tree';
import { IsSingleLine } from '@idl/parsing/syntax-validators';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import {
  IDL_LANGUAGE_NAME,
  IDL_NOTEBOOK_CONTROLLER_NAME,
  IDL_NOTEBOOK_NAME,
  Sleep,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER, VSCODE_PRO_DIR } from '@idl/vscode/client';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import {
  DEFAULT_IDL_DEBUG_CONFIGURATION,
  IDL_DEBUG_CONFIGURATION_PROVIDER,
} from '@idl/vscode/debug';
import copy from 'fast-copy';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as vscode from 'vscode';

import { BangMagic } from './bang-magic.interface';
import { ICurrentCell } from './idl-notebook-controller.interface';

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

    // detect crash event
    this._runtime.on(IDL_EVENT_LOOKUP.END, () => {
      this._IDLCrashed('crash');
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
              vscode.NotebookCellOutputItem.text(
                this._currentCell.output.replace(REGEX_NEW_LINE, '\n')
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

    await this.evaluate(`retall`);

    // update magic based on preference
    magic = magic && IDL_EXTENSION_CONFIG.notebooks.embedGraphics;

    /**
     * Commands to run after executing a cell
     *
     * Quiet makes sure that we exclude output that goofs up processing and hides compile statements
     *
     * Magic forces embedding and, for embedding, resets window ID
     */
    const commands = [
      '!quiet = 1',
      `!magic.embed = ${
        IDL_EXTENSION_CONFIG.notebooks.embedGraphics ? '1' : '0'
      }`,
      '!magic.window = -1',
    ];

    // insert magic command before resetting window value
    if (magic) {
      commands.splice(2, 1, 'print, json_serialize(!magic, /lowercase)');
    }

    /**
     * Clean things up and get our !magic system variable
     */
    const rawMagic = CleanIDLOutput(await this.evaluate(commands.join(' & ')));

    // check if we need to look for magic
    if (magic && cell !== undefined) {
      try {
        // /**
        //  * Parse our magic
        //  */
        // const magics: BangMagic[] = [JSON.parse(rawMagic)];

        /**
         * Get additional windows
         */
        const superMagic: { [key: string]: BangMagic } = JSON.parse(
          CleanIDLOutput(
            await this.evaluate(
              `print, json_serialize(!super_magic) & !super_magic.remove, /all`
            )
          )
        );

        /**
         * Get original magic value
         */
        const bangMagic: BangMagic = JSON.parse(rawMagic);

        // add if it doesnt exist
        if (!(bangMagic.window in superMagic)) {
          superMagic[bangMagic.window] = bangMagic;
        }

        /**
         * Get all of the graphics
         */
        const magics = Object.values(superMagic);

        // process each magic
        for (let i = 0; i < magics.length; i++) {
          // get full magic
          const fullMagic = magics[i];

          // check if we have a window
          if (fullMagic.window !== -1) {
            /**
             * Retrieve our encoded graphic and clear window reference
             */
            const encoded = await this.evaluate(
              `EncodeGraphic(${fullMagic.window}, ${fullMagic.type}) & !magic.window = -1`
            );

            /**
             * Styles for the element to fil the space, but not exceed 1:1 dimensions
             */
            const style = `style="width:100%;height:100%;max-width:${fullMagic.xsize}px;max-height:${fullMagic.ysize}px;"`;

            // add as output
            cell.execution.appendOutput(
              new vscode.NotebookCellOutput([
                /**
                 * Use HTML because it works. Using the other mimetype *probably* works
                 * but this works right now :)
                 */
                new vscode.NotebookCellOutputItem(
                  Buffer.from(
                    `<img src="data:image/png;base64,${encoded}" ${style}/>`
                  ),
                  'text/html'
                ),
              ])
            );
          }
        }
      } catch (err) {
        // alert user
        IDL_LOGGER.log({
          type: 'error',
          log: IDL_NOTEBOOK_LOG,
          content: [IDL_TRANSLATION.notebooks.errors.checkingGraphics, err],
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
     * Flag if we ended execution correctly
     */
    let ended = false;

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
        if (postExecute && this.isStarted()) {
          await this.postCellExecution(success, cell);
        }

        // mark as completed
        cell.execution.end(success, Date.now());

        // update flag
        ended = true;
      }
    } catch (err) {
      if (!ended && cell !== undefined) {
        cell.execution.end(false, Date.now());
      }
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.failedExecute, err],
        alert: IDL_TRANSLATION.notebooks.errors.failedExecute,
      });
    }
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
      `!quiet = 1`,
      `!magic.embed = ${
        IDL_EXTENSION_CONFIG.notebooks.embedGraphics ? '1' : '0'
      }`,
      `defsysv, '!super_magic', exists=_exists`,
      `if ~_exists then defsysv, '!super_magic', orderedhash()`,
      `delvar, _exists`,
    ];

    // capture outputs from all commands
    const outputs: string[] = [];

    // set compile opt and be quiet
    outputs.push(await this.evaluate(compile.join(' & ')));

    // see if we need to resolve more
    if (IDL_EXTENSION_CONFIG.notebooks.embedGraphics) {
      // [
      //   `.compile idlittool__define`,
      //   `idlititool__refreshcurrentview`,
      //   `graphic__define`,
      //   `graphic__refresh`,
      // ]
      // await this.evaluate(
      //   [
      //     `.compile idlittool__define`,
      //     `'${VSCODE_PRO_DIR}/idlititool__refreshcurrentview.pro'`,
      //     `graphic__define`,
      //     `'${VSCODE_PRO_DIR}/graphic__refresh.pro'`,
      //   ].join(' ')
      // );
      outputs.push(await this.evaluate('.compile idlittool__define'));
      outputs.push(
        await this.evaluate(
          `.compile '${VSCODE_PRO_DIR}/idlititool__refreshcurrentview.pro'`
        )
      );
      outputs.push(await this.evaluate('.compile graphic__define'));
      outputs.push(
        await this.evaluate(`.compile '${VSCODE_PRO_DIR}/graphic__refresh.pro'`)
      );
    }

    // log output for easy debugging
    IDL_LOGGER.log({
      log: IDL_NOTEBOOK_LOG,
      type: 'info',
      content: [`IDL post-launch and reset output (should be empty)`, outputs],
    });
  }

  /**
   * Launches IDL for a notebooks session
   */
  async launchIDL(title: string): Promise<boolean> {
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
    const launchPromise = new Promise<boolean>((res, rej) => {
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
  async _executeCell(cell: vscode.NotebookCell): Promise<boolean> {
    /**
     * Create cell execution data
     */
    const execution = this._controller.createNotebookCellExecution(cell);

    // attempt to launch IDL if we havent started yet
    if (!this.isStarted()) {
      try {
        if (
          !(await this.launchIDL(
            IDL_TRANSLATION.notebooks.notifications.startingIDL
          ))
        ) {
          execution.end(false, Date.now());
          return;
        }
      } catch (err) {
        execution.end(false, Date.now());

        // return flag
        return false;
      }
    }

    // save cell as current
    this._currentCell = {
      cell,
      execution,
      output: '',
      finished: false,
      success: true,
    };

    // set cell order
    execution.executionOrder = ++this._executionOrder;

    // set start time
    execution.start(Date.now());

    // reset cell output
    execution.clearOutput();

    /**
     * temp folder for notebook cell
     */
    const fsPath = join(NOTEBOOK_FOLDER, 'notebook_cell.pro');

    // make our folder if it doesnt exist
    if (!existsSync(NOTEBOOK_FOLDER)) {
      mkdirSync(NOTEBOOK_FOLDER, { recursive: true });
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
    const parsed = Parser(strings);

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
            return true;
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
    return true;
  }

  /**
   * Execute notebook cells
   */
  async _execute(
    cells: vscode.NotebookCell[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _notebook: vscode.NotebookDocument,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _controller: vscode.NotebookController
  ): Promise<void> {
    for (let i = 0; i < cells.length; i++) {
      try {
        // execute cell and, if we dont succeed, then stop and return
        if (!(await this._executeCell(cells[i]))) {
          return;
        }

        // short pause
        await Sleep(100);
      } catch (err) {
        // alert user
        IDL_LOGGER.log({
          type: 'error',
          log: IDL_NOTEBOOK_LOG,
          content: [IDL_TRANSLATION.notebooks.errors.failedExecute, err],
          alert: IDL_TRANSLATION.notebooks.errors.failedExecute,
        });
      }
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
    if (!this.isStarted()) {
      return;
    }

    // alert that execution has stopped
    await this._endCellExecution(false, false);

    // stop IDL
    this._runtime.stop();
  }
}
