import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { CompletionItem } from 'vscode-languageserver';

import {
  AutoCompleteRecipe,
  AutoCompleteType,
} from './auto-complete-recipe.interface';
import { ALL_COMPLETION_ITEM_BUILDERS } from './build-completion-items.interface';

/**
 * Builds auto-complete items from our recipes
 */
export function BuildCompletionItems(
  recipes: AutoCompleteRecipe<AutoCompleteType>[],
  formatting: IAssemblerOptions<FormatterType>
) {
  /** initial list of completion items */
  const complete: CompletionItem[] = [];

  // process each item
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].type in ALL_COMPLETION_ITEM_BUILDERS) {
      ALL_COMPLETION_ITEM_BUILDERS[recipes[i].type](
        complete,
        recipes[i].options,
        formatting
      );
    }
  }

  return complete;
}
