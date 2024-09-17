import {
  CompileOptCompletion,
  ICompileOptCompletionOptions,
} from './completion-for/completion-compile-opts.interface';
import {
  ExecutiveCommandCompletion,
  IExecutiveCommandCompletionOptions,
} from './completion-for/completion-executive-commands.interface';
import {
  FunctionMethodCompletion,
  IFunctionMethodCompletionOptions,
} from './completion-for/completion-function-methods.interface';
import {
  FunctionCompletion,
  IFunctionCompletionOptions,
} from './completion-for/completion-functions.interface';
import {
  IIncludeCompletionOptions,
  IncludeCompletion,
} from './completion-for/completion-include.interface';

/**
 * Types of auto-complete
 */
export type AutoCompleteType =
  | CompileOptCompletion
  | ExecutiveCommandCompletion
  | FunctionMethodCompletion
  | FunctionCompletion
  | IncludeCompletion;

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
    : T extends IncludeCompletion
    ? IIncludeCompletionOptions
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
