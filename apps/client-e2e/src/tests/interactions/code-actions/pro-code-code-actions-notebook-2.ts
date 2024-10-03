import { GetExtensionPath, Sleep } from '@idl/shared';
import { GetRealDiagnostic, OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';
import { CodeActionParams } from 'vscode-languageserver';

import { CLIENT_E2E_CONFIG } from '../../client-e2e-config.interface';
import { RunnerFunction } from '../../runner.interface';

/**
 * Verifies code actions do the right thing for notebooks
 */
export const ProCodeCodeActionsNotebook2: RunnerFunction = async (init) => {
  /** Open notebooks */
  const nb = await OpenNotebookInVSCode(
    GetExtensionPath('idl/test/client-e2e/problems/code-actions.idlnb')
  );

  /** Get first cell */
  const doc = nb.getCells()[1].document;

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // get diagnostics
  const diags = GetRealDiagnostic(vscode.languages.getDiagnostics(doc.uri));

  // verify problems
  expect(diags.length).toEqual(3);

  /**
   * Get URi for the notebook
   */
  const uri = doc.uri.toString();

  /**
   * Event params for LSP user interaction
   */
  const codeActionParams: CodeActionParams = {
    textDocument: {
      uri,
    },
    range: diags[0].range,
    context: {
      diagnostics: [diags[0]],
    },
  };

  const actions = await init.client.client.sendRequest(
    'textDocument/codeAction',
    codeActionParams
  );

  // verify hover has return
  expect(actions).toEqual([
    {
      title: 'Disable "undefined-var" for line',
      command: {
        command: 'idl.code.fixProblem',
        arguments: [
          [
            {
              line: 0,
              text: '; idl-disable-next-line undefined-var\nbillboards.thing',
              cell: 1,
            },
          ],
        ],
        title: 'idl.code.fixProblem',
      },
      kind: 'refactor.inline',
    },
    {
      title: 'Disable "undefined-var" for file or cell',
      command: {
        command: 'idl.code.fixProblem',
        arguments: [
          [
            {
              line: 0,
              text: ';+\n; idl-disable undefined-var\n;-\n\nbillboards.thing',
              cell: 1,
            },
          ],
        ],
        title: 'idl.code.fixProblem',
      },
      kind: 'refactor.inline',
    },
    {
      title: 'Disable "undefined-var" in user settings',
      command: {
        command: 'idl.code.disableProblemSetting',
        arguments: [
          {
            code: 99,
            scope: 'user',
          },
        ],
        title: 'idl.code.disableProblemSetting',
      },
      kind: '',
    },
    {
      title: 'Disable "undefined-var" for workspace',
      command: {
        command: 'idl.code.disableProblemSetting',
        arguments: [
          {
            code: 99,
            scope: 'workspace',
          },
        ],
        title: 'idl.code.disableProblemSetting',
      },
      kind: '',
    },
    {
      title: 'Learn more about "undefined-var"',
      command: {
        command: 'idl.docs.open',
        arguments: ['/problem-codes/codes/99.html'],
        title: 'idl.docs.open',
      },
      kind: '',
    },
    {
      title: 'Learn how to configure reported problems',
      command: {
        command: 'idl.docs.open',
        arguments: ['/problem-codes/configuration.html'],
        title: 'idl.docs.open',
      },
      kind: '',
    },
  ]);
};
