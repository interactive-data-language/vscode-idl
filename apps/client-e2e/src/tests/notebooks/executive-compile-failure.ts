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
    success: false,
    mimeTypes: ['text/plain'],
  },
];

/**
 * Makes sure we detect failures when we fail to compile a cell
 */
export const ExecutiveCompileFailure: RunnerFunction = async (init) => {
  await RunNotebookAndCompareCells(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/executive-commands/fail-on-fake-cell.idlnb'
    ),
    CELL_OUTPUT,
    init.notebooks.controller
  );
};
