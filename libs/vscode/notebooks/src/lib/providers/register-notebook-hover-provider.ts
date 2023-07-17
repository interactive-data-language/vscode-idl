import { LANGUAGE_SERVER_CLIENT } from '@idl/vscode/client';
import * as vscode from 'vscode';
import {
  Hover as LanguageServerHover,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { GetNotebookCellIndex } from '../helpers/get-notebook-cell-index';
import { IDL_NOTEBOOK_SELECTION_SCHEME } from './providers.interface';

/**
 * Registers our provider for notebook hover help
 */
export function RegisterNotebookHoverProvider() {
  vscode.languages.registerHoverProvider(IDL_NOTEBOOK_SELECTION_SCHEME, {
    async provideHover(document, position, _token) {
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
      const hovered: LanguageServerHover =
        await LANGUAGE_SERVER_CLIENT.sendRequest('textDocument/hover', params);

      // return if nothing
      if (hovered === undefined) {
        return;
      }

      /**
       * Init range for hover help
       */
      let range: vscode.Range;

      // populate if we have a range property
      if (hovered?.range !== undefined) {
        range = new vscode.Range(
          new vscode.Position(
            hovered.range.start.line,
            hovered.range.start.character
          ),
          new vscode.Position(
            hovered.range.end.line,
            hovered.range.end.character
          )
        );
      }

      // convert to VSCode hover help
      return new vscode.Hover(hovered.contents as string, range);
    },
  });
}
