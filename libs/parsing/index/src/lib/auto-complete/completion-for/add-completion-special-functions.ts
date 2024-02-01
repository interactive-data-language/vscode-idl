import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { TaskNameOnly, TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { IDLIndex } from '../../idl-index.class';
import { EvaluateToken } from '../../post-process/populate-type/evaluate/evaluate-token';
import { SORT_PRIORITY } from '../sort-priority.interface';
import {
  ENVI_TASK_REGEX,
  IDL_TASK_REGEX,
} from './add-completion-special-functions.interface';
import { AddCompletionStructureNames } from './add-completion-structure-names';

/**
 * Track tokens that we can do task completion for
 */
export const ALLOWED_TASK_COMPLETION: { [key: string]: undefined } = {};
ALLOWED_TASK_COMPLETION[TOKEN_NAMES.QUOTE_SINGLE] = undefined;
ALLOWED_TASK_COMPLETION[TOKEN_NAMES.QUOTE_DOUBLE] = undefined;
ALLOWED_TASK_COMPLETION[TOKEN_NAMES.STRING_TEMPLATE_LITERAL] = undefined;

/**
 * Display names for functions
 */
const FUNCTIONS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION];

/**
 * Handles auto-complete for special functions
 */
export function AddCompletionSpecialFunctions(
  complete: CompletionItem[],
  index: IDLIndex,
  token: TreeToken<TokenName>,
  formatting: IAssemblerOptions<FormatterType>
) {
  /**
   * Filter tokens that are not the first child or in our white list
   */
  if (!(token.name in ALLOWED_TASK_COMPLETION) || token.idx !== 0) {
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

  // get function name
  const functionName =
    token?.scopeTokens[token.scope.length - 1]?.match[0].toLowerCase();

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
        complete.push({
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
        complete.push({
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
      return AddCompletionStructureNames(complete, formatting);
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
          formatting.style.routines
        );
        complete.push({
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
