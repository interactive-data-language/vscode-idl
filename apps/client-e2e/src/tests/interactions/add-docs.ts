import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { OpenFileInVSCode, ReplaceDocumentContent } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Function that verifies we can correctly add docs to text document
 */
export const AddDocs: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/docs/docs_test.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(100);

  // add docs
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.ADD_DOCS_TO_FILE);

  // short pause
  await Sleep(100);

  // make sure output is correct
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/docs/docs_test_out.pro'),
      'utf-8'
    )
  );

  // replace the content in our document
  await ReplaceDocumentContent(
    doc,
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/docs/docs_test_edit.pro'),
      'utf-8'
    )
  );

  // short pause
  await Sleep(100);

  // add docs
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.ADD_DOCS_TO_FILE);

  // short pause
  await Sleep(100);

  // make sure output is correct
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/docs/docs_test_edit_out.pro'),
      'utf-8'
    )
  );
};
