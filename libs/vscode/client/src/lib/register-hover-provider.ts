import { ALL_DOCUMENT_SELECTORS } from '@idl/shared';
import * as vscode from 'vscode';
import {
  Hover as LanguageServerHover,
  TextDocumentPositionParams,
} from 'vscode-languageserver';

import { LANGUAGE_SERVER_CLIENT } from './start-language-server';

/**
 * Registers custom hover help provider so we can have
 * trusted hover help content
 */
export function RegisterHoverProvider() {
  vscode.languages.registerHoverProvider(ALL_DOCUMENT_SELECTORS, {
    async provideHover(document, position, _token) {
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
      const hovered: LanguageServerHover =
        await LANGUAGE_SERVER_CLIENT.sendRequest('textDocument/hover', params);

      // return if nothing
      if (!hovered) {
        return undefined;
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

      // make markdown string
      const md = new vscode.MarkdownString(hovered.contents as string);

      // set as trusted (so we can execute commands)
      md.isTrusted = true;

      // convert to VSCode hover help
      return new vscode.Hover(md, range);
    },
  });
}
