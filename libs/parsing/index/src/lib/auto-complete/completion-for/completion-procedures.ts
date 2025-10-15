import { TransformCase } from '@idl/assembling/shared';
import { IDL_DISPLAY_NAMES } from '@idl/parsing/routines';
import { MAIN_LEVEL_NAME } from '@idl/parsing/syntax-tree';
import { IDL_TRANSLATION } from '@idl/translation';
import { ProcedureCompletion } from '@idl/types/auto-complete';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { CompletionItemKind } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { COMPLETION_SORT_PRIORITY } from '../completion-sort-priority.interface';

/**
 * Display names for procedures
 */
const PROCEDURES = IDL_DISPLAY_NAMES[GLOBAL_TOKEN_TYPES.PROCEDURE];

/**
 * Makes completion items for procedures
 */
export function BuildProcedureCompletionItems(
  arg: BuildCompletionItemsArg<ProcedureCompletion>
) {
  // add user procedures first
  const displayNames = Object.values(PROCEDURES);
  for (let i = 0; i < displayNames.length; i++) {
    if (displayNames[i] === MAIN_LEVEL_NAME) {
      continue;
    }
    arg.complete.push({
      label: TransformCase(displayNames[i], arg.formatting.style.routines),
      kind: CompletionItemKind.Function,
      sortText: COMPLETION_SORT_PRIORITY.ROUTINES,
      detail: IDL_TRANSLATION.autoComplete.detail.procedure,
    });
  }
}
