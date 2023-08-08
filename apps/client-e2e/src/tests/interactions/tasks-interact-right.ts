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
 * Verifies task interaction does the right thing and we don't send too
 * many problems.
 *
 * This might not really test that we exclude from PRO and notebook paths,
 * but is something
 */
export const TasksInteractRight: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/envitasktest.task')
  );

  // short pause to make sure we open and parse
  await Sleep(250);

  /**
   * Get number of original diagnostics
   */
  const nOrig = vscode.languages.getDiagnostics(doc.uri).length;

  // replace the content in our document
  await ReplaceDocumentContent(
    doc,
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/envitasktest-changes.task'),
      'utf-8'
    )
  );

  // short pause
  await Sleep(250);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(nOrig);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);
};
