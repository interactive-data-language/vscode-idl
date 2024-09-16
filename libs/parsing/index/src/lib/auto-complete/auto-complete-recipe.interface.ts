import {
  CompileOptCompletion,
  ICompileOptRecipeOptions,
} from './completion-for/add-completion-compile-opts.interface';

/**
 * Types of auto-complete
 */
export type AutoCompleteType = CompileOptCompletion;

/**
 * Options passed to auto-complete
 */
export type AutoCompleteRecipeOptions<T extends AutoCompleteType> =
  T extends CompileOptCompletion ? ICompileOptRecipeOptions : never;

/**
 * Recipe to describe auto-completion parameters
 */
export type AutoCompleteRecipe<T extends AutoCompleteType> = {
  /** Type of auto-complete */
  type: T;
  /** Options to add auto-complete values */
  options: AutoCompleteRecipeOptions<T>;
};
