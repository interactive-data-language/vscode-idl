import {
  FormatterType,
  IAssemblerOptions,
  STYLE_FLAG_LOOKUP,
} from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { TaskFunctionName } from '@idl/parsing/syntax-tree';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES, TASK_REGEX } from '@idl/types/core';
import {
  Command,
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';

import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Display names for functions
 */
const FUNCTIONS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION];

/**
 * Adds variables to our completion items
 */
export function AddCompletionFunctions(
  complete: CompletionItem[],
  formatting: IAssemblerOptions<FormatterType>,
  addParen: boolean
) {
  /** If we add parentheses or not */
  const add = addParen ? '()' : '';

  /** Get quote styling */
  const quote =
    formatting.style.quotes === STYLE_FLAG_LOOKUP.SINGLE ? `'` : `"`;

  /** Cursor movement command */
  const command: Command = {
    title: 'Cursor Adjust',
    command: addParen ? 'cursorLeft' : 'cursorRight',
  };

  // add internal routines
  const displayNames = Object.values(FUNCTIONS);
  for (let i = 0; i < displayNames.length; i++) {
    /**
     * Determine if we are a task which has different auto complete
     */
    if (TASK_REGEX.exec(displayNames[i])) {
      const display = TaskFunctionName(displayNames[i], quote);
      complete.push({
        label: display,
        insertText: display,
        kind: CompletionItemKind.Function,
        sortText: SORT_PRIORITY.ROUTINES,
        detail: IDL_TRANSLATION.autoComplete.detail.function,
      });
    } else {
      const display = TransformCase(displayNames[i], formatting.style.routines);
      complete.push({
        label: `${display}()`,
        insertText: `${display}${add}`,
        kind: CompletionItemKind.Function,
        sortText: SORT_PRIORITY.ROUTINES,
        detail: IDL_TRANSLATION.autoComplete.detail.function,
        command,
      });
    }
  }
}
