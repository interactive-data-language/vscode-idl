import { IDLSyntaxErrorLookup } from '@idl/idl';
import { IDL_NOTEBOOK_LOG } from '@idl/logger';
import { NOTEBOOK_FOLDER } from '@idl/notebooks/shared';
import { CleanPath, IDLFileHelper } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_LOGGER, LANGUAGE_SERVER_MESSENGER } from '@idl/vscode/client';
import { IDL_DECORATIONS_MANAGER } from '@idl/vscode/decorations';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import * as vscode from 'vscode';

import { ICurrentCell } from '../idl-notebook-controller.interface';
import { IDLNotebookExecutionManager } from '../idl-notebook-execution-manager.class';

/**
 * Runs a notebook cell and manages logic for execution
 */
export async function ExecuteNotebookCell(
  manager: IDLNotebookExecutionManager,
  cell: vscode.NotebookCell
): Promise<ICurrentCell> {
  /**
   * Create cell execution data
   */
  const execution = manager.vscodeController.createNotebookCellExecution(cell);

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
  if (!manager.isStarted()) {
    try {
      if (
        !(await manager.launchIDL(
          IDL_TRANSLATION.notebooks.notifications.startingIDL,
          current
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
  manager._currentCell = current;

  // set cell order
  execution.executionOrder = ++manager._executionOrder;

  // set start time
  execution.start(Date.now());

  // reset cell output
  execution.clearOutput();

  // reset stack trace
  IDL_DECORATIONS_MANAGER.resetStackTraceDecorations('notebook');

  /** Folder where we write notebook cell, check if NB is saved to disk  */
  const nbDir =
    cell.notebook.uri.scheme === 'file'
      ? dirname(CleanPath(cell.notebook.uri.fsPath))
      : NOTEBOOK_FOLDER;

  /**
   * PRO file for where we write the NB cell to disk
   */
  const fsPath =
    cell.notebook.uri.scheme === 'file'
      ? IDLFileHelper.notebookCellUriToFSPath(cell.document.uri)
      : join(nbDir, 'notebook_cell.pro');

  // make our folder if it doesnt exist
  if (!existsSync(nbDir)) {
    mkdirSync(nbDir, { recursive: true });
  }

  /**
   * Send message to convert code
   */
  const resp = await LANGUAGE_SERVER_MESSENGER.sendRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.PREPARE_NOTEBOOK_CELL,
    {
      notebookUri: cell.notebook.uri.toString(),
      cellUri: cell.document.uri.toString(),
      code: cell.document.getText(),
    }
  );

  // see if theres a problem, user should be alerted
  if (!resp) {
    IDL_LOGGER.log({
      type: 'error',
      log: IDL_NOTEBOOK_LOG,
      content: [IDL_TRANSLATION.notebooks.errors.failedCodePrepare],
      alert: IDL_TRANSLATION.notebooks.errors.failedCodePrepare,
    });

    // update VSCode
    await manager._endCellExecution(false);
    return current;
  }

  // check if empty main level
  if (resp.emptyMain) {
    await manager._endCellExecution(true);
    return current;
  }

  IDL_LOGGER.log({
    type: 'debug',
    log: IDL_NOTEBOOK_LOG,
    content: ['Prepared notebook cell', resp.code.split(/\r*\n/gim)],
  });

  // write file
  writeFileSync(fsPath, resp.code);

  // reset syntax errors
  manager._runtime.resetErrorsByFile();

  // compile our code
  await manager.evaluate(`.compile -v '${fsPath}'`, {
    silent: true,
  });

  // get syntax errors
  const errsWithPrint = manager._runtime.getErrorsByFile();

  // did we get syntax errors?
  if (Object.keys(errsWithPrint).length > 0) {
    // write file without print
    writeFileSync(fsPath, resp.codeWithoutPrint);

    // compile our code again and show errors
    await manager.evaluate(`.compile -v '${fsPath}'`, {
      silent: false,
    });
  }

  // vscode.workspace.openNotebookDocument();

  // get syntax errors
  const errs = manager._runtime.getErrorsByFile();

  // delete file
  rmSync(fsPath);

  // map path on disk to notebook cell
  const fsUri = vscode.Uri.file(fsPath).toString();

  // track problems we report
  const errReport: IDLSyntaxErrorLookup = {};

  // set errors or reset
  errReport[cell.document.uri.toString()] = fsUri in errs ? errs[fsUri] : [];

  // add decorations
  IDL_DECORATIONS_MANAGER.syncSyntaxErrorDecorations(errReport);

  // check for syntax errors
  if (Object.keys(errs).length > 0) {
    // set finish time
    await manager._endCellExecution(false);
  } else {
    // run main level program
    if (resp.hasMain) {
      await manager.evaluate(`.go`);
    }

    /**
     * End cell execution and post-process
     */
    await manager._endCellExecution(true);
  }

  // return as success
  return current;
}
