import { GetExtensionPath } from '@idl/idl/files';
import { Sleep } from '@idl/shared/extension';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../../runner.interface';
import { TEST_CLIENT_CONFIG } from '../../test-client-config.interface';

/**
 * Verifies our variables are defined
 */
export const NotebooksNoUndefinedVars: RunnerFunction = async (init) => {
  const doc = await OpenNotebookInVSCode(
    GetExtensionPath(
      'apps/test/idl/client-e2e/notebooks/no-undefined-vars.idlnb',
    ),
  );

  // short pause
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  //  no problems in first cell
  expect(
    vscode.languages.getDiagnostics(doc.cellAt(0).document.uri).length,
  ).toEqual(0);

  // no problems in second cell
  expect(
    vscode.languages.getDiagnostics(doc.cellAt(1).document.uri).length,
  ).toEqual(0);
};
