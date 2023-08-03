import { CompletionItem } from 'vscode-languageserver/node';

import { SERVER_CONNECTION } from '../initialize-server';
import { ON_CODE_ACTIONS } from './user-interaction/on-code-action';
import { ON_COMPLETION } from './user-interaction/on-completion';
import { ON_DEFINITION } from './user-interaction/on-definition';
import { ON_HOVER } from './user-interaction/on-hover';
import { ON_SEMANTIC_HIGHLIGHTING } from './user-interaction/on-semantic-highlighting';

/**
 * Register and handle events regarding user interaction in VSCode
 *
 * This includes things like document outlines, hover help, auto-complete, or
 * going to the definition of a selected token.
 */
export function InitializeUserInteractions() {
  /**
   * Listen for hover-help requests
   */
  SERVER_CONNECTION.onHover(ON_HOVER);

  /**
   * Listen for go-to-definition symbol requests
   */
  SERVER_CONNECTION.onDefinition(ON_DEFINITION);

  /**
   * Listen for our initial completion item request
   */
  SERVER_CONNECTION.onCompletion(ON_COMPLETION);

  /**
   * Custom adjustments for the completion item before it goes back in
   *
   * Set as server functionality, so we need to leave it for now
   */
  SERVER_CONNECTION.onCompletionResolve(
    (item: CompletionItem): CompletionItem => undefined
    // (item: CompletionItem): CompletionItem => idl.postCompletion(item)
  );

  /**
   * listen for events regarding code actions
   */
  SERVER_CONNECTION.onCodeAction(ON_CODE_ACTIONS);

  /**
   * Listen for events regarding semantic highlighting
   *
   * For event names, see here
   *   https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#semanticTokensClientCapabilities
   */
  SERVER_CONNECTION.onRequest(
    'textDocument/semanticTokens/full',
    ON_SEMANTIC_HIGHLIGHTING
  );
}
