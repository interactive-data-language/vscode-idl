import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { TaskNameOnly, TreeToken } from '@idl/parsing/syntax-tree';
import { TokenName } from '@idl/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  ISpecialFunctionCompletionOptions,
  SpecialFunctionCompletion,
} from '@idl/types/auto-complete';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { CompletionItemKind } from 'vscode-languageserver';

import { EvaluateToken } from '../../post-process/populate-type/evaluate/evaluate-token';
import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { SORT_PRIORITY } from '../sort-priority.interface';
import {
  ALLOWED_SPECIAL_COMPLETION,
  ENVI_TASK_REGEX,
  IDL_TASK_REGEX,
} from './completion-special-functions.interface';
import { BuildCompletionStructureNameItems } from './completion-structure-names';

/**
 * Display names for functions
 */
const FUNCTIONS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION];

export function GetSpecialFunctionCompletionOptions(
  token: TreeToken<TokenName>
): ISpecialFunctionCompletionOptions {
  // init result
  const opts: ISpecialFunctionCompletionOptions = {
    /**
     * Filter tokens that are not the first child or in our white list
     */
    notSpecial: !(token.name in ALLOWED_SPECIAL_COMPLETION) || token.idx !== 0,
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
    opts.functionName =
      token?.scopeTokens[token.scope.length - 1]?.match[0].toLowerCase();
  }

  return opts;
}

/**
 * Handles auto-complete for special functions
 */
export function BuildSpecialFunctionCompletionItems(
  arg: BuildCompletionItemsArg<SpecialFunctionCompletion>
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

  // get function name
  const functionName = arg.options.functionName;

  /** Display names to add auto complete for */
  let displayNames: string[] = Object.values(FUNCTIONS);

  /** Detail for auto-complete */
  let detail = '';

  switch (true) {
    /**
     * Handle ENVI tasks
     */
    case functionName === 'envitask(': {
      displayNames = displayNames.filter((taskName) =>
        ENVI_TASK_REGEX.test(taskName)
      );
      detail = IDL_TRANSLATION.autoComplete.detail.enviTask;

      // add all
      for (let i = 0; i < displayNames.length; i++) {
        const display = TaskNameOnly(displayNames[i]);
        arg.complete.push({
          label: display,
          insertText: display,
          kind: CompletionItemKind.Field,
          sortText: SORT_PRIORITY.ROUTINES,
          detail,
        });
      }
      break;
    }
    /**
     * Handle ENVI tasks
     */
    case functionName === 'idltask(': {
      displayNames = displayNames.filter((taskName) =>
        IDL_TASK_REGEX.test(taskName)
      );
      detail = IDL_TRANSLATION.autoComplete.detail.idltask;

      // add all
      for (let i = 0; i < displayNames.length; i++) {
        const display = TaskNameOnly(displayNames[i]);
        arg.complete.push({
          label: display,
          insertText: display,
          kind: CompletionItemKind.Field,
          sortText: SORT_PRIORITY.ROUTINES,
          detail,
        });
      }
      break;
    }
    /**
     * Handle calls to obj_new
     */
    case functionName === 'obj_new(': {
      return BuildCompletionStructureNameItems({
        ...arg,
        options: {},
      });
    }
    /**
     * Handle calls to call_function
     */
    case functionName === 'call_function(': {
      detail = IDL_TRANSLATION.autoComplete.detail.function;

      // add internal routines
      for (let i = 0; i < displayNames.length; i++) {
        const display = TransformCase(
          displayNames[i],
          arg.formatting.style.routines
        );
        arg.complete.push({
          label: `${display}()`,
          insertText: display,
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
