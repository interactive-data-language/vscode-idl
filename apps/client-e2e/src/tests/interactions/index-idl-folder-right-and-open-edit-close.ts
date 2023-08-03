import { GetExtensionPath, Sleep } from '@idl/shared';
import {
  OpenFileInVSCode,
  ReplaceDocumentContent,
  VSCODE_COMMANDS,
} from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verify that we index the "idl" folder correctly in the extension
 *
 * There's a bug that the paths have lower case "c" drives and that
 * makes paths invalid as key/value pairs in objects
 *
 * This test also: opens, updates, closes (without saving) and verifies
 * the problems are correctly synced after each action
 */
export const IndexIDLFolderRightAndOpenEditClose: RunnerFunction = async (
  init
) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/vscode/vscode_notebookinit.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(250);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(0);

  // replace the content in our document
  await ReplaceDocumentContent(
    doc,
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/index_folder_test.pro'),
      'utf-8'
    )
  );

  // short pause
  await Sleep(250);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(1);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

  // short pause
  await Sleep(250);

  // verify problems are empty again via original content
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(0);
};
