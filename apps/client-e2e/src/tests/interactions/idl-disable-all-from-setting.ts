import { GetExtensionPath, Sleep } from '@idl/shared';
import { GetWorkspaceConfig } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Makes sure that we can disable reporting of problems using our settings
 */
export const IDLDisableAllFromSettings: RunnerFunction = async () => {
  // get the current workspace config
  const config = GetWorkspaceConfig();

  // open file
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/problems/idl_disable_all_setting.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(3);

  // disable reporting problems
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.problemsReportProblems,
    false,
    true
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify no problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(0);

  // disable reporting problems
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.problemsReportProblems,
    true,
    true
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems are back to normal
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(3);
};
