import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AdjustCase, TransformCase } from '@idl/assembling/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { CUSTOM_TYPE_DISPLAY_NAMES } from '@idl/types/core';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Adds variables to our completion items
 */
export function AddCompletionStructureNames(
  complete: CompletionItem[],
  formatting: IAssemblerOptions<FormatterType>
) {
  // add user procedures first
  const displayNames = Object.values(CUSTOM_TYPE_DISPLAY_NAMES);
  for (let i = 0; i < displayNames.length; i++) {
    if (displayNames[i].includes(':')) {
      continue;
    }
    complete.push({
      label: displayNames[i].startsWith('!')
        ? AdjustCase(displayNames[i], formatting.style.systemVariables)
        : TransformCase(displayNames[i], formatting.style.structureNames),
      kind: CompletionItemKind.Class,
      sortText: SORT_PRIORITY.STRUCTURES,
      detail: IDL_TRANSLATION.autoComplete.detail.structure,
    });
  }
}
