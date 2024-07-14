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
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
  {
    idx: 12,
    success: true,
    mimeTypes: [],
  },
  {
    idx: 13,
    success: true,
    mimeTypes: [
      IDL_NOTEBOOK_MIME_TYPE,
      IDL_NOTEBOOK_MIME_TYPE,
      IDL_NOTEBOOK_MIME_TYPE,
    ],
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

  await RunNotebookAndCompareCells(
    GetExtensionPath('idl/test/client-e2e/notebooks/test-notebook.idlnb'),
    CELL_OUTPUT,
    init.notebooks.controller,
    false
  );
};
