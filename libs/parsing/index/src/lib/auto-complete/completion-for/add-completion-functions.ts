import {
  FormatterType,
  IAssemblerOptions,
  STYLE_FLAG_LOOKUP,
} from '@idl/assembling/config';
import { GLOBAL_TOKEN_TYPES } from '@idl/data-types/core';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  Command,
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';

import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Display names for fuctions
 */
const FUNCTIONS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION];

/**
 * Regex for task name
 */
const TASK_REGEX = /^(?:envi|idl).+task$/i;

/**
 * Gets insertion text for function calls with special cases
 * for ENVI tasks
 */
function GetInsertText(name: string, quote: string): string {
  /** Lower case for comparison */
  const lc = name.toLowerCase();

  /**
   * Check if ENVI or IDL task
   */
  if (lc.startsWith('envi')) {
    return `ENVITask(${quote}${name.substring(4, name.length - 4)}${quote})`;
  } else {
    return `IDLTask(${quote}${name.substring(3, name.length - 4)}${quote})`;
  }
}

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
      const display = GetInsertText(displayNames[i], quote);
      complete.push({
        label: display,
        insertText: display,
        kind: CompletionItemKind.Function,
        sortText: SORT_PRIORITY.ROUTINES,
        detail: IDL_TRANSLATION.autoComplete.detail.function,
      });
    } else {
      complete.push({
        label: displayNames[i] + '()',
        insertText: displayNames[i] + add,
        kind: CompletionItemKind.Function,
        sortText: SORT_PRIORITY.ROUTINES,
        detail: IDL_TRANSLATION.autoComplete.detail.function,
        command,
      });
    }
  }
}
