import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { CompareCellOutputs } from './helpers/compare-cells';
import { ICompareCellOutputs } from './helpers/compare-cells.interface';

/**
 * Types of outputs from cells that we expect to have
 */
export const CELL_OUTPUT: ICompareCellOutputs[] = [
  {
    idx: 0,
    success: false,
    mimeTypes: [],
  },
];

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
 */
export const RunNotebookReset: RunnerFunction = async (init) => {
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
  expect(init.notebooks.controller.isStarted()).toBeTruthy();

  // trigger a run
  vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_RUN_ALL);

  // short pause
  await Sleep(100);

  // stop execution
  await vscode.commands.executeCommand(IDL_COMMANDS.NOTEBOOKS.RESET);

  // short pause
  await Sleep(100);

  // make sure stopped
  expect(init.notebooks.controller.isStarted()).toBeTruthy();

  // compare state
  CompareCellOutputs(nb, CELL_OUTPUT);

  // clear outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_CLEAR_OUTPUTS);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);
};
