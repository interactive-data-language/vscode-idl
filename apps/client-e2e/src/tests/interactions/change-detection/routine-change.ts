import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenFileInVSCode, ReplaceDocumentContent } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../../client-e2e-config.interface';
import { RunnerFunction } from '../../runner.interface';

/**
 * Detects problems from changes in routines
 */
export const RoutineChange: RunnerFunction = async (init) => {
  const doc1 = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/change-detection/file1.pro')
  );

  const doc2 = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/change-detection/file2.pro'),
    true,
    true
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(0);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(0);

  // replace the content in our document
  await ReplaceDocumentContent(
    doc2,
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/change-detection/file2-after.pro'),
      'utf-8'
    )
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(1);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(0);

  // replace the content in our document
  await ReplaceDocumentContent(
    doc2,
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/change-detection/file2.pro'),
      'utf-8'
    )
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(0);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(0);
};
