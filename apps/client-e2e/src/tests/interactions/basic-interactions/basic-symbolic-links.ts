import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../../client-e2e-config.interface';
import { RunnerFunction } from '../../runner.interface';

/**
 * Make sure that we dont show duplicates when we have files from symbolic links
 */
export const BasicSymbolicLinks: RunnerFunction = async (init) => {
  const doc1 = await OpenFileInVSCode(
    GetExtensionPath('idl/test/links/dir1/test.pro')
  );

  const doc2 = await OpenFileInVSCode(
    GetExtensionPath('idl/test/links/dir2/link/test.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(0);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(0);
};
