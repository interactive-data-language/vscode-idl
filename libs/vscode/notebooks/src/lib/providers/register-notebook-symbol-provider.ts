import { IDL_NOTEBOOK_CELL_SELECTOR } from '@idl/shared';
import { LANGUAGE_SERVER_CLIENT } from '@idl/vscode/client';
import * as vscode from 'vscode';
import { DocumentSymbol, DocumentSymbolParams } from 'vscode-languageserver';

import { GetNotebookCellIndex } from '../helpers/get-notebook-cell-index';

/**
 * Registers our provider for notebook auto completion
 */
export function RegisterNotebookSymbolProvider() {
  vscode.languages.registerDocumentSymbolProvider(IDL_NOTEBOOK_CELL_SELECTOR, {
    async provideDocumentSymbols(document, _token) {
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
      const params: DocumentSymbolParams = {
        textDocument: {
          uri: `${doc.notebook.uri.toString()}#${doc.cell}`,
        },
      };

      /**
       * Send and wait for a response from the server
       */
      const symbols: DocumentSymbol[] =
        await LANGUAGE_SERVER_CLIENT.sendRequest(
          'textDocument/documentSymbol',
          params
        );

      // return if nothing to do
      if (!symbols) {
        return undefined;
      }

      return symbols.map(
        (item) =>
          new vscode.DocumentSymbol(
            item.name,
            item.detail,
            item.kind as vscode.SymbolKind,
            new vscode.Range(
              new vscode.Position(
                item.range.start.line,
                item.range.start.character
              ),
              new vscode.Position(item.range.end.line, item.range.end.character)
            ),
            new vscode.Range(
              new vscode.Position(
                item.selectionRange.start.line,
                item.selectionRange.start.character
              ),
              new vscode.Position(
                item.selectionRange.end.line,
                item.selectionRange.end.character
              )
            )
          )
      );
    },
  });
}
