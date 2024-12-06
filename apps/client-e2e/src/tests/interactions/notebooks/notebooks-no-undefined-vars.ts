import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../../client-e2e-config.interface';
import { RunnerFunction } from '../../runner.interface';

/**
 * Verifies our variables are defined
 */
export const NotebooksNoUndefinedVars: RunnerFunction = async (init) => {
  const doc = await OpenNotebookInVSCode(
    GetExtensionPath('idl/test/client-e2e/notebooks/no-undefined-vars.idlnb')
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  //  no problems in first cell
  expect(
    vscode.languages.getDiagnostics(doc.cellAt(0).document.uri).length
  ).toEqual(0);

  // no problems in second cell
  expect(
    vscode.languages.getDiagnostics(doc.cellAt(1).document.uri).length
  ).toEqual(0);
};
