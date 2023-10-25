import { IDL_NOTEBOOK_CELL_SELECTOR } from '@idl/shared';
import { LANGUAGE_SERVER_CLIENT } from '@idl/vscode/client';
import * as vscode from 'vscode';
import {
  Location as LanguageServerLocation,
  TextDocumentPositionParams,
} from 'vscode-languageserver';
import { URI } from 'vscode-uri';

import { GetNotebookCellIndex } from '../helpers/get-notebook-cell-index';

/**
 * Registers our provider for notebook go-to-definition
 */
export function RegisterNotebookDefinitionProvider() {
  vscode.languages.registerDefinitionProvider(IDL_NOTEBOOK_CELL_SELECTOR, {
    async provideDefinition(document, position, _token) {
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
      const definition: LanguageServerLocation =
        await LANGUAGE_SERVER_CLIENT.sendRequest(
          'textDocument/definition',
          params
        );

      // return if nothing
      if (!definition) {
        return undefined;
      }

      /**
       * Translate definition to VSCode
       */
      const def: vscode.Definition = {
        uri: URI.parse(definition.uri),
        range: new vscode.Range(
          new vscode.Position(
            definition.range.start.line,
            definition.range.start.character
          ),
          new vscode.Position(
            definition.range.end.line,
            definition.range.end.character
          )
        ),
      };

      // return
      return def;
    },
  });
}
