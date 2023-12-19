import { IDL_COMMANDS, IDL_NOTEBOOK_LANGUAGE_NAME, Sleep } from '@idl/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies we can create a new notebook document and open it with the right language ID
 */
export const NewNotebook: RunnerFunction = async (init) => {
  // make a new notebook - arg is to tell us that we dont want to save
  await vscode.commands.executeCommand(
    IDL_COMMANDS.NOTEBOOKS.NEW_NOTEBOOK,
    true
  );

  // short pause
  await Sleep(100);

  // get active editor
  const editor = vscode.window.activeNotebookEditor;

  // make sure we have an IDL Notebook as our editor
  expect(editor?.notebook?.notebookType).toEqual(IDL_NOTEBOOK_LANGUAGE_NAME);
};
