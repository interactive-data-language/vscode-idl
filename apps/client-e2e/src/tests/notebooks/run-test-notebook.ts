import { NOTEBOOK_FOLDER } from '@idl/notebooks/shared';
import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import { existsSync, rmSync } from 'fs';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { CompareCells } from './helpers/compare-cells';
import { ICompareCells } from './helpers/compare-cells.interface';

/**
 * Types of outputs from cells that we expect to have
 */
export const CELL_OUTPUT: ICompareCells[] = [
  {
    idx: 1,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 2,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 3,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 4,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 5,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 6,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 7,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 8,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 9,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 10,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 11,
    success: true,
    mimeTypes: ['text/html'],
  },
  {
    idx: 12,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 13,
    success: true,
    mimeTypes: ['text/html', 'text/html', 'text/html'],
  },
  {
    idx: 14,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 15,
    success: false,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 16,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 17,
    success: false,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 18,
    success: false,
    mimeTypes: ['text/plain'],
  },
];

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
 */
export const RunTestNotebook: RunnerFunction = async (init) => {
  /**
   * Get the file we are going to open
   */
  const file = GetExtensionPath('idl/test/client-e2e/test-notebook.idlnb');

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
  expect(init.notebooks.controller.isStarted()).toBeTruthy();

  // short pause
  await Sleep(100);

  // compare cells
  CompareCells(nb, CELL_OUTPUT);
};
