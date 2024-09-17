import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { MAIN_LEVEL_NAME, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { CompletionItemKind } from 'vscode-languageserver';

import { EvaluateToken } from '../../post-process/populate-type/evaluate/evaluate-token';
import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { SORT_PRIORITY } from '../sort-priority.interface';
import { ALLOWED_SPECIAL_COMPLETION } from './completion-special-functions.interface';
import {
  ISpecialProcedureCompletionOptions,
  SpecialProcedureCompletion,
} from './completion-special-procedures.interface';

/**
 * Display names for functions
 */
const PROCEDURES = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE];

export function GetSpecialProcedureCompletionOptions(
  token: TreeToken<TokenName>
): ISpecialProcedureCompletionOptions {
  // init result
  const opts: ISpecialProcedureCompletionOptions = {
    /**
     * Filter tokens that are not the first child or in our white list
     */
    notSpecial: !(token.name in ALLOWED_SPECIAL_COMPLETION) || token.idx !== 1,
  };

  // make sure we can proceed
  if (!opts.notSpecial) {
    // get literal value
    const value = EvaluateToken(token);

    /**
     * Make sure we can get the value of our string - more for simple literals than
     * anything else
     */
    if (value === undefined) {
      return opts;
    }

    // save
    opts.value = value;

    // s ave procedure name because we made it this far
    opts.procedureName =
      token?.scopeTokens[token.scope.length - 1]?.match[0].toLowerCase();
  }

  return opts;
}

/**
 * Handles auto-complete for special functions
 */
export function BuildSpecialProcedureCompletionItems(
  arg: BuildCompletionItemsArg<SpecialProcedureCompletion>
) {
  /**
   * Filter tokens that are not the first child or in our white list
   */
  if (arg.options.notSpecial) {
    return;
  }

  /**
   * Make sure we can get the value of our string - more for simple literals than
   * anything else
   */
  if (arg.options.value === undefined) {
    return;
  }

  // get procedure name
  const procedureName = arg.options.procedureName;

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
          arg.formatting.style.routines
        );
        arg.complete.push({
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
