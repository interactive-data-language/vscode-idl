import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies
 */
export const NotebooksNoDuplicates: RunnerFunction = async (init) => {
  const doc = await OpenNotebookInVSCode(
    GetExtensionPath('idl/test/client-e2e/notebooks/problems-before.idlnb')
  );

  // short pause
  await Sleep(250);

  /**
   * Get first cell which is code
   */
  const second = doc.cellAt(1);

  /**
   * Get number of original diagnostics
   */
  const nOrig = vscode.languages.getDiagnostics(second.document.uri).length;

  // focus on the top cell
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_FOCUS_TOP);

  // short pause
  await Sleep(250);

  // delete the first cell
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_CELL_DELETE);

  // short pause
  await Sleep(250);

  /**
   * Get first cell which is code
   */
  const first = doc.cellAt(0);

  /**
   * Get number of original diagnostics
   */
  const nAfter = vscode.languages.getDiagnostics(first.document.uri).length;

  //  verify problems
  expect(nAfter).toEqual(nOrig);

  // insert new code cell at top
  await vscode.commands.executeCommand(
    VSCODE_COMMANDS.NOTEBOOK_INSERT_CODE_CELL_AT_TOP
  );

  // short pause
  await Sleep(250);

  /**
   * Get second cell again
   */
  const secondRound2 = doc.cellAt(1);

  /**
   * Get number of problems
   */
  const nAfterRound2 = vscode.languages.getDiagnostics(
    secondRound2.document.uri
  ).length;

  //  verify problems
  expect(nAfterRound2).toEqual(nOrig);

  // close
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);
};
