import { GetExtensionPath, IDL_COMMANDS } from '@idl/shared';
import { Sleep } from '@idl/tests/helpers';
import { OpenFileInVSCode, ReplaceDocumentContent } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Correct text that we can compile without syntax errors
 */
const VALID_TEXT = `
compile_opt idl2

print, 42

end
`;

/**
 * Function that verifies we can track syntax errors
 */
export const SyntaxErrorTracking: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // open file
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/debug/compile_error.pro')
  );

  /** Get original text */
  const orig = doc.getText();

  // short pause to make sure we open and parse
  await Sleep(100);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(0);

  /**
   * Compile and make sure we report an error
   * **********************************************************************
   */

  // compile
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.COMPILE);

  // short pause to make sure we open and parse
  await Sleep(100);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(1);

  /**
   * Fix syntax error and make sure no syntax errors
   * **********************************************************************
   */

  // replace the content in our document
  await ReplaceDocumentContent(doc, VALID_TEXT);

  // compile
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.COMPILE);

  // short pause to make sure we open and parse
  await Sleep(100);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(0);

  /**
   *  Go back to the original content and make sure we have the same errors
   * **********************************************************************
   */

  // replace the content in our document
  await ReplaceDocumentContent(doc, orig);

  // compile
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.COMPILE);

  // short pause to make sure we open and parse
  await Sleep(100);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(1);
};
