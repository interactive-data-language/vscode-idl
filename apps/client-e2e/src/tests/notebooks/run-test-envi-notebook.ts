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
  await RunNotebookAndCompareCells(
    GetExtensionPath('idl/test/client-e2e/notebooks/envi-test-notebook.idlnb'),
    CELL_OUTPUT,
    init.notebooks.controller
  );
};
