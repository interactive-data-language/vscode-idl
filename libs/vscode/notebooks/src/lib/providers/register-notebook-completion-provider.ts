import { COMPLETION_TRIGGER_CHARACTERS } from '@idl/shared';
import { LANGUAGE_SERVER_CLIENT } from '@idl/vscode/client';
import * as vscode from 'vscode';
import {
  CompletionItem as LanguageServerCompletionItem,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { GetNotebookCellIndex } from '../helpers/get-notebook-cell-index';
import { IDL_NOTEBOOK_SELECTION_SCHEME } from './providers.interface';

/**
 * Registers our provider for notebook auto completion
 */
export function RegisterNotebookCompletionProvider() {
  vscode.languages.registerCompletionItemProvider(
    IDL_NOTEBOOK_SELECTION_SCHEME,
    {
      async provideCompletionItems(document, position, _token) {
        /**
         * Get notebook and document for index
         */
        const doc = GetNotebookCellIndex(document);

        // return if no matching doc
        if (doc === undefined) {
          return undefined;
        }

        /**
         * Create hover help parameters - typed for strictness
         */
        const params: TextDocumentPositionParams = {
          textDocument: {
            uri: `${doc.notebook.uri.toString()}#${doc.cell}`,
          },
          position: {
            line: position.line,
            character: position.character,
          },
        };

        /**
         * Send and wait for a response from the server
         */
        const completion: LanguageServerCompletionItem[] =
          await LANGUAGE_SERVER_CLIENT.sendRequest(
            'textDocument/completion',
            params
          );

        // return if nothing to do
        if (completion === undefined) {
          return;
        }

        // return completion;
        return completion.map((item) => {
          // make item
          const mapped = new vscode.CompletionItem(item.label);

          // pass over all values
          Object.assign(mapped, item);

          // return
          return mapped;
        });
      },
      // convert to VSCode hover help
    },
    ...COMPLETION_TRIGGER_CHARACTERS
  );
}
