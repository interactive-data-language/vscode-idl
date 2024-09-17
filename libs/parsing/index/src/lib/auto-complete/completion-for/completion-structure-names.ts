import { AdjustCase, TransformCase } from '@idl/assembling/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { CUSTOM_TYPE_DISPLAY_NAMES } from '@idl/types/core';
import { CompletionItemKind } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { SORT_PRIORITY } from '../sort-priority.interface';
import { StructureNameCompletion } from './completion-structure-names.interface';

/**
 * Adds variables to our completion items
 */
export function BuildCompletionStructureNameItems(
  arg: BuildCompletionItemsArg<StructureNameCompletion>
) {
  // add user procedures first
  const displayNames = Object.values(CUSTOM_TYPE_DISPLAY_NAMES);
  for (let i = 0; i < displayNames.length; i++) {
    if (displayNames[i].includes(':')) {
      continue;
    }
    arg.complete.push({
      label: displayNames[i].startsWith('!')
        ? AdjustCase(displayNames[i], arg.formatting.style.systemVariables)
        : TransformCase(displayNames[i], arg.formatting.style.structureNames),
      kind: CompletionItemKind.Class,
      sortText: SORT_PRIORITY.STRUCTURES,
      detail: IDL_TRANSLATION.autoComplete.detail.structure,
    });
  }
}
