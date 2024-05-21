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
    mimeTypes: [],
  },
  {
    idx: 1,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE, IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 2,
    success: true,
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 3,
    success: true,
    mimeTypes: ['text/plain'],
  },
  {
    idx: 4,
    success: true,
    mimeTypes: [],
  },
];

/**
 * Function that makes sure we can embed multiple graphics from one
 * cell when we start ENVI
 *
 * Also makes sure we embed direct graphics when the ENVI Ui is hidden
 */
export const RunENVIMultiPlotNotebook: RunnerFunction = async (init) => {
  await RunNotebookAndCompareCells(
    GetExtensionPath('idl/test/client-e2e/notebooks/envi-multi-plot.idlnb'),
    CELL_OUTPUT,
    init.notebooks.controller
  );
};
