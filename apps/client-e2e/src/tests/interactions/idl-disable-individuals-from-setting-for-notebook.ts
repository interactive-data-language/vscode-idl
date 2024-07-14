import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { IAutoFixIDLDiagnostic } from '@idl/types/diagnostic';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';
import { GetWorkspaceConfig } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Makes sure that we can disable single problems and it works for notebooks
 */
export const IDLDisableIndividualsFromSettingsForNotebook: RunnerFunction =
  async () => {
    // open notebook
    const nb = await OpenNotebookInVSCode(
      GetExtensionPath('idl/test/client-e2e/problems/code-actions.idlnb')
    );

    // short pause to make sure we open and parse
    await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

    /** Get notebook cells */
    const cells = nb
      .getCells()
      .filter((cell) => cell.kind === vscode.NotebookCellKind.Code);

    // verify problems
    expect(
      cells.map(
        (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
      )
    ).toEqual([1]);

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
    await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

    // make sure it ran fine
    expect(ok).toBeTruthy();

    // verify problems
    expect(
      cells.map(
        (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
      )
    ).toEqual([0]);

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
    await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

    // verify problems
    expect(
      cells.map(
        (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
      )
    ).toEqual([1]);
  };
