import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { CompletionItem } from 'vscode-languageserver';

import { IDLIndex } from '../idl-index.class';
import {
  AutoCompleteRecipeOptions,
  AutoCompleteType,
} from './auto-complete-recipe.interface';
import { BuildCompileOptCompletionItems } from './completion-for/completion-compile-opts';
import { BuildExecutiveCommandCompletionItems } from './completion-for/completion-executive-commands';
import { BuildFunctionMethodCompletionItems } from './completion-for/completion-function-methods';
import { BuildFunctionCompletionItems } from './completion-for/completion-functions';

/**
 * Options passed into all completion items that we build
 */
export type BuildCompletionItemsArg<T extends AutoCompleteType> = {
  complete: CompletionItem[];
  options: AutoCompleteRecipeOptions<T>;
  formatting: IAssemblerOptions<FormatterType>;
  index: IDLIndex;
};

/**
 * Callback structure for completion items
 */
export type BuildCompletionItemsCallback<T extends AutoCompleteType> = (
  options: BuildCompletionItemsArg<T>
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
  'executive-command': BuildExecutiveCommandCompletionItems,
  'function-method': BuildFunctionMethodCompletionItems,
  function: BuildFunctionCompletionItems,
};
