import { GetExtensionPath } from '@idl/shared';

import { RunnerFunction } from '../runner.interface';
import { ICompareCellOutputs } from './helpers/compare-cells.interface';
import { RunNotebookAndCompareCells } from './helpers/run-notebook-and-compare-cells';

/**
 * Types of outputs from cells that we expect to have
 */
export const CELL_OUTPUT: ICompareCellOutputs[] = [
  {
    idx: 0,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 1,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 2,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 3,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 4,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 5,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 6,
    success: true,
    mimeTypes: ['text/plain'],
  },
];

/**
 * Function that runs basic tests for ENVI message listeners
 */
export const RunENVIMessageListenerTestNotebook: RunnerFunction = async (
  init
) => {
  await RunNotebookAndCompareCells(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/envi-message-listener.idlnb'
    ),
    CELL_OUTPUT,
    init.notebooks.controller
  );
};
