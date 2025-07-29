import { TreeToken } from '@idl/parsing/syntax-tree';
import { LogicalThenToken, TOKEN_NAMES } from '@idl/tokenizer';
import {
  AUTO_COMPLETE_TYPE_LOOKUP,
  AutoCompleteRecipe,
  AutoCompleteType,
  BlockCompletion,
} from '@idl/types/auto-complete';
import { CompletionItemKind, InsertTextFormat } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { COMPLETION_SORT_PRIORITY } from '../completion-sort-priority.interface';

/**
 * Generates options for blocks of code
 */
export function GetBlockCompletionOptions(
  token: TreeToken<LogicalThenToken>,
  recipes: AutoCompleteRecipe<AutoCompleteType>[]
) {
  switch (token.name) {
    /**
     * Then
     */
    case TOKEN_NAMES.LOGICAL_THEN: {
      const typed: AutoCompleteRecipe<BlockCompletion> = {
        type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
        options: {
          display: 'then-begin',
          beginning: 'then begin',
          ending: 'endif',
        },
      };
      recipes.push(typed);
      break;
    }
    default:
      break;
  }
}

/**
 * Generates completion items from our options
 */
export function BuildBlockCompletionItems(
  arg: BuildCompletionItemsArg<BlockCompletion>
) {
  arg.complete.push({
    label: arg.options.display,
    kind: CompletionItemKind.Snippet,
    sortText: COMPLETION_SORT_PRIORITY.BLOCKS,
    insertText: [
      `${arg.options.beginning}`,
      '  $0',
      `${arg.options.ending || 'end'}`,
      '',
    ].join('\n'),
    insertTextFormat: InsertTextFormat.Snippet,
  });
}
