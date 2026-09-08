import { GetExtensionPath } from '@idl/idl/files';
import { Sleep } from '@idl/shared/extension';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../../runner.interface';
import { TEST_CLIENT_CONFIG } from '../../test-client-config.interface';

/**
 * Make sure that we dont show duplicates when we have files from symbolic links
 */
export const BasicSymbolicLinks: RunnerFunction = async (init) => {
  const doc1 = await OpenFileInVSCode(
    GetExtensionPath('apps/test/idl/links/dir1/test.pro'),
  );

  const doc2 = await OpenFileInVSCode(
    GetExtensionPath('apps/test/idl/links/dir2/link/test.pro'),
  );

  // short pause to make sure we open and parse
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(0);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(0);
};
