import { GetExtensionPath, Sleep } from '@idl/shared';
import { GetRealDiagnostic, OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';
import { CodeActionParams } from 'vscode-languageserver';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies code actions do the right thing
 */
export const ProCodeCodeActionsNoExisting: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/problems/idl_code_actions_1.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(1000);

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
    range: diags[1].range,
    context: {
      diagnostics: [diags[2]],
    },
  };

  const actions = await init.client.client.sendRequest(
    'textDocument/codeAction',
    codeActionParams
  );

  // verify hover has return
  expect(actions).toEqual([
    {
      title: 'Disable "unused-var" for line',
      command: {
        command: 'idl.code.fixProblem',
        arguments: [
          [
            {
              line: 11,
              text: '  ; idl-disable-next-line unused-var\n  lookup = $',
            },
          ],
        ],
        title: 'idl.code.fixProblem',
      },
      kind: 'refactor.inline',
    },
    {
      title: 'Disable "unused-var" for file or cell',
      command: {
        command: 'idl.code.fixProblem',
        arguments: [
          [
            {
              line: 0,
              text: ';+\n; idl-disable unused-var\n;-\n\n;+',
            },
          ],
        ],
        title: 'idl.code.fixProblem',
      },
      kind: 'refactor.inline',
    },
    {
      title: 'Disable "unused-var" in user settings',
      command: {
        command: 'idl.code.disableProblemSetting',
        arguments: [
          {
            code: 104,
            scope: 'user',
          },
        ],
        title: 'idl.code.disableProblemSetting',
      },
      kind: '',
    },
    {
      title: 'Disable "unused-var" for workspace',
      command: {
        command: 'idl.code.disableProblemSetting',
        arguments: [
          {
            code: 104,
            scope: 'workspace',
          },
        ],
        title: 'idl.code.disableProblemSetting',
      },
      kind: '',
    },
    {
      title: 'Learn more about "unused-var"',
      command: {
        command: 'idl.docs.open',
        arguments: ['/problem-codes/codes/104.html'],
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

/**
 * Verifies code actions do the right thing
 */
export const ProCodeCodeActionsExisting: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/problems/idl_code_actions_2.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(1000);

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
    range: diags[1].range,
    context: {
      diagnostics: [diags[2]],
    },
  };

  const actions = await init.client.client.sendRequest(
    'textDocument/codeAction',
    codeActionParams
  );

  // verify hover has return
  expect(actions).toEqual([
    {
      title: 'Disable "unused-var" for line',
      command: {
        command: 'idl.code.fixProblem',
        arguments: [
          [
            {
              line: 15,
              text: '  ; idl-disable-next-line undefined-var, unused-var',
            },
          ],
        ],
        title: 'idl.code.fixProblem',
      },
      kind: 'refactor.inline',
    },
    {
      title: 'Disable "unused-var" for file or cell',
      command: {
        command: 'idl.code.fixProblem',
        arguments: [
          [
            {
              line: 1,
              text: '; idl-disable illegal-arrow, unused-var',
            },
          ],
        ],
        title: 'idl.code.fixProblem',
      },
      kind: 'refactor.inline',
    },
    {
      title: 'Disable "unused-var" in user settings',
      command: {
        command: 'idl.code.disableProblemSetting',
        arguments: [
          {
            code: 104,
            scope: 'user',
          },
        ],
        title: 'idl.code.disableProblemSetting',
      },
      kind: '',
    },
    {
      title: 'Disable "unused-var" for workspace',
      command: {
        command: 'idl.code.disableProblemSetting',
        arguments: [
          {
            code: 104,
            scope: 'workspace',
          },
        ],
        title: 'idl.code.disableProblemSetting',
      },
      kind: '',
    },
    {
      title: 'Learn more about "unused-var"',
      command: {
        command: 'idl.docs.open',
        arguments: ['/problem-codes/codes/104.html'],
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
