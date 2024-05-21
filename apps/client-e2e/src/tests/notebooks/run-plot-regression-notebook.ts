import { GetExtensionPath } from '@idl/shared';
import { IDL_NOTEBOOK_MIME_TYPE } from '@idl/types/notebooks';

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
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 1,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
];

/**
 * Function that makes sure plots behave as we expect and get re-embedded
 * on property change
 */
export const RunPlotRegressionNotebook: RunnerFunction = async (init) => {
  await RunNotebookAndCompareCells(
    GetExtensionPath('idl/test/client-e2e/notebooks/plot-regression.idlnb'),
    CELL_OUTPUT,
    init.notebooks.controller
  );
};
