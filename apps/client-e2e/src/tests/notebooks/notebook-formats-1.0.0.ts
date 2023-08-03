import { GetExtensionPath } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { CompareCellsAndOutputs } from './helpers/compare-cells';
import { ICompareCellAndOutputs } from './helpers/compare-cells.interface';

/**
 * Types of outputs from cells that we expect to have
 */
export const CELL_OUTPUT: ICompareCellAndOutputs[] = [
  {
    idx: 0,
    kind: 'code',
    outputs: [],
  },
  {
    idx: 1,
    kind: 'code',
    outputs: [],
  },
  {
    idx: 2,
    kind: 'code',
    outputs: ['text/plain'],
  },
  {
    idx: 3,
    kind: 'code',
    outputs: ['text/html'],
  },
  {
    idx: 4,
    kind: 'code',
    outputs: ['text/html'],
  },
  {
    idx: 5,
    kind: 'code',
    outputs: ['text/html'],
  },
  {
    idx: 6,
    kind: 'code',
    outputs: ['text/html'],
  },
  {
    idx: 7,
    kind: 'code',
    outputs: ['text/html'],
  },
  {
    idx: 8,
    kind: 'code',
    outputs: ['text/html'],
  },
  {
    idx: 9,
    kind: 'code',
    outputs: ['text/html'],
  },
  {
    idx: 10,
    kind: 'code',
    outputs: ['text/html'],
  },
  {
    idx: 11,
    kind: 'code',
    outputs: ['text/html'],
  },
];

/**
 * Function that verifies that we can open notebooks in the format 1.0.0
 */
export const NotebookFormats_1_0_0: RunnerFunction = async (init) => {
  /**
   * Get the file we are going to open
   */
  const file = GetExtensionPath('idl/test/client-e2e/test-1.0.0.idlnb');

  /**
   * Open the notebook
   */
  const nb = await OpenNotebookInVSCode(file);

  // compare state
  CompareCellsAndOutputs(nb, CELL_OUTPUT);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);
};
