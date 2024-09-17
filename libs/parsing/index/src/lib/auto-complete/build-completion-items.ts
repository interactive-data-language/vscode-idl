import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { CompletionItem } from 'vscode-languageserver';

import { IDLIndex } from '../idl-index.class';
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
  formatting: IAssemblerOptions<FormatterType>,
  index: IDLIndex
) {
  /** initial list of completion items */
  const complete: CompletionItem[] = [];

  // process each item
  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].type in ALL_COMPLETION_ITEM_BUILDERS) {
      ALL_COMPLETION_ITEM_BUILDERS[recipes[i].type]({
        complete,
        // overload with any because the types arent smart enough to figure it out...
        options: recipes[i].options as any,
        formatting,
        index,
      });
    }
  }

  return complete;
}
