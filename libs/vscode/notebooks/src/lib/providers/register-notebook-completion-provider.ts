import {
  COMPLETION_TRIGGER_CHARACTERS,
  IDL_NOTEBOOK_CELL_SELECTOR,
} from '@idl/shared';
import { LANGUAGE_SERVER_CLIENT } from '@idl/vscode/client';
import * as vscode from 'vscode';
import {
  CompletionItem as LanguageServerCompletionItem,
  MarkupContent,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { GetNotebookCellIndex } from '../helpers/get-notebook-cell-index';

/**
 * Registers our provider for notebook auto completion
 */
export function RegisterNotebookCompletionProvider() {
  vscode.languages.registerCompletionItemProvider(
    IDL_NOTEBOOK_CELL_SELECTOR,
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
        if (!completion) {
          return undefined;
        }

        // return completion;
        return completion.map((item) => {
          // make item
          const mapped = new vscode.CompletionItem(item.label);

          // pass over all values
          Object.assign(mapped, item);

          // special case for docs which comes from the end of:
          // libs\parsing\index\src\lib\auto-complete\get-auto-complete.ts
          if (item.documentation) {
            mapped.documentation = new vscode.MarkdownString(
              (item.documentation as MarkupContent).value
            );
          }

          // return
          return mapped;
        });
      },
      // convert to VSCode hover help
    },
    ...COMPLETION_TRIGGER_CHARACTERS
  );
}
