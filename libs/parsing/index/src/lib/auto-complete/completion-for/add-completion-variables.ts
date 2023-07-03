import {
  GetLocalTokenLookup,
  IParsed,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';
import { IDL_TRANSLATION } from '@idl/translation';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { SORT_PRIORITY } from '../sort-priority.interface';

/**
 * Adds variables to our completion items
 */
export function AddCompletionVariables(
  complete: CompletionItem[],
  parsed: IParsed,
  parent?: TreeBranchToken
) {
  // get our lookup
  const lookup = GetLocalTokenLookup(parsed, parent);

  // add to completion items
  const keys = Object.keys(lookup);
  for (let i = 0; i < keys.length; i++) {
    // extract var
    const variable = lookup[keys[i]];

    // add
    complete.push({
      label: variable.meta.display,
      kind: CompletionItemKind.Variable,
      sortText: SORT_PRIORITY.VARIABLES,
      detail: IDL_TRANSLATION.autoComplete.detail.variable,
      documentation: variable.meta.docs,
    });
  }
}
