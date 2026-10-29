import type {
  BlockCompletion,
  IBlockCompletionOptions,
} from './completion-for/completion-blocks.interface';
import type {
  CompileOptCompletion,
  ICompileOptCompletionOptions,
} from './completion-for/completion-compile-opts.interface';
import type {
  ExecutiveCommandCompletion,
  IExecutiveCommandCompletionOptions,
} from './completion-for/completion-executive-commands.interface';
import type {
  FunctionMethodCompletion,
  IFunctionMethodCompletionOptions,
} from './completion-for/completion-function-methods.interface';
import type {
  FunctionCompletion,
  IFunctionCompletionOptions,
} from './completion-for/completion-functions.interface';
import type {
  IIncludeCompletionOptions,
  IncludeCompletion,
} from './completion-for/completion-include.interface';
import type {
  IKeywordCompletionOptions,
  KeywordCompletion,
} from './completion-for/completion-keyword.interface';
import type {
  IProcedureMethodCompletionOptions,
  ProcedureMethodCompletion,
} from './completion-for/completion-procedure-methods.interface';
import type {
  IProcedureCompletionOptions,
  ProcedureCompletion,
} from './completion-for/completion-procedures.interface';
import type {
  IPropertyCompletionOptions,
  PropertyCompletion,
} from './completion-for/completion-properties.interface';
import type {
  IPropertyInStructureCompletionOptions,
  PropertyInStructureCompletion,
} from './completion-for/completion-properties-in-structures.interface';
import type {
  ISpecialFunctionCompletionOptions,
  SpecialFunctionCompletion,
} from './completion-for/completion-special-functions.interface';
import type {
  ISpecialProcedureCompletionOptions,
  SpecialProcedureCompletion,
} from './completion-for/completion-special-procedures.interface';
import type {
  IStructureNameCompletionOptions,
  StructureNameCompletion,
} from './completion-for/completion-structure-names.interface';
import type {
  ISystemVariableCompletionOptions,
  SystemVariableCompletion,
} from './completion-for/completion-system-variables.interface';
import type {
  IVariableCompletionOptions,
  VariableCompletion,
} from './completion-for/completion-variables.interface';

/**
 * Types of auto-complete
 */
export type AutoCompleteType =
  | BlockCompletion
  | CompileOptCompletion
  | ExecutiveCommandCompletion
  | FunctionCompletion
  | FunctionMethodCompletion
  | IncludeCompletion
  | KeywordCompletion
  | ProcedureCompletion
  | ProcedureMethodCompletion
  | PropertyCompletion
  | PropertyInStructureCompletion
  | SpecialFunctionCompletion
  | SpecialProcedureCompletion
  | StructureNameCompletion
  | SystemVariableCompletion
  | VariableCompletion;

/**
 * Options passed to auto-complete
 */
export type AutoCompleteRecipeOptions<T extends AutoCompleteType> =
  T extends BlockCompletion
    ? IBlockCompletionOptions
    : T extends CompileOptCompletion
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
                : T extends ProcedureCompletion
                  ? IProcedureCompletionOptions
                  : T extends ProcedureMethodCompletion
                    ? IProcedureMethodCompletionOptions
                    : T extends PropertyCompletion
                      ? IPropertyCompletionOptions
                      : T extends PropertyInStructureCompletion
                        ? IPropertyInStructureCompletionOptions
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

/**
 * Strictly typed lookup for completion types
 */
interface IAutoCompleteTypeLookup {
  BLOCK: BlockCompletion;
  COMPILE_OPT: CompileOptCompletion;
  EXECUTIVE_COMMAND: ExecutiveCommandCompletion;
  FUNCTION: FunctionCompletion;
  FUNCTION_METHOD: FunctionMethodCompletion;
  INCLUDE: IncludeCompletion;
  KEYWORD: KeywordCompletion;
  PROCEDURE: ProcedureCompletion;
  PROCEDURE_METHOD: ProcedureMethodCompletion;
  PROPERTY: PropertyCompletion;
  PROPERTY_IN_STRUCTURE: PropertyInStructureCompletion;
  SPECIAL_FUNCTION: SpecialFunctionCompletion;
  SPECIAL_PROCEDURE: SpecialProcedureCompletion;
  STRUCTURE_NAME: StructureNameCompletion;
  SYSTEM_VARIABLE: SystemVariableCompletion;
  VARIABLE: VariableCompletion;
}

/**
 * Lookup of all types of auto-complete
 */
export const AUTO_COMPLETE_TYPE_LOOKUP: IAutoCompleteTypeLookup = {
  BLOCK: 'blocks',
  COMPILE_OPT: 'compile-opt',
  EXECUTIVE_COMMAND: 'executive-command',
  FUNCTION: 'function',
  FUNCTION_METHOD: 'function-method',
  INCLUDE: 'include',
  KEYWORD: 'keyword',
  PROCEDURE: 'procedure',
  PROCEDURE_METHOD: 'procedure-method',
  PROPERTY: 'property',
  PROPERTY_IN_STRUCTURE: 'property-in-structure',
  SPECIAL_FUNCTION: 'special-function',
  SPECIAL_PROCEDURE: 'special-procedure',
  STRUCTURE_NAME: 'structure-name',
  SYSTEM_VARIABLE: 'system-variable',
  VARIABLE: 'variable',
};
