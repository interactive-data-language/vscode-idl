import { STYLE_FLAG_LOOKUP } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { TaskFunctionName } from '@idl/parsing/syntax-tree';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES, TASK_REGEX } from '@idl/types/core';
import { Command, CompletionItemKind } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { SORT_PRIORITY } from '../sort-priority.interface';
import {
  FunctionCompletion,
  IFunctionCompletionOptions,
} from './add-completion-functions.interface';

/**
 * Display names for functions
 */
const FUNCTIONS = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.FUNCTION];

/**
 * Generates options for creating compile opts
 */
export function GetFunctionCompletionOptions(
  addParen: boolean
): IFunctionCompletionOptions {
  return {
    addParen,
  };
}

/**
 * Adds variables to our completion items
 */
export function BuildFunctionCompletionItems(
  arg: BuildCompletionItemsArg<FunctionCompletion>
) {
  /** If we add parentheses or not */
  const add = arg.options.addParen ? '()' : '';

  /** Get quote styling */
  const quote =
    arg.formatting.style.quotes === STYLE_FLAG_LOOKUP.SINGLE ? `'` : `"`;

  /** Cursor movement command */
  const command: Command = {
    title: 'Cursor Adjust',
    command: arg.options.addParen ? 'cursorLeft' : 'cursorRight',
  };

  // add internal routines
  const displayNames = Object.values(FUNCTIONS);
  for (let i = 0; i < displayNames.length; i++) {
    /**
     * Determine if we are a task which has different auto complete
     */
    if (TASK_REGEX.exec(displayNames[i])) {
      const display = TaskFunctionName(displayNames[i], quote);
      arg.complete.push({
        label: display,
        insertText: display,
        kind: CompletionItemKind.Function,
        sortText: SORT_PRIORITY.ROUTINES,
        detail: IDL_TRANSLATION.autoComplete.detail.function,
      });
    } else {
      const display = TransformCase(
        displayNames[i],
        arg.formatting.style.routines
      );
      arg.complete.push({
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
