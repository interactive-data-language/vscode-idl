import * as vscode from 'vscode';

import { GetNotebookCellIndex } from '../helpers/get-notebook-cell-index';
import { IDL_NOTEBOOK_SELECTION_SCHEME } from './providers.interface';

/**
 * Registers our provider for notebook hover help
 */
export function RegisterNotebookHoverProvider() {
  vscode.languages.registerHoverProvider(IDL_NOTEBOOK_SELECTION_SCHEME, {
    provideHover(document, position, _token) {
      const doc = GetNotebookCellIndex(document);

      if (doc === undefined) {
        return undefined;
      }

      console.log({
        uri: doc.notebook.uri.toString(),
        cell: doc.cell,
        line: position.line,
        character: position.character,
      });

      // get hover help
      // LANGUAGE_SERVER_CLIENT.sendRequest()

      // return sample hover
      // return new Hover('I am a hover!');
      return undefined;
    },
  });
}
