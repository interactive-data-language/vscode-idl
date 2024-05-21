import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Stop all notebooks
 */
export const RunNotebookStopAll: RunnerFunction = async (init) => {
  /**
   * Get the file we are going to open
   */
  const file = GetExtensionPath(
    'idl/test/client-e2e/notebooks/stop-notebook.idlnb'
  );

  /**
   * Open the notebook
   */
  const nb = await OpenNotebookInVSCode(file);

  // trigger a run to start IDL
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_RUN_ALL);

  // make sure launched
  expect(init.notebooks.controller.isStarted(nb)).toBeTruthy();

  // stop all notebooks
  await vscode.commands.executeCommand(IDL_COMMANDS.NOTEBOOKS.STOP_ALL_KERNELS);

  // short pause
  await Sleep(500);

  // make sure stopped
  expect(init.notebooks.controller.isStarted(nb)).toBeFalsy();
};
