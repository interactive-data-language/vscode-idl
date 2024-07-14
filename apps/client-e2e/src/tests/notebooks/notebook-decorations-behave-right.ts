import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import {
  GetTextEditorForURI,
  OpenNotebookInVSCode,
  ReplaceEditorContent,
} from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Function that verifies decorations do the right things for notebooks
 */
export const NotebookDecorationsBehaveRight: RunnerFunction = async (init) => {
  // open our notebook
  const nb = await OpenNotebookInVSCode(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/problems/decorations.idlnb'
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
  ).toEqual([0, 0]);

  /**
   * Run first cell, which fails
   */
  await vscode.commands.executeCommand('notebook.focusTop', nb);
  await vscode.commands.executeCommand('notebook.cell.execute', nb);
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /**
   * Verify first cell is bad
   */
  expect(
    cells.map(
      (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
    )
  ).toEqual([1, 0]);

  /**
   * Run second cell, which fails
   */
  await vscode.commands.executeCommand('notebook.focusBottom', nb);
  await vscode.commands.executeCommand('notebook.cell.execute', nb);
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /**
   * Verify second cell is bad
   */
  expect(
    cells.map(
      (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
    )
  ).toEqual([1, 1]);

  // get editor for the first cell

  /** Get an open editor */
  const openEditor = GetTextEditorForURI(cells[0].document.uri);

  // make sure we found a matching editor (we use this API elsewhere)
  expect(openEditor).toBeDefined();

  // replace content of the editor
  await ReplaceEditorContent(openEditor, 'print, 42');

  /**
   * Run first cell again , which runs
   */
  await vscode.commands.executeCommand('notebook.focusTop', nb);
  await vscode.commands.executeCommand('notebook.cell.execute', nb);
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /**
   * Verify problems in first cell are fixed
   */
  expect(
    cells.map(
      (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
    )
  ).toEqual([0, 1]);

  // stop IDL
  await vscode.commands.executeCommand(IDL_COMMANDS.NOTEBOOKS.STOP);

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /**
   * Verify no problems after stop
   */
  expect(
    cells.map(
      (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
    )
  ).toEqual([0, 0]);
};
