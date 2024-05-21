import { IDLEvaluateOptions } from '@idl/idl';
import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import {
  IDL_LANGUAGE_NAME,
  IDL_NOTEBOOK_CONTROLLER_NAME,
  IDL_NOTEBOOK_LANGUAGE_NAME,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER } from '@idl/vscode/client';
import * as vscode from 'vscode';

import { IDLNotebookExecutionManager } from './idl-notebook-execution-manager.class';

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
  readonly _controller: vscode.NotebookController;

  /**
   * Track notebooks by URI
   */
  knownNotebooks: { [key: string]: vscode.NotebookDocument } = {};

  /**
   * Track notebooks by URI
   */
  notebookManagers: { [key: string]: IDLNotebookExecutionManager } = {};

  constructor() {
    // create notebook controller
    this._controller = this.createController();

    // listen for when we close notebooks to clean up IDL processes
    vscode.workspace.onDidCloseNotebookDocument(async (nb) => {
      try {
        // get the URI
        const uri = nb.uri.toString();

        // see if we are tracking it
        if (uri in this.notebookManagers) {
          // clean up
          await this.notebookManagers[uri].dispose();

          // remove reference
          delete this.notebookManagers[uri];

          // remove from known notebook
          delete this.knownNotebooks[uri];
        }
      } catch (err) {
        IDL_LOGGER.log({
          log: IDL_NOTEBOOK_LOG,
          content: [
            IDL_TRANSLATION.notebooks.errors.onDidCloseNotebookDocument,
            err,
          ],
          type: 'error',
          alert: IDL_TRANSLATION.notebooks.errors.onDidCloseNotebookDocument,
        });
      }
    });
  }

  /**
   * Creates a notebook controller
   */
  createController() {
    // create notebook controller
    const _controller = vscode.notebooks.createNotebookController(
      this.controllerId,
      this.notebookType,
      this.label
    );

    // update notebook controller properties
    _controller.supportedLanguages = this.supportedLanguages;
    _controller.supportsExecutionOrder = true;
    _controller.executeHandler = this._execute.bind(this);

    return _controller;
  }

  /**
   * Get an execution manager for a notebook
   *
   * Each notebook gets its own manager so we can run IDL in parallel
   */
  getNotebookManager(nb: vscode.NotebookDocument) {
    /** Stringify the URI */
    const uri = nb.uri.toString();

    // make new manager if we dont have one
    if (!(uri in this.notebookManagers)) {
      this.notebookManagers[uri] = new IDLNotebookExecutionManager(
        this,
        this._controller
      );
    }

    // return our manager
    return this.notebookManagers[uri];
  }

  /**
   * Determine if we are started or not
   */
  isStarted(nb: vscode.NotebookDocument) {
    return this.getNotebookManager(nb)._runtime.isStarted();
  }

  /**
   * TODO: What all do we need to do here?
   */
  dispose(): void {
    /** Get all of our managers */
    const managers = Object.values(this.notebookManagers);

    // remove references
    this.notebookManagers = {};

    // dispose of each
    for (let i = 0; i < managers.length; i++) {
      managers[i].dispose();
    }

    // dispose of our controller
    this._controller.dispose();
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
    /** Track known notebooks */
    this.knownNotebooks[_notebook.uri.toString()] = _notebook;

    /** Have manager run notebook cell */
    await this.getNotebookManager(_notebook)._execute(
      cells,
      _notebook,
      _controller
    );
  }

  /**
   * If IDL has started, evaluates a command in IDL
   *
   * You should check the "launched" property before calling this
   */
  async evaluate(
    nb: vscode.NotebookDocument,
    command: string,
    inOptions?: IDLEvaluateOptions
  ) {
    return this.getNotebookManager(nb).evaluate(command, inOptions);
  }

  /**
   * Reset our IDL session
   */
  async launchIDL(nb: vscode.NotebookDocument, title: string) {
    return this.getNotebookManager(nb).launchIDL(title);
  }

  /**
   * Reset our IDL session
   */
  async reset(nb: vscode.NotebookDocument) {
    return this.getNotebookManager(nb).reset();
  }

  /**
   * Stop kernel execution
   */
  async stop(nb: vscode.NotebookDocument) {
    return this.getNotebookManager(nb).stop();
  }

  /**
   * Stop kernel execution
   */
  async stopAll() {
    /** Get all notebook sessions */
    const sessions = Object.values(this.notebookManagers);

    // stop each
    for (let i = 0; i < sessions.length; i++) {
      await sessions[i].stop();
    }
  }
}
