import { AdjustCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { IDL_TRANSLATION } from '@idl/translation';
import { SystemVariableCompletion } from '@idl/types/auto-complete';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { CompletionItemKind } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Display names for internal system variables
 */
const SYSTEM_VARIABLES = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.SYSTEM_VARIABLE];

/**
 * Adds system variable completion items
 */
export function BuildCompletionSystemVariableItems(
  arg: BuildCompletionItemsArg<SystemVariableCompletion>
) {
  // add user procedures first
  const displayNames = Object.values(SYSTEM_VARIABLES);
  for (let i = 0; i < displayNames.length; i++) {
    arg.complete.push({
      label: AdjustCase(displayNames[i], arg.formatting.style.systemVariables),
      kind: CompletionItemKind.Constant,
      sortText: SORT_PRIORITY.SYSTEM_VARIABLES,
      detail: IDL_TRANSLATION.autoComplete.detail.systemVariable,
    });
  }
}
