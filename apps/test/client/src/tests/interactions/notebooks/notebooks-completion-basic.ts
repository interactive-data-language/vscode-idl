import { GetExtensionPath } from '@idl/idl/files';
import { Sleep } from '@idl/shared/extension';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import {
  CompletionItem as LanguageServerCompletionItem,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { RunnerFunction } from '../../runner.interface';
import { TEST_CLIENT_CONFIG } from '../../test-client-config.interface';

/**
 * Verifies working with notebooks does the right thing with changes and doesnt trigger
 * PRO code parsing in the language server
 */
export const NotebookCompletionBasic: RunnerFunction = async (init) => {
  const doc = await OpenNotebookInVSCode(
    GetExtensionPath(
      'apps/test/idl/client-e2e/notebooks/auto-complete-test.idlnb',
    ),
  );

  // short pause
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.PROBLEMS_NOTEBOOK);

  /**
   * Event params for LSP user interaction
   */
  const completionParams: TextDocumentPositionParams = {
    textDocument: {
      uri: doc.cellAt(0).document.uri.toString(),
    },
    position: {
      line: 0,
      character: 7,
    },
  };

  // verify definition has return
  const completion1: LanguageServerCompletionItem[] =
    await init.client.client.sendRequest(
      'textDocument/completion',
      completionParams,
    );

  // verify definition has return
  expect(completion1).toStrictEqual(expect.any(Array));
  expect(completion1.length).toEqual(0);

  /**
   * Event params for LSP user interaction
   */
  const completionParams2: TextDocumentPositionParams = {
    textDocument: {
      uri: doc.cellAt(1).document.uri.toString(),
    },
    position: {
      line: 1,
      character: 0,
    },
  };

  const completion2: LanguageServerCompletionItem[] =
    await init.client.client.sendRequest(
      'textDocument/completion',
      completionParams2,
    );

  // verify definition has return
  expect(completion2).toStrictEqual(expect.any(Array));
  expect(completion2.length).not.toEqual(0);
};
