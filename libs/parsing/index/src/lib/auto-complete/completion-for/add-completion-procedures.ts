import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { TransformCase } from '@idl/assembling/shared';
import { GLOBAL_TOKEN_TYPES } from '@idl/data-types/core';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { MAIN_LEVEL_NAME } from '@idl/parsing/syntax-tree';
import { IDL_TRANSLATION } from '@idl/translation';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Display names for procedures
 */
const PROCEDURES = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE];

/**
 * Adds variables to our completion items
 */
export function AddCompletionProcedures(
  complete: CompletionItem[],
  formatting: IAssemblerOptions<FormatterType>
) {
  // add user procedures first
  const displayNames = Object.values(PROCEDURES);
  for (let i = 0; i < displayNames.length; i++) {
    if (displayNames[i] === MAIN_LEVEL_NAME) {
      continue;
    }
    complete.push({
      label: TransformCase(displayNames[i], formatting.style.routines),
      kind: CompletionItemKind.Function,
      sortText: SORT_PRIORITY.ROUTINES,
      detail: IDL_TRANSLATION.autoComplete.detail.procedure,
    });
  }
}
