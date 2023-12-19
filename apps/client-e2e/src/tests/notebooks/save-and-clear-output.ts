import { GetExtensionPath } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { CompareCellOutputs } from './helpers/compare-cells';
import { VerifyEmpty } from './helpers/verify-empty';
import { CELL_OUTPUT } from './run-test-notebook';

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
 */
export const SaveAndClearNotebook: RunnerFunction = async (init) => {
  /**
   * Get the file we are going to open
   */
  const file = GetExtensionPath(
    'idl/test/client-e2e/notebooks/test-notebook.idlnb'
  );

  /**
   * Open the notebook
   */
  const nb = await OpenNotebookInVSCode(file);

  // save contents of notebook which should have outputs from `run-test-notebook.ts`
  await nb.save();

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

  /**
   * Open the notebook
   */
  const nbAfter = await OpenNotebookInVSCode(file);

  // compare cells
  CompareCellOutputs(nbAfter, CELL_OUTPUT);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_CLEAR_OUTPUTS);

  // verify that our cells are empty
  VerifyEmpty(nbAfter);

  // save to disk
  await nbAfter.save();
};
