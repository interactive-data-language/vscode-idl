import { EXAMPLE_NOTEBOOKS } from '@idl/notebooks/shared';
import {
  CleanPath,
  IDL_COMMANDS,
  IDL_NOTEBOOK_LANGUAGE_NAME,
  Sleep,
} from '@idl/shared';
import expect from 'expect';
import { join } from 'path';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies we can open our IDL example notebook
 */
export const OpenIDLNotebookExample: RunnerFunction = async (init) => {
  // make a new notebook
  await vscode.commands.executeCommand(IDL_COMMANDS.NOTEBOOKS.OPEN_IDL_EXAMPLE);

  // short pause
  await Sleep(100);

  // get active editor
  const editor = vscode.window.activeNotebookEditor;

  // make sure we have an IDL Notebook as our editor
  expect(editor?.notebook?.notebookType).toEqual(IDL_NOTEBOOK_LANGUAGE_NAME);

  // verify the file we open
  expect(CleanPath(editor?.notebook?.uri.fsPath) || '').toEqual(
    join(EXAMPLE_NOTEBOOKS, 'hello-world-idl.idlnb')
  );
};
