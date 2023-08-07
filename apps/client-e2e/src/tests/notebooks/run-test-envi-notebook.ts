import { NOTEBOOK_FOLDER } from '@idl/notebooks/shared';
import { IDL_NOTEBOOK_MIME_TYPE } from '@idl/notebooks/types';
import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import { existsSync, rmSync } from 'fs';
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
    success: true,
    mimeTypes: [],
  },
  {
    idx: 1,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 2,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 3,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 4,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 5,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 6,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 7,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 8,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 9,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 10,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 11,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 12,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
];

/**
 * Function that runs a test ENVI notebooks
 */
export const RunTestENVINotebook: RunnerFunction = async (init) => {
  /**
   * Get the file we are going to open
   */
  const file = GetExtensionPath('idl/test/client-e2e/envi-test-notebook.idlnb');

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
  CompareCellOutputs(nb, CELL_OUTPUT);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_CLEAR_OUTPUTS);

  // save to disk
  await nb.save();
};
