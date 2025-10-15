import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import {
  AutoCompleteRecipeOptions,
  AutoCompleteType,
} from '@idl/types/auto-complete';
import { CompletionItem } from 'vscode-languageserver';

import { IDLIndex } from '../idl-index.class';
import { BuildBlockCompletionItems } from './completion-for/completion-blocks';
import { BuildCompileOptCompletionItems } from './completion-for/completion-compile-opts';
import { BuildExecutiveCommandCompletionItems } from './completion-for/completion-executive-commands';
import { BuildFunctionMethodCompletionItems } from './completion-for/completion-function-methods';
import { BuildFunctionCompletionItems } from './completion-for/completion-functions';
import { BuildIncludeCompletionItems } from './completion-for/completion-include';
import { BuildKeywordCompletionItems } from './completion-for/completion-keywords';
import { BuildProcedureMethodCompletionItems } from './completion-for/completion-procedure-methods';
import { BuildProcedureCompletionItems } from './completion-for/completion-procedures';
import { BuildPropertyCompletionItems } from './completion-for/completion-properties';
import { BuildPropertyInStructureCompletionItems } from './completion-for/completion-properties-in-structures';
import { BuildSpecialFunctionCompletionItems } from './completion-for/completion-special-functions';
import { BuildSpecialProcedureCompletionItems } from './completion-for/completion-special-procedures';
import { BuildCompletionStructureNameItems } from './completion-for/completion-structure-names';
import { BuildCompletionSystemVariableItems } from './completion-for/completion-system-variables';
import { BuildVariableCompletionItems } from './completion-for/completion-variables';

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
  blocks: BuildBlockCompletionItems,
  'compile-opt': BuildCompileOptCompletionItems,
  'executive-command': BuildExecutiveCommandCompletionItems,
  'function-method': BuildFunctionMethodCompletionItems,
  function: BuildFunctionCompletionItems,
  include: BuildIncludeCompletionItems,
  keyword: BuildKeywordCompletionItems,
  procedure: BuildProcedureCompletionItems,
  'procedure-method': BuildProcedureMethodCompletionItems,
  property: BuildPropertyCompletionItems,
  'property-in-structure': BuildPropertyInStructureCompletionItems,
  'special-function': BuildSpecialFunctionCompletionItems,
  'special-procedure': BuildSpecialProcedureCompletionItems,
  'structure-name': BuildCompletionStructureNameItems,
  'system-variable': BuildCompletionSystemVariableItems,
  variable: BuildVariableCompletionItems,
};
