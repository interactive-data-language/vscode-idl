import { GetExtensionPath, Sleep } from '@idl/shared/extension';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../../client-e2e-config.interface';
import { RunnerFunction } from '../../runner.interface';

/**
 * Regression test for problem detection in symbolic links
 */
export const BasicSymbolicLinksWithProblems: RunnerFunction = async (init) => {
  const doc1 = await OpenFileInVSCode(
    GetExtensionPath('idl/test/links/dir1/test_with_problems.pro')
  );
  const nProb1 = 1;

  const doc2 = await OpenFileInVSCode(
    GetExtensionPath('idl/test/links/dir2/link/test_with_problems.pro')
  );
  const nProb2 = 0;

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(nProb1);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(nProb2);
};
