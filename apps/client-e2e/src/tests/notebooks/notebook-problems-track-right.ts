import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

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
  await Sleep(1000);

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
  await Sleep(1000);

  /**
   * Verify problems after have shifted
   */
  expect(
    nb
      .getCells()
      .map((cell) => vscode.languages.getDiagnostics(cell.document.uri).length)
  ).toEqual([0, 3]);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);
};
