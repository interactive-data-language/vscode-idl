import { IDL_COMMANDS, IDL_NOTEBOOK_LANGUAGE_NAME, Sleep } from '@idl/shared';
import { VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { CompareCellOutputs } from './helpers/compare-cells';
import { ICompareCellOutputs } from './helpers/compare-cells.interface';
import { DEFAULT_RUNNER_TIMEOUT } from './helpers/run-notebook-and-compare-cells';

/**
 * Types of outputs from cells that we expect to have
 */
export const CELL_OUTPUT: ICompareCellOutputs[] = [
  {
    idx: 1,
    success: true,
    mimeTypes: ['text/plain'],
  },
];

/**
 * Opens a new IDL notebook, adds a code cell, and makes sure we can run it
 * without any issues considering it hasnt been saved to disk
 */
export const RunUnsavedNotebook: RunnerFunction = async (init) => {
  /** Get reference to the notebook controller */
  const controller = init.notebooks.controller;

  // start IDL if it hasnt yet
  if (!controller.isStarted()) {
    await controller.launchIDL('Launching IDL');
  }

  // make sure launched
  expect(controller.isStarted()).toBeTruthy();

  // make new notebook
  await vscode.commands.executeCommand(IDL_COMMANDS.NOTEBOOKS.NEW_NOTEBOOK);

  // short pause
  await Sleep(DEFAULT_RUNNER_TIMEOUT);

  // get active editor
  const editor = vscode.window.activeNotebookEditor;

  // make sure we have an IDL Notebook as our editor
  expect(editor?.notebook?.notebookType).toEqual(IDL_NOTEBOOK_LANGUAGE_NAME);

  /** Get reference to the current notebook */
  const nb = editor.notebook;

  // update text
  const cells = nb.getCells();

  // verify we have two cells
  expect(cells.length).toEqual(2);

  // run all cells
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_RUN_ALL);

  // short pause based on the number of cells we have
  // sometimes the rendering takes too long to register (like complex maps)
  // so we need an extra pause
  await Sleep(DEFAULT_RUNNER_TIMEOUT);

  // compare cells
  await CompareCellOutputs(nb, CELL_OUTPUT);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);
};
