import { NOTEBOOK_FOLDER } from '@idl/notebooks/shared';
import { Sleep } from '@idl/shared';
import { IDLNotebookController } from '@idl/vscode/notebooks';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import { existsSync, rmSync } from 'fs';
import * as vscode from 'vscode';

import { CompareCellOutputs } from './compare-cells';
import { ICompareCellOutputs } from './compare-cells.interface';

/**
 * Default timeout, ms
 */
export const DEFAULT_RUNNER_TIMEOUT = 100;

/**
 * helper function to:
 *
 * 1. Open notebook
 * 2. Clear existing outputs
 * 3. Run notebook
 * 4. Compare expected outputs to actual outputs
 * 5. Clear outputs
 * 6. Close
 */
export async function RunNotebookAndCompareCells(
  file: string,
  cells: ICompareCellOutputs[],
  controller: IDLNotebookController,
  timeout: number,
  clear = true
) {
  // nuke .idl folder if it exists
  if (existsSync(NOTEBOOK_FOLDER)) {
    rmSync(NOTEBOOK_FOLDER, { recursive: true, force: true });
  }

  /**
   * Open the notebook
   */
  const nb = await OpenNotebookInVSCode(file);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_CLEAR_OUTPUTS);

  // save to disk
  await nb.save();

  // run all cells
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_RUN_ALL);

  // make sure launched
  expect(controller.isStarted()).toBeTruthy();

  // short pause based on the number of cells we have
  // sometimes the rendering takes too long to register (like complex maps)
  // so we need an extra pause
  await Sleep(timeout);

  // compare cells
  await CompareCellOutputs(nb, cells);

  if (clear) {
    // clear outputs
    await vscode.commands.executeCommand(
      VSCODE_COMMANDS.NOTEBOOK_CLEAR_OUTPUTS
    );
  }

  // save again
  await nb.save();

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);
}
