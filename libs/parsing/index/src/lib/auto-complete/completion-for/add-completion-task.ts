import { GLOBAL_TOKEN_TYPES } from '@idl/data-types/core';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { TaskNameOnly, TreeToken } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/parsing/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { IDLIndex } from '../../idl-index.class';
import { EvaluateToken } from '../../post-process/populate-type/evaluate/evaluate-token';
import { SORT_PRIORITY } from '../sort-priority.interface';
import {
  ENVI_TASK_REGEX,
  IDL_TASK_REGEX,
} from './add-completion-tasks.interface';

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
 * Handles auto-complete within ENVI and IDL task functions
 */
export function AddCompletionTasks(
  complete: CompletionItem[],
  index: IDLIndex,
  token: TreeToken<TokenName>
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
  let displayNames: string[] = [];

  /** Detail for auto-complete */
  let detail = '';

  switch (true) {
    /**
     * Handle ENVI tasks
     */
    case functionName === 'envitask(': {
      displayNames = Object.values(FUNCTIONS).filter((taskName) =>
        ENVI_TASK_REGEX.test(taskName)
      );
      detail = IDL_TRANSLATION.autoComplete.detail.enviTask;
      break;
    }
    /**
     * Handle ENVI tasks
     */
    case functionName === 'idltask(':
      displayNames = Object.values(FUNCTIONS).filter((taskName) =>
        IDL_TASK_REGEX.test(taskName)
      );
      detail = IDL_TRANSLATION.autoComplete.detail.idltask;
      break;
    default:
      break;
  }

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
}
