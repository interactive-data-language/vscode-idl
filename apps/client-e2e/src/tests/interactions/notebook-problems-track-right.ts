import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Function that verifies adding a new cell does not accidentally inherit old problems
 */
export const NotebookProblemsTrackRight: RunnerFunction = async (init) => {
  // open our notebook
  const nb = await OpenNotebookInVSCode(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/problems-track-right.idlnb'
    ),
    true
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /**
   * Verify problems before
   */
  expect(
    nb
      .getCells()
      .map((cell) => vscode.languages.getDiagnostics(cell.document.uri).length)
  ).toEqual([3]);

  // focus the top cell
  // await vscode.commands.executeCommand('notebook.focusTop');
  await vscode.commands.executeCommand(
    'notebook.cell.insertCodeCellAboveAndFocusContainer',
    nb
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /** Get current cells */
  const cells = nb.getCells();

  /**
   * Verify problems after have shifted
   */
  expect(
    cells.map(
      (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
    )
  ).toEqual([0, 3]);

  // delete the bottom cell
  await vscode.commands.executeCommand('notebook.focusBottom', nb);
  await vscode.commands.executeCommand('notebook.cell.delete', nb);

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /**
   * Verify problems no longer reported for deleted cell
   */
  expect(
    cells.map(
      (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
    )
  ).toEqual([0, 0]);
};
