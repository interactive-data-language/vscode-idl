import { GetExtensionPath, Sleep } from '@idl/shared';
import { GetWorkspaceConfig } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Makes sure that we can disable reporting of problems using our settings and that
 * it applies to notebooks
 */
export const IDLDisableAllFromSettingsForNotebook: RunnerFunction =
  async () => {
    // get the current workspace config
    const config = GetWorkspaceConfig();

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

    // disable reporting problems
    await config.update(
      IDL_EXTENSION_CONFIG_KEYS.problemsReportProblems,
      false,
      true
    );

    // short pause
    await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

    // verify problems
    expect(
      cells.map(
        (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
      )
    ).toEqual([0]);

    // disable reporting problems
    await config.update(
      IDL_EXTENSION_CONFIG_KEYS.problemsReportProblems,
      true,
      true
    );

    // short pause to make sure we open and parse
    await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

    // verify problems
    expect(
      cells.map(
        (cell) => vscode.languages.getDiagnostics(cell.document.uri).length
      )
    ).toEqual([1]);
  };
