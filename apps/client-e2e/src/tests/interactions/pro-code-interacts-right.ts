import { GetExtensionPath } from '@idl/shared';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import {
  SemanticTokens,
  SemanticTokensParams,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies working with pro code does the right thing with changes and doesnt trigger
 * PRO code parsing in the language server
 */
export const ProCodeInteractRight: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/test_user_interaction.pro')
  );

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
      line: 8,
      character: 5,
    },
  };

  // verify hover has return
  expect(
    await init.client.client.sendRequest('textDocument/hover', hoverParams)
  ).toBeTruthy();

  // verify definition has return
  expect(
    await init.client.client.sendRequest('textDocument/definition', hoverParams)
  ).toBeTruthy();

  /**
   * Event params for LSP user interaction
   */
  const completionParams: TextDocumentPositionParams = {
    textDocument: {
      uri,
    },
    position: {
      line: 8,
      character: 12,
    },
  };

  // verify definition has return
  expect(
    await init.client.client.sendRequest(
      'textDocument/completion',
      completionParams
    )
  ).toBeTruthy();

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
    (
      (await init.client.client.sendRequest(
        'textDocument/semanticTokens/full',
        tokenParams
      )) as SemanticTokens
    ).data
  ).toEqual([10, 0, 11, 0, 0]);
};
