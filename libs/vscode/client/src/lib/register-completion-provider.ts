import {
  ALL_DOCUMENT_SELECTORS,
  COMPLETION_TRIGGER_CHARACTERS,
} from '@idl/shared';
import * as vscode from 'vscode';
import {
  CompletionItem as LanguageServerCompletionItem,
  MarkupContent,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { LANGUAGE_SERVER_CLIENT } from './start-language-server';

/**
 * Registers our provider for notebook auto completion
 */
export function RegisterCompletionProvider() {
  vscode.languages.registerCompletionItemProvider(
    ALL_DOCUMENT_SELECTORS,
    {
      async provideCompletionItems(document, position, _token) {
        /**
         * Create hover help parameters - typed for strictness
         */
        const params: TextDocumentPositionParams = {
          textDocument: {
            uri: document.uri.toString(),
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
