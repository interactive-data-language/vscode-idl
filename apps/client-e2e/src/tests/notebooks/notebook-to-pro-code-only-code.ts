import { INotebookToProCodeOptions } from '@idl/notebooks/types';
import {
  GetExtensionPath,
  IDL_COMMANDS,
  IDL_LANGUAGE_NAME,
  Sleep,
} from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies we can convert notebooks to PRO code
 */
export const NotebookToProCodeOnlyCode: RunnerFunction = async (init) => {
  const nbUri = GetExtensionPath(
    'idl/test/client-e2e/notebooks/notebook-to-pro-code/test-notebook.idlnb'
  );

  const expectedUri = GetExtensionPath(
    'idl/test/client-e2e/notebooks/notebook-to-pro-code/test_notebook_only_code.pro'
  );

  // open notebook
  const nb = await OpenNotebookInVSCode(nbUri, true);

  // short pause to parse
  await Sleep(500);

  // get the code we should expect, independent of line ending
  const expected = readFileSync(expectedUri, { encoding: 'utf-8' }).split(
    /\r?\n/gim
  );

  /**
   * Options to convert to PRO code
   */
  const options: INotebookToProCodeOptions = {
    includeAllCells: false,
  };

  // convert to PRO code
  await vscode.commands.executeCommand(
    IDL_COMMANDS.NOTEBOOKS.NOTEBOOK_TO_PRO_CODE,
    options
  );

  // short pause
  await Sleep(100);

  // get active editor
  const editor = vscode.window.activeTextEditor;

  // make sure we have a window that appeared
  expect(editor).toBeDefined();

  // make sure it has IDL as language
  expect(editor?.document?.languageId).toEqual(IDL_LANGUAGE_NAME);

  // get strings in editor
  const actualContent = editor.document.getText().split(/\r?\n/gim);

  // close editor
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

  // pause momentarily
  await Sleep(100);

  // verify we closed
  expect(vscode.window.activeTextEditor).toBeUndefined();

  // verify the content matches what we should have
  expect(expected).toEqual(actualContent);

  // close notebook
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

  // pause momentarily
  await Sleep(100);

  // verify we cleaned up
  expect(vscode.window.activeNotebookEditor).toBeUndefined();
};
