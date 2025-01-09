import { GetExtensionPath, Sleep } from '@idl/shared/extension';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';
import {
  SemanticTokensParams,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { CLIENT_E2E_CONFIG } from '../../client-e2e-config.interface';
import { RunnerFunction } from '../../runner.interface';

/**
 * Regression test to make sure our main user interactions don't change reported
 * problems for a file that is a link
 */
export const InteractionSymbolicLinkProblemReporting: RunnerFunction = async (
  init
) => {
  const doc1 = await OpenFileInVSCode(
    GetExtensionPath('idl/test/links/dir1/test_with_problems.pro')
  );
  const nProb1 = 1;

  const doc2 = await OpenFileInVSCode(
    GetExtensionPath('idl/test/links/dir2/link/test_with_problems.pro')
  );
  const nProb2 = 0;

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(nProb1);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(nProb2);

  /**
   * Get URi for the notebook
   */
  const uri2 = doc2.uri.toString();

  /**
   * Event params for LSP user interaction
   */
  const hoverParams: TextDocumentPositionParams = {
    textDocument: {
      uri: uri2,
    },
    position: {
      line: 2,
      character: 3,
    },
  };

  /**
   * Make sure no changes from hover help
   */
  await init.client.client.sendRequest('textDocument/hover', hoverParams);

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(nProb1);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(nProb2);

  /**
   * Make sure no changes from token definitions
   */
  await init.client.client.sendRequest('textDocument/definition', hoverParams);

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(nProb1);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(nProb2);

  /**
   * Event params for LSP user interaction
   */
  const completionParams: TextDocumentPositionParams = {
    textDocument: {
      uri: uri2,
    },
    position: {
      line: 2,
      character: 8,
    },
  };

  /**
   * Make sure no changes from completion
   */
  await init.client.client.sendRequest(
    'textDocument/completion',
    completionParams
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(nProb1);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(nProb2);

  /**
   * Event params for LSP semantic token request
   */
  const tokenParams: SemanticTokensParams = {
    textDocument: {
      uri: uri2,
    },
  };

  /**
   * Make sure no changes from completion
   */
  await init.client.client.sendRequest(
    'textDocument/semanticTokens/full',
    tokenParams
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc1.uri).length).toEqual(nProb1);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc2.uri).length).toEqual(nProb2);
};
