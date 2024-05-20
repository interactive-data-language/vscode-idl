import { NOTEBOOK_FOLDER } from '@idl/notebooks/shared';
import { Sleep } from '@idl/shared';
import {
  IDLDecorationsManager,
  IStackTraceLookup,
} from '@idl/vscode/decorations';
import { IDLNotebookController } from '@idl/vscode/notebooks';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import { existsSync, rmSync } from 'fs';
import * as vscode from 'vscode';

import { DEFAULT_RUNNER_NOTEBOOK_TIMEOUT } from './notebook-timeout.interface';

/**
 * helper function to:
 *
 * 1. Open notebook
 * 2. Clear existing outputs
 * 3. Run notebook
 * 4. Check call stack against what we expect
 * 5. Clear outputs
 * 6. Close
 */
export async function RunNotebookAndCheckCallStackDecorations(
  file: string,
  stack: IStackTraceLookup,
  controller: IDLNotebookController,
  decorations: IDLDecorationsManager,
  clear = true
) {
  // nuke .idl folder if it exists
  if (existsSync(NOTEBOOK_FOLDER)) {
    rmSync(NOTEBOOK_FOLDER, { recursive: true, force: true });
  }

  // alert user
  console.log(`  Running notebook: ${file}`);

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
  expect(controller.isStarted(nb)).toBeTruthy();

  // short pause based on the number of cells we have
  // sometimes the rendering takes too long to register (like complex maps)
  // so we need an extra pause
  await Sleep(DEFAULT_RUNNER_NOTEBOOK_TIMEOUT);

  // get current decorations
  const current = decorations.decorations.stack;

  // compare the stack
  expect(current).toEqual(stack);

  if (clear) {
    // clear outputs
    await vscode.commands.executeCommand(
      VSCODE_COMMANDS.NOTEBOOK_CLEAR_OUTPUTS
    );
  }

  // save again
  await nb.save();
}
