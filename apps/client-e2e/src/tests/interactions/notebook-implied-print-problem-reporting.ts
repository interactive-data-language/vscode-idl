import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Function that verifies problems reported for implied print
 */
export const NotebookImpliedPrintProblemReporting: RunnerFunction = async (
  init
) => {
  // open our notebook
  const nb = await OpenNotebookInVSCode(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/problems/implied-print.idlnb'
    ),
    true
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /** Get current cells */
  const cells = nb.getCells();

  /**
   * Verify no problems
   */
  expect(
    cells.map(
      (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
    )
  ).toEqual([0, 1, 0]);
};
