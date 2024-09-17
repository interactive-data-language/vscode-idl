import {
  CompileOptCompletion,
  ICompileOptCompletionOptions,
} from './completion-for/add-completion-compile-opts.interface';
import {
  ExecutiveCommandCompletion,
  IExecutiveCommandCompletionOptions,
} from './completion-for/add-completion-executive-commands.interface';
import {
  FunctionMethodCompletion,
  IFunctionMethodCompletionOptions,
} from './completion-for/add-completion-function-methods.interface';
import {
  FunctionCompletion,
  IFunctionCompletionOptions,
} from './completion-for/add-completion-functions.interface';

/**
 * Types of auto-complete
 */
export type AutoCompleteType =
  | CompileOptCompletion
  | ExecutiveCommandCompletion
  | FunctionMethodCompletion
  | FunctionCompletion;

/**
 * Options passed to auto-complete
 */
export type AutoCompleteRecipeOptions<T extends AutoCompleteType> =
  T extends CompileOptCompletion
    ? ICompileOptCompletionOptions
    : T extends ExecutiveCommandCompletion
    ? IExecutiveCommandCompletionOptions
    : T extends FunctionMethodCompletion
    ? IFunctionMethodCompletionOptions
    : T extends FunctionCompletion
    ? IFunctionCompletionOptions
    : never;

/**
 * Recipe to describe auto-completion parameters
 */
export type AutoCompleteRecipe<T extends AutoCompleteType> = {
  /** Type of auto-complete */
  type: T;
  /** Options to add auto-complete values */
  options: AutoCompleteRecipeOptions<T>;
};
