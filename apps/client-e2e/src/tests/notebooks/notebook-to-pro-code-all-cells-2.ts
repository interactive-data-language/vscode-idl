import { GetExtensionPath } from '@idl/idl/files';
import { IDL_COMMANDS, IDL_LANGUAGE_NAME, Sleep } from '@idl/shared/extension';
import { INotebookToProCodeOptions } from '@idl/types/notebooks';
import { LINE_SEPARATOR } from '@idl/types/tokenizer';
import { VSCODE_COMMANDS } from '@idl/types/vscode';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies we can convert notebooks to PRO code
 */
export const NotebookToProCodeAllCells2: RunnerFunction = async (init) => {
  const nbUri = GetExtensionPath(
    'idl/test/client-e2e/notebooks/notebook-to-pro-code/dl-training-example.idlnb'
  );

  const expectedUri = GetExtensionPath(
    'idl/test/client-e2e/notebooks/notebook-to-pro-code/dl_training_example_output_all.pro'
  );

  // open notebook
  const nb = await OpenNotebookInVSCode(nbUri, true);

  // short pause to parse
  await Sleep(500);

  // get the code we should expect, independent of line ending
  const expected = readFileSync(expectedUri, { encoding: 'utf-8' }).split(
    LINE_SEPARATOR
  );

  /**
   * Options to convert to PRO code
   */
  const options: INotebookToProCodeOptions = {
    includeAllCells: true,
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
  const actualContent = editor.document.getText().split(LINE_SEPARATOR);

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
