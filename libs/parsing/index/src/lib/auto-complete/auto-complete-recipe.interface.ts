import {
  CompileOptCompletion,
  ICompileOptCompletionOptions,
} from './completion-for/add-completion-compile-opts.interface';
import { ExecutiveCommandCompletion } from './completion-for/add-completion-executive-commands.interface';

/**
 * Types of auto-complete
 */
export type AutoCompleteType =
  | CompileOptCompletion
  | ExecutiveCommandCompletion;

/**
 * Options passed to auto-complete
 */
export type AutoCompleteRecipeOptions<T extends AutoCompleteType> =
  T extends CompileOptCompletion ? ICompileOptCompletionOptions : never;

/**
 * Recipe to describe auto-completion parameters
 */
export type AutoCompleteRecipe<T extends AutoCompleteType> = {
  /** Type of auto-complete */
  type: T;
  /** Options to add auto-complete values */
  options: AutoCompleteRecipeOptions<T>;
};
