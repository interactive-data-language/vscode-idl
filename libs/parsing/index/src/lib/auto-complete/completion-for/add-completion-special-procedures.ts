import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { MAIN_LEVEL_NAME, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { IDLIndex } from '../../idl-index.class';
import { EvaluateToken } from '../../post-process/populate-type/evaluate/evaluate-token';
import { SORT_PRIORITY } from '../sort-priority.interface';
import { ALLOWED_SPECIAL_COMPLETION } from './add-completion-special-functions.interface';

/**
 * Display names for functions
 */
const PROCEDURES = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE];

/**
 * Handles auto-complete for special functions
 */
export function AddCompletionSpecialProcedures(
  complete: CompletionItem[],
  index: IDLIndex,
  token: TreeToken<TokenName>,
  formatting: IAssemblerOptions<FormatterType>
) {
  console.log();
  /**
   * Filter tokens that are not the first child or in our white list
   */
  if (!(token.name in ALLOWED_SPECIAL_COMPLETION) || token.idx !== 1) {
    return;
  }

  /**
   * Make sure we can get the value of our string - more for simple literals than
   * anything else
   */
  const value = EvaluateToken(token);
  if (value === undefined) {
    return;
  }

  // get procedure name
  const procedureName =
    token?.scopeTokens[token.scope.length - 1]?.match[0].toLowerCase();

  /** Display names to add auto complete for */
  const displayNames: string[] = Object.values(PROCEDURES);

  /** Detail for auto-complete */
  let detail = '';

  switch (true) {
    /**
     * Handle calls to call_function
     */
    case procedureName === 'call_procedure': {
      detail = IDL_TRANSLATION.autoComplete.detail.procedure;

      // add internal routines
      for (let i = 0; i < displayNames.length; i++) {
        // dont show main
        if (displayNames[i].toLowerCase() === MAIN_LEVEL_NAME) {
          continue;
        }

        const display = TransformCase(
          displayNames[i],
          formatting.style.routines
        );
        complete.push({
          label: display,
          kind: CompletionItemKind.Function,
          sortText: SORT_PRIORITY.ROUTINES,
          detail,
        });
      }
      break;
    }
    default:
      break;
  }
}
