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
import {
  IKeywordCompletionOptions,
  KeywordCompletion,
} from './completion-for/completion-keyword.interface';
import {
  ISpecialFunctionCompletionOptions,
  SpecialFunctionCompletion,
} from './completion-for/completion-special-functions.interface';
import {
  ISpecialProcedureCompletionOptions,
  SpecialProcedureCompletion,
} from './completion-for/completion-special-procedures.interface';
import {
  IStructureNameCompletionOptions,
  StructureNameCompletion,
} from './completion-for/completion-structure-names.interface';
import {
  ISystemVariableCompletionOptions,
  SystemVariableCompletion,
} from './completion-for/completion-system-variables.interface';
import {
  IVariableCompletionOptions,
  VariableCompletion,
} from './completion-for/completion-variables.interface';

/**
 * Types of auto-complete
 */
export type AutoCompleteType =
  | CompileOptCompletion
  | ExecutiveCommandCompletion
  | FunctionMethodCompletion
  | FunctionCompletion
  | IncludeCompletion
  | KeywordCompletion
  | SpecialFunctionCompletion
  | SpecialProcedureCompletion
  | StructureNameCompletion
  | SystemVariableCompletion
  | VariableCompletion;

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
    : T extends KeywordCompletion
    ? IKeywordCompletionOptions
    : T extends SpecialFunctionCompletion
    ? ISpecialFunctionCompletionOptions
    : T extends SpecialProcedureCompletion
    ? ISpecialProcedureCompletionOptions
    : T extends StructureNameCompletion
    ? IStructureNameCompletionOptions
    : T extends SystemVariableCompletion
    ? ISystemVariableCompletionOptions
    : T extends VariableCompletion
    ? IVariableCompletionOptions
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
