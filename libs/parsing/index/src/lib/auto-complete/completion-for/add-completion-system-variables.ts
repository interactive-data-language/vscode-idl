import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { IDL_TRANSLATION } from '@idl/translation';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Display names for internal system variables
 */
const SYSTEM_VARIABLES = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.SYSTEM_VARIABLE];

/**
 * Adds variables to our completion items
 */
export function AddCompletionSystemVariables(
  complete: CompletionItem[],
  formatting: IAssemblerOptions<FormatterType>
) {
  // add user procedures first
  const displayNames = Object.values(SYSTEM_VARIABLES);
  for (let i = 0; i < displayNames.length; i++) {
    complete.push({
      label: AdjustCase(displayNames[i], formatting.style.systemVariables),
      kind: CompletionItemKind.Constant,
      sortText: SORT_PRIORITY.SYSTEM_VARIABLES,
      detail: IDL_TRANSLATION.autoComplete.detail.systemVariable,
    });
  }
}
