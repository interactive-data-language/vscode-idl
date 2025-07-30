import { AdjustCase } from '@idl/assembling/shared';
import { IsAtEnd, IsWithinToken, TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/tokenizer';
import {
  AUTO_COMPLETE_TYPE_LOOKUP,
  AutoCompleteRecipe,
  AutoCompleteType,
  BlockCompletion,
  COMPLETION_BLOCKS,
  CompletionBlockTokens,
} from '@idl/types/auto-complete';
import {
  CompletionItemKind,
  InsertTextFormat,
  Position,
} from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { COMPLETION_SORT_PRIORITY } from '../completion-sort-priority.interface';

/**
 * Generates options for blocks of code
 */
export function GetBlockCompletionOptions(
  token: TreeToken<TokenName> | undefined,
  pos: Position,
  recipes: AutoCompleteRecipe<AutoCompleteType>[]
) {
  // return if no token
  if (!token) {
    return;
  }

  /** Variable that we add blocks for */
  let blocksFor: TreeToken<CompletionBlockTokens>;

  // check if we know how to add blocks to our local token
  if (token.name in COMPLETION_BLOCKS) {
    blocksFor = token as TreeToken<CompletionBlockTokens>;
  } else {
    /**
     * Check our scope for any blocks that we can add
     */
    for (let i = token.scopeTokens.length - 1; i >= 0; i--) {
      if (token.scopeTokens[i].name in COMPLETION_BLOCKS) {
        blocksFor = token.scopeTokens[i] as TreeToken<CompletionBlockTokens>;
        break;
      }
    }
  }

  // return if nothing
  if (!blocksFor) {
    return;
  }

  /** Check if we are at the end */
  const isAtEnd = blocksFor?.end?.pos
    ? IsAtEnd(pos, blocksFor?.end.pos)
    : false;

  /** If we have kids, add extra space */
  const kidSpacer = blocksFor.kids.length > 0 ? ' ' : '';

  /** Check if within the start of the token, if so add a space */
  const front = IsWithinToken(pos, blocksFor.pos)
    ? `${kidSpacer}${token.match[0]} `
    : `${kidSpacer}`;

  /**
   * Determine how to proceed
   */
  switch (blocksFor.name) {
    /**
     * "then" portion after a colon in case/switch
     */
    case TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN:
    case TOKEN_NAMES.LOGICAL_EXPRESSION_DEFAULT: {
      if (blocksFor.kids.length === 0) {
        const blockElse: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label:
              blocksFor.name === TOKEN_NAMES.LOGICAL_CASE_SWITCH_THEN
                ? 'Then block'
                : 'Else block',
            snippet: [front.replace(/(else)?:/i, '') + 'begin', '  $1', 'end'],
          },
        };
        recipes.push(blockElse);
      }
      break;
    }

    /**
     * Else
     */
    case TOKEN_NAMES.LOGICAL_ELSE: {
      if (blocksFor.kids.length === 0) {
        const blockElse: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label: 'Else block',
            snippet: [front + 'begin', '  $1', 'endelse'],
          },
        };
        recipes.push(blockElse);
      }
      break;
    }

    /**
     * If
     */
    case TOKEN_NAMES.LOGICAL_IF: {
      if (blocksFor.kids.length === 0) {
        const ifThenElseBlock: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label: 'If-then-else block',
            snippet: [
              front + '(${1:!true}) then begin',
              '  $2',
              'endif else begin',
              '  $3',
              'endelse',
            ],
          },
        };
        recipes.push(ifThenElseBlock);

        const ifThenElseLine: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label: 'If-then-else single line',
            snippet: [front + '(!true) then $1 else $2'],
          },
        };
        recipes.push(ifThenElseLine);
      } else {
        const ifThenElseBlock: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label: 'If-then-else block',
            snippet: [
              front + 'then begin',
              '  $1',
              'endif else begin',
              '  $2',
              'endelse',
            ],
          },
        };
        recipes.push(ifThenElseBlock);

        const ifThenElseLine: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label: 'If-then-else single line',
            snippet: [front + 'then $1 else $2'],
          },
        };
        recipes.push(ifThenElseLine);
      }
      break;
    }

    /**
     * Then
     */
    case TOKEN_NAMES.LOGICAL_THEN: {
      if (blocksFor.kids.length === 0) {
        const ifThenElseBlock: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label: 'If-then-else block',
            snippet: [
              front + 'begin',
              '  $1',
              'endif else begin',
              '  $2',
              'endelse',
            ],
          },
        };
        recipes.push(ifThenElseBlock);
      } else {
        const blockElse: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label: 'Else block',
            snippet: [front + 'else begin', '  $1', 'endelse'],
          },
        };
        recipes.push(blockElse);

        const simpleElse: AutoCompleteRecipe<BlockCompletion> = {
          type: AUTO_COMPLETE_TYPE_LOOKUP.BLOCK,
          options: {
            label: 'Else single line',
            snippet: [front + 'else $1'],
          },
        };
        recipes.push(simpleElse);
      }
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
    label: arg.options.label,
    kind: CompletionItemKind.Snippet,
    sortText: COMPLETION_SORT_PRIORITY.BLOCKS,
    insertText: arg.options.snippet
      .map((line) => AdjustCase(line, arg.formatting.style.control))
      .join('\n'),
    insertTextFormat: InsertTextFormat.Snippet,
    preselect: true,
  });
}
