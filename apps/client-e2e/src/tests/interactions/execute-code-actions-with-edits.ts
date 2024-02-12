import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { AutoFixProblem } from '@idl/types/problem-codes';
import { OpenFileInVSCode, OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Verifies code actions do the right thing for PRO files
 */
export const ExecuteCodeActionsWithEditForPROFile: RunnerFunction = async (
  init
) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/problems/code_actions_fix_before.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(250);

  const edit: AutoFixProblem = [
    {
      line: 0,
      text: ';+\n; idl-disable unused-var\n;-\n\n;+',
    },
  ];

  // execute our command and make sure it returns OK
  const ok = await vscode.commands.executeCommand(
    IDL_COMMANDS.CODE.FIX_PROBLEM,
    edit
  );

  // verify problems
  expect(ok).toBeTruthy();

  // make sure output is correct
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath(
        'idl/test/client-e2e/problems/code_actions_fix_after.pro'
      ),
      'utf-8'
    )
  );
};

/**
 * Verifies code actions do the right thing for IDL Notebooks files
 */
export const ExecuteCodeActionsWithEditForNotebook: RunnerFunction = async (
  init
) => {
  const nb = await OpenNotebookInVSCode(
    GetExtensionPath('idl/test/client-e2e/problems/code-actions-fix.idlnb')
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  const edit: AutoFixProblem = [
    {
      line: 0,
      text: ';+\n; idl-disable unused-var\n;-\n\n;+',
      cell: 0,
    },
  ];

  // execute our command and make sure it returns OK
  const ok = await vscode.commands.executeCommand(
    IDL_COMMANDS.CODE.FIX_PROBLEM,
    edit
  );

  // verify problems
  expect(ok).toBeTruthy();

  // get text document
  const doc = nb.getCells()[edit[0].cell].document;

  // make sure output is correct
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath(
        'idl/test/client-e2e/problems/code_actions_fix_cell_after.pro'
      ),
      'utf-8'
    )
  );
};
