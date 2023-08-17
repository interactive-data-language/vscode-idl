import { GetExtensionPath, Sleep } from '@idl/shared';
import {
  OpenFileInVSCode,
  ReplaceDocumentContent,
  VSCODE_COMMANDS,
} from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';
import {
  SemanticTokensParams,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies working with tasks does the right thing with changes and doesnt trigger
 * PRO code parsing in the language server
 */
export const TasksInteractRight: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/envitasktest.task')
  );

  // short pause to make sure we open and parse
  await Sleep(250);

  /**
   * Get number of original diagnostics
   */
  const nOrig = vscode.languages.getDiagnostics(doc.uri).length;

  // replace the content in our document
  await ReplaceDocumentContent(
    doc,
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/envitasktest-changes.task'),
      'utf-8'
    )
  );

  // short pause
  await Sleep(250);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(nOrig);

  /**
   * Event params for LSP user interaction
   */
  const params: TextDocumentPositionParams = {
    textDocument: {
      uri: doc.uri.toString(),
    },
    position: {
      line: 0,
      character: 0,
    },
  };

  /**
   * Event params for LSP semantic token request
   */
  const tokenParams: SemanticTokensParams = {
    textDocument: {
      uri: doc.uri.toString(),
    },
  };

  // send all requests that might trigger parsing
  await init.client.client.sendRequest('textDocument/hover', params);
  await init.client.client.sendRequest('textDocument/completion', params);
  await init.client.client.sendRequest('textDocument/definition', params);
  await init.client.client.sendRequest(
    'textDocument/semanticTokens/full',
    tokenParams
  );

  // short pause
  await Sleep(250);

  // clear any existing outputs
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);
};
