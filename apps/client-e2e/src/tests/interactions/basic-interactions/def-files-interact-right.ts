import { GetExtensionPath, Sleep } from '@idl/shared/extension';
import { OpenFileInVSCode, ReplaceDocumentContent } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';
import {
  SemanticTokens,
  SemanticTokensParams,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { CLIENT_E2E_CONFIG } from '../../client-e2e-config.interface';
import { RunnerFunction } from '../../runner.interface';

/**
 * Verifies working with notebooks does the right thing with changes and doesnt trigger
 * PRO code parsing in the language server
 */
export const DefFilesInteractRight: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/def-files/testclente2e.pro.def')
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  /**
   * Get URi for the notebook
   */
  const uri = doc.uri.toString();

  /**
   * Event params for LSP user interaction
   */
  const hoverParams: TextDocumentPositionParams = {
    textDocument: {
      uri,
    },
    position: {
      line: 25,
      character: 11,
    },
  };

  // verify hover has return
  expect(
    await init.client.client.sendRequest('textDocument/hover', hoverParams)
  ).toBeTruthy();

  // verify definition has return
  expect(
    await init.client.client.sendRequest('textDocument/definition', hoverParams)
  ).toBeFalsy();

  /**
   * Event params for LSP user interaction
   */
  const completionParams: TextDocumentPositionParams = {
    textDocument: {
      uri,
    },
    position: {
      line: 26,
      character: 0,
    },
  };

  // verify definition has return
  expect(
    await init.client.client.sendRequest(
      'textDocument/completion',
      completionParams
    )
  ).toBeFalsy();

  /**
   * Event params for LSP semantic token request
   */
  const tokenParams: SemanticTokensParams = {
    textDocument: {
      uri: uri,
    },
  };

  // verify semantic tokens
  expect(
    (await init.client.client.sendRequest(
      'textDocument/semanticTokens/full',
      tokenParams
    )) as SemanticTokens
  ).toBeFalsy();

  /**
   * Get number of original diagnostics
   */
  const nOrig = vscode.languages.getDiagnostics(doc.uri).length;

  // replace the content in our document
  await ReplaceDocumentContent(
    doc,
    readFileSync(
      GetExtensionPath(
        'idl/test/client-e2e/def-files/testclente2e-changes.pro.def'
      ),
      'utf-8'
    )
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(nOrig);
};
