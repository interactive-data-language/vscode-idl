import {
  GetLocalTokenLookup,
  IParsed,
  TreeBranchToken,
} from '@idl/parsing/syntax-tree';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IVariableCompletionOptions,
  VariableCompletion,
} from '@idl/types/auto-complete';
import { CompletionItemKind } from 'vscode-languageserver';

import { BuildCompletionItemsArg } from '../build-completion-items.interface';
import { COMPLETION_SORT_PRIORITY } from '../completion-sort-priority.interface';

/**
 * Creates options for keyword auto-complete
 */
export function GetVariableCompletionOptions(
  parsed: IParsed,
  parent?: TreeBranchToken
): IVariableCompletionOptions {
  return {
    lookup: GetLocalTokenLookup(parsed, parent),
  };
}

/**
 * Adds variables to our completion items
 */
export function BuildVariableCompletionItems(
  arg: BuildCompletionItemsArg<VariableCompletion>
) {
  // get our lookup
  const lookup = arg.options.lookup;

  // add to completion items
  const keys = Object.keys(lookup);
  for (let i = 0; i < keys.length; i++) {
    // extract var
    const variable = lookup[keys[i]];

    // add
    arg.complete.push({
      label: variable.meta.display,
      kind: CompletionItemKind.Variable,
      sortText: COMPLETION_SORT_PRIORITY.VARIABLES,
      detail: IDL_TRANSLATION.autoComplete.detail.variable,
      documentation: variable.meta.docs,
    });
  }
}
