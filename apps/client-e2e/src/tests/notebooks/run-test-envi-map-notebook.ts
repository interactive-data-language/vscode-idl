import { IDL_NOTEBOOK_MIME_TYPE } from '@idl/notebooks/types';
import { GetExtensionPath } from '@idl/shared';

import { RunnerFunction } from '../runner.interface';
import { ICompareCellOutputs } from './helpers/compare-cells.interface';
import {
  DEFAULT_RUNNER_TIMEOUT,
  RunNotebookAndCompareCells,
} from './helpers/run-notebook-and-compare-cells';

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
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
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
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
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
    mimeTypes: [IDL_NOTEBOOK_MIME_TYPE],
  },
];

/**
 * Function that runs a notebook with test maps
 */
export const RunTestENVIMapNotebook: RunnerFunction = async (init) => {
  await RunNotebookAndCompareCells(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/test-notebook-envi-maps.idlnb'
    ),
    CELL_OUTPUT,
    init.notebooks.controller,
    DEFAULT_RUNNER_TIMEOUT
  );
};
