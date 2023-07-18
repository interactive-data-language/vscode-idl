import {
  CleanIDLOutput,
  IDL,
  IDL_EVENT_LOOKUP,
  REGEX_NEW_LINE,
} from '@idl/idl';
import { IDL_DEBUG_LOG, IDL_NOTEBOOK_LOG } from '@idl/logger';
import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';
import {
  IDL_LANGUAGE_NAME,
  IDL_NOTEBOOK_CONTROLLER_NAME,
  IDL_NOTEBOOK_NAME,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER, VSCODE_PRO_DIR } from '@idl/vscode/client';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import {
  DEFAULT_IDL_DEBUG_CONFIGURATION,
  IDL_DEBUG_CONFIGURATION_PROVIDER,
} from '@idl/vscode/debug';
import { DOT_IDL_FOLDER } from '@idl/vscode/shared';
import copy from 'fast-copy';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as vscode from 'vscode';

import { BangMagic } from './bang-magic.interface';

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

  /** have we actually started IDL for debugging? */
  launched = false;

  /** Are we listening to events from IDL or not? */
  private listening = false;

  /** track the last requested scope */
  private lastFrameId = 0;

  /** Reference to our IDL class, manages process and input/output */
  readonly _runtime: IDL;

  /**
   * The current cell that we are executing
   */
  private _currentCell?: {
    /** Cell being executed */
    cell: vscode.NotebookCell;
    /** Cell execution */
    execution: vscode.NotebookCellExecution;
    /** Currently captured output */
    output: string;
    /** Are we done processing? */
    finished: boolean;
    /** Did we succeed or not */
    success: boolean;
  };

  /**
   * ID for our graphic
   */
  private _graphicid = '__IDLGRAPHICPLACEHOLDER__';

  constructor() {
    // create our runtime session - does not immediately start IDL
    this._runtime = new IDL(IDL_LOGGER.getLog(IDL_DEBUG_LOG), VSCODE_PRO_DIR);
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
    this._runtime.on(IDL_EVENT_LOOKUP.STOP, (reason, stack) => {
      IDL_LOGGER.log({
        type: 'debug',
        log: IDL_NOTEBOOK_LOG,
        content: [`Stopped because: "${reason}"`, stack],
      });
      if (this._currentCell !== undefined) {
        if (!this._currentCell.finished) {
          this._currentCell.execution.end(false, Date.now());
          this._currentCell.finished = true;
          this._currentCell.success = false;
        }
      }
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
      this._appendOutput(msg);
    });

    // listen for standard out
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_OUT, (msg) => {
      this._appendOutput(msg);
    });

    // pass all stderr output back to the console
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_ERR, (msg) => {
      this._appendOutput(msg);
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
  private _IDLCrashed(reason: 'crash' | 'failed-start') {
    if (reason === 'crash') {
      this._appendOutput(IDL_TRANSLATION.notebooks.errors.crashed, 'stderr');
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.crashed],
        alert: IDL_TRANSLATION.notebooks.errors.crashed,
      });
    } else {
      this._appendOutput(
        IDL_TRANSLATION.notebooks.errors.failedStart,
        'stderr'
      );
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_NOTEBOOK_LOG,
        content: [IDL_TRANSLATION.notebooks.errors.failedStart],
        alert: IDL_TRANSLATION.notebooks.errors.failedStart,
      });
    }

    // update state
    this.launched = false;
  }

  /**
   * Output to append
   */
  private _appendOutput(content: string, type: 'stdout' | 'stderr' = 'stdout') {
    // log output
    IDL_LOGGER.log({
      log: IDL_NOTEBOOK_LOG,
      type: 'debug',
      content: `IDL output: ${JSON.stringify(content)}`,
    });

    // check what we need to do
    if (this._currentCell !== undefined) {
      // only save output if we are not finished
      if (!this._currentCell.finished) {
        // update overall output
        this._currentCell.output = `${this._currentCell.output}${content}`;
        this._currentCell.execution.replaceOutput(
          new vscode.NotebookCellOutput([
            vscode.NotebookCellOutputItem.text(
              this._currentCell.output.replace(REGEX_NEW_LINE, '\n')
            ),
          ])
        );
      }

      if (type === 'stderr') {
        if (!this._currentCell.finished) {
          this._currentCell.execution.end(false, Date.now());
          this._currentCell.finished = true;
          this._currentCell.success = false;
        }
      }
    }
  }

  private async _launchIDL(): Promise<boolean> {
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
        // update flag that we started
        this.launched = true;

        /**
         * Embed command for !magic
         */
        const embed = `!magic.embed = ${
          IDL_EXTENSION_CONFIG.notebooks.embedGraphics ? '1' : '0'
        }`;

        // set compile opt and be quiet
        await this._runtime.evaluate(
          `compile_opt idl2 & !quiet = 1 & ${embed}`
        );

        // resolve promise
        res(true);
      });

      // listen for failures to launch
      this._runtime.once(IDL_EVENT_LOOKUP.FAILED_START, () => {
        if (!this.launched) {
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

    // return a prom
    return launchPromise;
  }

  /**
   * TODO: What all do we need to do here?
   */
  dispose(): void {
    this.launched = false;
    this._runtime.stop();
    this._controller.dispose();
  }

  /**
   * Stop kernel execution
   */
  stop() {
    // update flag
    this.launched = false;

    // alert that execution has stopped
    if (this._currentCell) {
      if (!this._currentCell.finished) {
        this._currentCell.execution.end(false, Date.now());
        this._currentCell.finished = true;
        this._currentCell.success = false;
      }
      this._currentCell = undefined;
    }

    // stop IDL
    this._runtime.stop();
  }

  /**
   * Execute cell
   */
  private async _executeCell(cell: vscode.NotebookCell): Promise<boolean> {
    /**
     * Create cell execution data
     */
    const execution = this._controller.createNotebookCellExecution(cell);

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
    execution.replaceOutput(new vscode.NotebookCellOutput([]));

    // attempt to launch IDL if we havent started yet
    if (!this.launched) {
      try {
        if (!(await this._launchIDL())) {
          return;
        }
        await this.postEvaluate(false);
      } catch (err) {
        // mark as done
        execution.end(false, Date.now());
        this._currentCell = undefined;

        // alert user
        IDL_LOGGER.log({
          type: 'error',
          log: IDL_NOTEBOOK_LOG,
          content: [IDL_TRANSLATION.notebooks.errors.failedStart, err],
          alert: IDL_TRANSLATION.notebooks.errors.failedStart,
        });

        // return flag
        return false;
      }
    }

    /**
     * temp folder for notebook cell
     */
    const fsPath = join(DOT_IDL_FOLDER, 'notebook_cell.pro');

    /**
     * Get URI for cell
     */
    const uri = cell.document.uri;

    /**
     * Get strings for our cell
     */
    const strings = cell.document.getText().split(/\r?\n/g);

    /**
     * Filter lines to figure out how much content is in our cell
     */
    const filtered = strings.filter((line) => {
      /**
       * Trim the line
       */
      const trimmed = line.trim();

      // filter out lines that start with
      return trimmed !== '' && !trimmed.startsWith(';');
    });

    // determine how we can clean up our core
    switch (true) {
      /**
       * Return if empty cell
       */
      case filtered.length === 0:
        execution.end(true, Date.now());
        this._currentCell = undefined;
        return true;

      /**
       * Add an end if a single line
       */
      case filtered.length === 1:
        strings.push('end');
        break;

      /**
       * Check diagnostics to get main level
       */
      default: {
        /**
         * Get diagnostics for our cell
         */
        const diagnostics = vscode.languages.getDiagnostics(uri);

        // check if we have one
        if (diagnostics !== undefined) {
          /**
           * Get string description for problem codes
           *
           * Format matches: libs\vscode\server\src\lib\helpers\syntax-problem-to-diagnostic.ts
           */
          const codes = diagnostics.map((item) =>
            typeof item.code !== 'number' && typeof item.code !== 'string'
              ? (item.code?.value as string)
              : (item.code as string)
          );

          // check for missing end
          for (let i = 0; i < codes.length; i++) {
            // check for missing end to the main level program
            if (codes[i].endsWith(`${IDL_PROBLEM_CODES.MISSING_MAIN_END}`)) {
              strings.push('end');
              break;
            }

            // check for empty main
            if (codes[i].endsWith(`${IDL_PROBLEM_CODES.EMPTY_MAIN}`)) {
              execution.end(true, Date.now());
              this._currentCell = undefined;
              return true;
            }
          }
        }

        break;
      }
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
      if (!this._currentCell.finished) {
        execution.end(false, Date.now());
      }
    } else {
      // run main level program
      await this.evaluate(`.go`);
    }

    // clear that we are executing this cell
    this._currentCell.finished = true;

    // return
    await this.postEvaluate(this._currentCell.success);

    // mark execution as finished if we succeeded
    // if we had an error, then we already marked as finished
    if (this._currentCell.success) {
      execution.end(true, Date.now());
    }

    // reset
    this._currentCell = undefined;

    // return as success
    return true;
  }

  /**
   * Execute notebook cells
   */
  private async _execute(
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
   * If IDL has started, evaluates a command
   *
   * You should check the "launched" property before calling this
   */
  async evaluate(command: string) {
    if (this.launched) {
      return await this._runtime.evaluate(command, {
        echo: false,
        idlInfo: false,
        cut: false,
        silent: false,
      });
    }
    return '';
  }

  /**
   * Post-evaluation expression
   *
   * You should check the "launched" property before calling this
   */
  async postEvaluate(magic = true) {
    // check if we need to do our post-evaluation
    if (this.launched) {
      await this._runtime.evaluate(`retall`, {
        echo: false,
        idlInfo: false,
        cut: false,
        silent: false,
      });

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
        commands.splice(2, 0, 'print, json_serialize(!magic, /lowercase)');
      }

      /**
       * Clean things up and get our !magic system variable
       */
      const rawMagic = CleanIDLOutput(
        await this._runtime.evaluate(commands.join(' & '))
      );

      // check if we need to look for magic
      if (magic && this._currentCell !== undefined) {
        try {
          /**
           * Parse our magic
           */
          const fullMagic: BangMagic = JSON.parse(rawMagic);

          // check if we have a window
          if (fullMagic.window !== -1) {
            /**
             * Retrieve our encoded graphic
             */
            const encoded = await this._runtime.evaluate(
              `EncodeGraphic(${fullMagic.window}, ${fullMagic.type})`
            );

            /**
             * Styles for the element to fil the space, but not exceed 1:1 dimensions
             */
            const style = `style="width:100%;height:100%;max-width:${fullMagic.xsize}px;max-height:${fullMagic.ysize}px;"`;

            // add as output
            this._currentCell.execution.appendOutput(
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
  }
}
