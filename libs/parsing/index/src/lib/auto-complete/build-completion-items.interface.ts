import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { CompletionItem } from 'vscode-languageserver';

import {
  AutoCompleteRecipeOptions,
  AutoCompleteType,
} from './auto-complete-recipe.interface';
import { BuildCompileOptCompletionItems } from './completion-for/add-completion-compile-opts';

/**
 * Callback structure for completion items
 */
export type BuildCompletionItemsCallback<T extends AutoCompleteType> = (
  complete: CompletionItem[],
  options: AutoCompleteRecipeOptions<T>,
  formatting: IAssemblerOptions<FormatterType>
) => void;

/**
 * Data structure for all of our lookups
 */
export type BuildCompletionItemsLookup = {
  [T in AutoCompleteType]: BuildCompletionItemsCallback<T>;
};

/**
 * Build all completion items
 */
export const ALL_COMPLETION_ITEM_BUILDERS: BuildCompletionItemsLookup = {
  'compile-opt': BuildCompileOptCompletionItems,
};
