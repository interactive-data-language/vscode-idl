import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { IAutoFixIDLDiagnostic } from '@idl/types/diagnostic';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
import { GetWorkspaceConfig } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Makes sure that we can disable single problems
 */
export const IDLDisableIndividualsFromSettings: RunnerFunction = async () => {
  // open file
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/problems/idl_disable_all_setting.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(250);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(3);

  // create payload
  const toDisable: IAutoFixIDLDiagnostic = {
    code: IDL_PROBLEM_CODES.UNUSED_VARIABLE,
    scope: 'user',
  };

  // run command
  const ok = await vscode.commands.executeCommand(
    IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
    toDisable
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // make sure it ran fine
  expect(ok).toBeTruthy();

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(1);

  // run command again - should return "false" because we didnt add because it exists already
  const ok2 = await vscode.commands.executeCommand(
    IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
    toDisable
  );

  // make sure it ran fine
  expect(ok2).toBeFalsy();

  // get config
  const config = GetWorkspaceConfig();

  // reset
  await config.update(
    IDL_EXTENSION_CONFIG_KEYS.problemsIgnoreProblems,
    [],
    true
  );

  // short pause to make sure we have updates
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems are back at the original value
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(3);
};
