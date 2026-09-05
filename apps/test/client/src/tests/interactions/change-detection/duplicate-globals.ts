import { GetExtensionPath } from '@idl/idl/files';
import { Sleep } from '@idl/shared/extension';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../../runner.interface';
import { TEST_CLIENT_CONFIG } from '../../test-client-config.interface';

/**
 * Make sure that we properly detect issues with global tokens
 * to report duplicate routines
 */
export const DuplicateGlobals: RunnerFunction = async (init) => {
  const doc1 = await OpenFileInVSCode(
    GetExtensionPath('apps/test/idl/client-e2e/change-detection/mypro1.pro'),
  );

  const doc2 = await OpenFileInVSCode(
    GetExtensionPath(
      'apps/test/idl/client-e2e/change-detection/mypro1-dup.pro',
    ),
  );

  // short pause to make sure we open and parse
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(1);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(1);
};
