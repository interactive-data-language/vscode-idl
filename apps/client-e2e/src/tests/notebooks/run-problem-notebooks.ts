import { GetExtensionPath } from '@idl/shared';

import { RunnerFunction } from '../runner.interface';
import {
  DEFAULT_RUNNER_TIMEOUT,
  RunNotebookAndCompareCells,
} from './helpers/run-notebook-and-compare-cells';

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
 */
export const RunProblemNotebooks: RunnerFunction = async (init) => {
  /**
   * Verify we do the right thing on a stop
   */
  await RunNotebookAndCompareCells(
    GetExtensionPath('idl/test/client-e2e/notebooks/problems/on-stop.idlnb'),
    [
      {
        idx: 0,
        success: true,
        mimeTypes: [],
      },
      {
        idx: 1,
        success: false,
        mimeTypes: ['text/plain'],
      },
      {
        idx: 2,
        success: undefined,
        mimeTypes: [],
      },
      {
        idx: 3,
        success: undefined,
        mimeTypes: [],
      },
    ],
    init.notebooks.controller,
    DEFAULT_RUNNER_TIMEOUT
  );

  /**
   * Re-run our stop notebook to make sure we have properly returned from
   * our stop
   */
  await RunNotebookAndCompareCells(
    GetExtensionPath('idl/test/client-e2e/notebooks/problems/on-stop.idlnb'),
    [
      {
        idx: 0,
        success: true,
        mimeTypes: [],
      },
    ],
    init.notebooks.controller,
    DEFAULT_RUNNER_TIMEOUT
  );

  /**
   * First syntax error notebook
   */
  await RunNotebookAndCompareCells(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/problems/syntax-err1.idlnb'
    ),
    [
      {
        idx: 0,
        success: false,
        mimeTypes: ['text/plain'],
      },
      {
        idx: 1,
        success: undefined,
        mimeTypes: [],
      },
    ],
    init.notebooks.controller,
    DEFAULT_RUNNER_TIMEOUT
  );

  /**
   * Second syntax error notebook
   */

  await RunNotebookAndCompareCells(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/problems/syntax-err2.idlnb'
    ),
    [
      {
        idx: 0,
        success: false,
        mimeTypes: ['text/plain'],
      },
      {
        idx: 1,
        success: undefined,
        mimeTypes: [],
      },
    ],
    init.notebooks.controller,
    DEFAULT_RUNNER_TIMEOUT
  );
};
