/** When a block statement is not closed */
type NotClosedCode = 0;
/** When we encounter an unexpected closing statement */
type UnexpectedCloserCode = 1;
/** When we encounter a token that is not start, end, or basic which parsing tree */
type UnknownBranchTokenCode = 2;
/** When we encounter a token after a main level program has ended */
type AfterMainEndCode = 3;
/** When we have a problem with validating tokens */
type EmbarrassingTokenCode = 4;
/** When we have a problem with syntax tree or creating tokens for our file */
type EmbarrassingFileCode = 5;
/** TODO statement in PRO code */
type ToDoCode = 6;
/** Unknown token (something unexpected) not handled below */
type UnknownTokenCode = 7;
/** Uncaptured (or incomplete) arrow function */
type IllegalArrowCode = 8;
/** Comma where not expected */
type IllegalCommaCode = 9;
/** Colon character not where expected */
type IllegalColonCode = 10;
/** Include statement not where expected */
type IllegalIncludeCode = 11;
/** When our variable name is reserved */
type ReservedVariableNameCode = 12;
/** Ternary operator in the wrong place */
type IllegalTernaryCode = 13;
/** Colon in function call for array indexing */
type ColonInFunctionCode = 14;
/** Colon in function method call for array indexing */
type ColonInFunctionMethodCode = 15;
/** Find two tokens with the same name next to each other */
type DoubleTokenCode = 16;
/** Structure not where expected */
type IllegalStructureCode = 17;
/** Parentheses not where expected */
type IllegalParenthesesCode = 18;
/** brackets not where expected */
type IllegalBracketCode = 19;
/** Return values in procedures having values */
type ReturnValuesIllegalProcedureCode = 20;
/** Return values in functions having too many values */
type ReturnValuesIllegalFunctionsCode = 21;
/** Return values in functions missing a value */
type ReturnValuesMissingFunctionsCode = 22;
/** More than one definition of a routine */
type DuplicateProcedureCode = 23;
/** More than one definition of a routine */
type DuplicateFunctionCode = 24;
/** More than one definition of a routine */
type DuplicateProcedureMethodCode = 25;
/** More than one definition of a routine */
type DuplicateFunctionMethodCode = 26;
/** More than one structure definition with the same name */
type DuplicateStructureCode = 27;
/** More than one structure definition with the same name */
type DuplicateSystemVariableCode = 28;
/** Procedure name that is a reserved IDL internal procedure */
type ReservedProcedureCode = 29;
/** Function name that is a reserved IDL internal function */
type ReservedFunctionCode = 30;
/** Return function missing from function or function method */
type ReturnProcedureMissingCode = 31;
/** Nothing besides a function or procedure can come before a function or procedure definition */
type RoutinesFirstCode = 32;
/** No end to main level program */
type MissingMainEndCode = 33;
/** Main level program needs to have content */
type EmptyMainCode = 34;
/** Illegal token after line continuation */
type IllegalAfterContinuationCode = 35;
/** Procedure method name that is a reserved IDL internal procedure */
type ReservedProcedureMethodCode = 36;
/** Function method name that is a reserved IDL internal function */
type ReservedFunctionMethodCode = 37;
/** Missing compile-opt statement in a routine */
type NoCompileOptCode = 38;
/** Missing idl2 as a compile option for compile opt */
type NoCompileOptIDL2Code = 39;
/** Illegal compile option */
type IllegalCompileOptCode = 40;
/** Compile_opt with no compile options */
type MissingCompileOptionsCode = 41;
/** If we encounter defint32 or strictarr, user should use idl2 */
type UseIDL2CompileOptCode = 42;
/** When we expect to encounter a comma (i.e. after procedure with arguments) */
type ExpectedCommaCode = 43;
/** When dont expect to encounter a comma */
type UnexpectedCommaCode = 44;
/** When you have more than one compile_opt statement */
type MultipleCompileOptsCode = 45;
/** When you have a quote that is not closed. Not a syntax error per-IDL, but is a bug */
type UnclosedQuoteCode = 46;
/** When arguments are not defined first */
type ArgsFirstCode = 47;
/** When a routine has arguments, but the ":Args:" section is missing from docs */
type ArgMissingFromDocsCode = 48;
/** When routine docs has ":Args:", but the routine has no arguments */
type NoArgsToDocumentCode = 49;
/** When a routine has keywords, but the ":Keywords:" section is missing from docs */
type KeywordMissingFromDocsCode = 50;
/** When routine docs has ":Keywords:", but the routine has no keywords */
type NoKeywordsToDocumentCode = 51;
/** When docs for functions are missing return information */
type ReturnsMissingFromDocsCode = 52;
/** When in/out for docs is incorrect */
type InvalidInOutDocsCode = 53;
/** When the required/optional parameter for docs are incorrect */
type InvalidIRequiredOptionalDocsCode = 54;
/** When the type for docs is incorrect */
type InvalidTypeDocsCode = 55;
/** When the last flag is not private/public */
type InvalidPrivateDocsCode = 56;
/** Not enough docs arguments for args or keywords (i.e. in/out, required/optional, dataType) */
type NotEnoughDocumentationParametersCode = 57;
/** Too many docs arguments for args or keywords (i.e. in/out, required/optional, dataType, private/public) */
type TooManyDocumentationParametersCode = 58;
/** A line of docs is not left-aligned and will be trimmed */
type DocsNotLeftAlignedCode = 59;
/** When ":Returns:" is missing the data type */
type ReturnDocsMissingDataTypeCode = 60;
/** When the ":Returns:" in documentation does not *only* contain the type */
type ReturnDocsInvalidCode = 61;
/** When the ":Returns:" is specified for a procedure */
type ReturnDocsNotNeededCode = 62;
/** When a documented parameter does not really exist */
type DocumentedParameterDoesntExistCode = 63;
/** When a parameter is missing from the documentation */
type ParameterIsMissingFromDocsCode = 64;
/** When a string literal expression has too many arguments */
type StringLiteralTooManyArgsCode = 65;
/** When a continue statement isn't found in the right location */
type BadContinueLocationCode = 66;
/** When a break statement isn't found in the right location */
type BadBreakLocationCode = 67;
/** When we expect to have a statement after a token or as the child of a token */
type ExpectedStatementCode = 68;
/** When we encounter a single dot (i.e. access or method, but unfinished) */
type StandaloneDotCode = 69;
/** When we encounter a hex escape character that is wrong */
type IllegalTemplateLiteralHexCode = 70;
/** When we encounter an escape sequence that is unknown or illegal */
type UnknownTemplateLiteralEscapeCode = 71;
/** Two argument definitions or internal keyword definitions with the same name */
type DuplicateArgKeywordVariableDefCode = 72;
/** Two keyword definitions with the same name */
type DuplicateKeywordDefCode = 73;
/** Using the same property in a structure more than once */
type DuplicatePropertyCode = 74;
/** Using the same keyword more than once */
type DuplicateKeywordUsageCode = 75;
/** When an init method for an object class is not a function */
type InitMethodNotFunctionCode = 76;
/** When we don't know structure that is being referenced as a name */
type UnknownStructureNameCode = 77;
/** When we have a bad chain of statements and need to wrap it before continuing */
type IllegalChainCode = 78;
/** When we don't have a structure definition in our docs */
type MissingStructureFromDocsCode = 79;
/** When a property is missing from the docs */
type PropertyMissingFromDocsCode = 80;
/** When a class definition has keywords or arguments and shouldn't */
type ClassNoParametersCode = 81;
/** Not enough docs arguments for properties (i.e. empty) */
type NotEnoughPropertyDocumentationParametersCode = 82;
/** Too many docs arguments for parameters (i.e. more than just type) */
type TooManyPropertyDocumentationParametersCode = 83;
/** When we try to use subscripting (':') with a data type that doesnt work */
type IllegalSubscriptCode = 84;
/** When we try to use any operators with structures (not allowed) */
type IllegalStructureOperationCode = 85;
/** When we try to use any operators with lists where not all types are lists */
type IllegalListOperationCode = 86;
/** When we try to use any operators with hashes as our first type and not all others are hashes, ordered hashes, or dictionaries */
type IllegalHashOperationCode = 87;
/** When we try to use any operators with ordered hashes as our first type and not all others are hashes, ordered hashes, or dictionaries */
type IllegalOrderedHashOperationCode = 88;
/** When we try to use any operators with dictionaries as our first type and not all others are hashes, ordered hashes, or dictionaries */
type IllegalDictionaryOperationCode = 89;
/** When we have unknown types being operated on */
type PotentialTypeIncompatibilitiesCode = 90;
/** When we have non-standard types for indexing */
type IllegalIndexTypeCode = 91;
/** When we merge arrays with unknown types */
type PotentialArrayTypeIncompatibilitiesCode = 92;
/** When we are trying to dereference a point, but we dont have anything */
type PointerNothingToDeReferenceCode = 93;
/** When we are trying to dereference something besides a pointer */
type PointerDeReferenceIllegalTypeCode = 94;
/** When we try to index something and one or more types doesnt allow it */
type IndexingErrorCode = 95;
/** When we try to de-reference a pointer and not all types allow it */
type PointerDeRefAmbiguityOperationCode = 96;
/** When we have a keyword being used, but dont know what it is */
type UnknownKeywordCode = 97;
/** When a ternary operator is incomplete */
type IncompleteTernaryCode = 98;
/** When a variable is undefined and hasn't been defined */
type UndefinedVariableCode = 99;
/** When a variable is undefined and hasn't been defined, but a common block is present */
type PotentiallyUndefinedVariableCode = 100;
/** When a variable is defined, but we use it before it is actually defined */
type VariableUsageBeforeDefinitionCode = 101;
/** When a variable is defined, but we use it before it is actually defined and we have a common block */
type PotentialVariableUsageBeforeDefinitionCode = 102;
/** When we use shorthand notation for a keyword that is ambiguous */
type AmbiguousKeywordAbbreviationCode = 103;
/** When we have a variable that is not used */
type UnusedVariableCode = 104;
/** Illegal use of parentheses for indexing */
type IllegalVariableIndexCode = 105;
/** When include references are circular */
type CircularIncludeCode = 106;
/** When we disable a problem, but the alias is unknown */
type UnknownDisabledAliasCode = 107;
/** When we detect code that is floating and should have assignment or something as part of it */
type StandaloneExpressionCode = 108;
/** When we will automatically print a statement in notebooks */
type ImpliedPrintForNotebookCode = 109;

/**
 * Union type of all allowed problem codes for IDL
 */
export type IDLProblemCode =
  | NotClosedCode
  | UnexpectedCloserCode
  | UnknownBranchTokenCode
  | AfterMainEndCode
  | EmbarrassingTokenCode
  | EmbarrassingFileCode
  | ToDoCode
  | UnknownTokenCode
  | IllegalArrowCode
  | IllegalCommaCode
  | IllegalColonCode
  | IllegalIncludeCode
  | ReservedVariableNameCode
  | IllegalTernaryCode
  | ColonInFunctionCode
  | ColonInFunctionMethodCode
  | DoubleTokenCode
  | IllegalStructureCode
  | IllegalParenthesesCode
  | IllegalBracketCode
  | ReturnValuesIllegalProcedureCode
  | ReturnValuesIllegalFunctionsCode
  | ReturnValuesMissingFunctionsCode
  | DuplicateProcedureCode
  | DuplicateFunctionCode
  | DuplicateProcedureMethodCode
  | DuplicateFunctionMethodCode
  | DuplicateStructureCode
  | DuplicateSystemVariableCode
  | ReservedProcedureCode
  | ReservedFunctionCode
  | ReturnProcedureMissingCode
  | RoutinesFirstCode
  | MissingMainEndCode
  | EmptyMainCode
  | IllegalAfterContinuationCode
  | ReservedProcedureMethodCode
  | ReservedFunctionMethodCode
  | NoCompileOptCode
  | NoCompileOptIDL2Code
  | IllegalCompileOptCode
  | MissingCompileOptionsCode
  | UseIDL2CompileOptCode
  | ExpectedCommaCode
  | UnexpectedCommaCode
  | MultipleCompileOptsCode
  | UnclosedQuoteCode
  | ArgsFirstCode
  | ArgMissingFromDocsCode
  | NoArgsToDocumentCode
  | KeywordMissingFromDocsCode
  | NoKeywordsToDocumentCode
  | ReturnsMissingFromDocsCode
  | InvalidInOutDocsCode
  | InvalidIRequiredOptionalDocsCode
  | InvalidTypeDocsCode
  | InvalidPrivateDocsCode
  | NotEnoughDocumentationParametersCode
  | TooManyDocumentationParametersCode
  | DocsNotLeftAlignedCode
  | ReturnDocsMissingDataTypeCode
  | ReturnDocsInvalidCode
  | ReturnDocsNotNeededCode
  | DocumentedParameterDoesntExistCode
  | ParameterIsMissingFromDocsCode
  | StringLiteralTooManyArgsCode
  | BadContinueLocationCode
  | BadBreakLocationCode
  | ExpectedStatementCode
  | StandaloneDotCode
  | IllegalTemplateLiteralHexCode
  | UnknownTemplateLiteralEscapeCode
  | DuplicateArgKeywordVariableDefCode
  | DuplicateKeywordDefCode
  | DuplicatePropertyCode
  | DuplicateKeywordUsageCode
  | InitMethodNotFunctionCode
  | UnknownStructureNameCode
  | IllegalChainCode
  | MissingStructureFromDocsCode
  | PropertyMissingFromDocsCode
  | ClassNoParametersCode
  | NotEnoughPropertyDocumentationParametersCode
  | TooManyPropertyDocumentationParametersCode
  | IllegalSubscriptCode
  | IllegalStructureOperationCode
  | IllegalListOperationCode
  | IllegalHashOperationCode
  | IllegalOrderedHashOperationCode
  | IllegalDictionaryOperationCode
  | PotentialTypeIncompatibilitiesCode
  | IllegalIndexTypeCode
  | PotentialArrayTypeIncompatibilitiesCode
  | PointerNothingToDeReferenceCode
  | PointerDeReferenceIllegalTypeCode
  | IndexingErrorCode
  | PointerDeRefAmbiguityOperationCode
  | UnknownKeywordCode
  | IncompleteTernaryCode
  | UndefinedVariableCode
  | PotentiallyUndefinedVariableCode
  | VariableUsageBeforeDefinitionCode
  | PotentialVariableUsageBeforeDefinitionCode
  | AmbiguousKeywordAbbreviationCode
  | UnusedVariableCode
  | IllegalVariableIndexCode
  | CircularIncludeCode
  | UnknownDisabledAliasCode
  | StandaloneExpressionCode
  | ImpliedPrintForNotebookCode;

/**
 * Type to be used in translation to make sure that we have all of our expected translations
 */
export type ProblemCodeLookup = {
  [property in IDLProblemCode]: string;
};

/**
 * Strictly types interface for looking up the problems with IDL code
 */
interface IProblemLookup {
  /** When a block statement is not closed */
  NOT_CLOSED: NotClosedCode;
  /** When we encounter an unexpected closing statement */
  UNEXPECTED_CLOSER: UnexpectedCloserCode;
  /** When we encounter an unhandled token */
  UNKNOWN_BRANCH_TOKEN: UnknownBranchTokenCode;
  /** When we encounter a token after a main level program has ended */
  AFTER_MAIN: AfterMainEndCode;
  /** When we have a problem with validating tokens */
  EMBARRASSING_TOKEN: EmbarrassingTokenCode;
  /** When we have a problem with syntax tree or creating tokens for our file */
  EMBARRASSING_FILE: EmbarrassingFileCode;
  /** TODO statement in PRO code */
  TODO: ToDoCode;
  /** Unknown token (something unexpected) not handled below */
  UNKNOWN_TOKEN: UnknownTokenCode;
  /** Uncaptured (or incomplete) arrow function */
  ILLEGAL_ARROW: IllegalArrowCode;
  /** Comma where not expected */
  ILLEGAL_COMMA: IllegalCommaCode;
  /** Colon character not where expected */
  ILLEGAL_COLON: IllegalColonCode;
  /** Include statement not where expected */
  ILLEGAL_INCLUDE: IllegalIncludeCode;
  /** When our variable name is reserved */
  RESERVED_VARIABLE: ReservedVariableNameCode;
  /** Ternary operator in the wrong place */
  ILLEGAL_TERNARY: IllegalTernaryCode;
  /** Colon in function call for array indexing */
  COLON_IN_FUNCTION: ColonInFunctionCode;
  /** Colon in function method call for array indexing */
  COLON_IN_FUNCTION_METHOD: ColonInFunctionMethodCode;
  /** Find two tokens with the same name next to each other */
  DOUBLE_TOKEN: DoubleTokenCode;
  /** Structure not where expected */
  ILLEGAL_STRUCTURE: IllegalStructureCode;
  /** Parentheses not where expected */
  ILLEGAL_PARENTHESES: IllegalParenthesesCode;
  /** Brackets not where expected */
  ILLEGAL_BRACKET: IllegalBracketCode;
  /** Return values in procedures having values */
  RETURN_VALUES_PROCEDURES: ReturnValuesIllegalProcedureCode;
  /** Return values in functions having too many values */
  RETURN_VALUES_FUNCTIONS: ReturnValuesIllegalFunctionsCode;
  /** Return values in functions missing a value */
  RETURN_FUNCTION_MISSING: ReturnValuesMissingFunctionsCode;
  /** More than one definition of a routine */
  DUPLICATE_PROCEDURE: DuplicateProcedureCode;
  /** More than one definition of a routine */
  DUPLICATE_FUNCTION: DuplicateFunctionCode;
  /** More than one definition of a routine */
  DUPLICATE_PROCEDURE_METHOD: DuplicateProcedureMethodCode;
  /** More than one definition of a routine */
  DUPLICATE_FUNCTION_METHOD: DuplicateFunctionMethodCode;
  /** More than one structure definition with the same name */
  DUPLICATE_STRUCTURE: DuplicateStructureCode;
  /** More than one structure definition with the same name */
  DUPLICATE_SYSTEM_VARIABLE: DuplicateSystemVariableCode;
  /** Procedure name that is a reserved IDL internal procedure */
  RESERVED_PROCEDURE: ReservedProcedureCode;
  /** Function name that is a reserved IDL internal function */
  RESERVED_FUNCTION: ReservedFunctionCode;
  /** Return function missing from function or function method */
  RETURN_MISSING: ReturnProcedureMissingCode;
  /** Nothing besides a function or procedure can come before a function or procedure definition */
  ROUTINES_FIRST: RoutinesFirstCode;
  /** No end to main level program */
  MISSING_MAIN_END: MissingMainEndCode;
  /** Main level program needs to have content */
  EMPTY_MAIN: EmptyMainCode;
  /** Illegal token after line continuation */
  ILLEGAL_AFTER_LINE_CONTINUATION: IllegalAfterContinuationCode;
  /** Procedure method name that is a reserved IDL internal procedure */
  RESERVED_PROCEDURE_METHOD: ReservedProcedureMethodCode;
  /** Function method name that is a reserved IDL internal function */
  RESERVED_FUNCTION_METHOD: ReservedFunctionMethodCode;
  /** Missing compile-opt statement in a routine */
  NO_COMPILE_OPT: NoCompileOptCode;
  /** Missing idl2 as a compile option for compile opt */
  NO_COMPILE_OPT_IDL2: NoCompileOptIDL2Code;
  /** Illegal compile option */
  ILLEGAL_COMPILE_OPT: IllegalCompileOptCode;
  /** Compile_opt with no compile options */
  MISSING_COMPILE_OPTIONS: MissingCompileOptionsCode;
  /** If we encounter defint32 or strictarr, user should use idl2 */
  USE_IDL2_COMPILE_OPT: UseIDL2CompileOptCode;
  /** When we expect to encounter a comma (i.e. after compile_opt idl2) */
  EXPECTED_COMMA: ExpectedCommaCode;
  /** When dont expect to encounter a comma */
  UNEXPECTED_COMMA: UnexpectedCommaCode;
  /** When you have more than one compile_opt statement */
  MULTIPLE_COMPILE_OPT: MultipleCompileOptsCode;
  /** When you have a quote that is not closed. Not a syntax error per-IDL, but is a bug */
  UNCLOSED_QUOTE: UnclosedQuoteCode;
  /** When arguments are not defined first */
  ARGS_FIRST: ArgsFirstCode;
  /** When a routine has arguments, but the ":Args:" section is missing from docs */
  ARGS_MISSING_FROM_DOCS: ArgMissingFromDocsCode;
  /** When routine docs has ":Args:", but the routine has no arguments */
  NO_ARGS_TO_DOCUMENT: NoArgsToDocumentCode;
  /** When a routine has keywords, but the ":Keywords:" section is missing from docs */
  KEYWORDS_MISSING_FROM_DOCS: KeywordMissingFromDocsCode;
  /** When routine docs has ":Keywords:", but the routine has no keywords */
  NO_KEYWORDS_TO_DOCUMENT: NoKeywordsToDocumentCode;
  /** When docs for functions don't have return information */
  RETURNS_MISSING_FROM_DOCS: ReturnsMissingFromDocsCode;
  /** When in/out for docs is incorrect */
  INVALID_IN_OUT_DOCS: InvalidInOutDocsCode;
  /** When the required/optional parameter for docs are incorrect */
  INVALID_REQUIRED_OPTIONAL_DOCS: InvalidIRequiredOptionalDocsCode;
  /** When the type for docs is incorrect */
  INVALID_TYPE_DOCS: InvalidTypeDocsCode;
  /** When the last flag is not private/public */
  INVALID_PRIVATE_DOCS: InvalidPrivateDocsCode;
  /** Not enough docs arguments for args or keywords (i.e. in/out, required/optional, dataType) */
  NOT_ENOUGH_DOCS_PARAMETERS: NotEnoughDocumentationParametersCode;
  /** Too many docs arguments for args or keywords (i.e. in/out, required/optional, dataType, private/public) */
  TOO_MANY_DOCS_PARAMETERS: TooManyDocumentationParametersCode;
  /** A line of docs is not left-aligned and will be trimmed */
  DOCS_NOT_LEFT_ALIGNED: DocsNotLeftAlignedCode;
  /** When the return statement is not immediately followed by the data type */
  RETURN_DOCS_MISSING_TYPE: ReturnDocsMissingDataTypeCode;
  /** When the ":Returns:" in documentation does not *only* contain the type */
  RETURN_DOCS_INVALID: ReturnDocsInvalidCode;
  /** When the ":Returns:" is specified for a procedure */
  RETURN_DOCS_NOT_NEEDED: ReturnDocsNotNeededCode;
  /** When a documented parameter does not really exist */
  DOCUMENTED_PARAMETER_DOESNT_EXIST: DocumentedParameterDoesntExistCode;
  /** When a parameter is missing from the documentation */
  PARAMETER_IS_MISSING_FROM_DOCS: ParameterIsMissingFromDocsCode;
  /** When a string literal expression has too many arguments */
  STRING_LITERAL_TOO_MANY_ARGS: StringLiteralTooManyArgsCode;
  /** When a continue statement isn't found in the right location */
  BAD_CONTINUE_LOCATION: BadContinueLocationCode;
  /** When a break statement isn't found in the right location */
  BAD_BREAK_LOCATION: BadBreakLocationCode;
  /** When we expect to have a statement after a token or as the child of a token */
  EXPECTED_STATEMENT: ExpectedStatementCode;
  /** When we encounter a single dot (i.e. access or method, but unfinished) */
  STANDALONE_DOT: StandaloneDotCode;
  /** When we encounter a hex escape character that is wrong */
  TEMPLATE_LITERAL_HEX: IllegalTemplateLiteralHexCode;
  /** When we encounter an escape sequence that is unknown or illegal */
  UNKNOWN_TEMPLATE_LITERAL_ESCAPE: UnknownTemplateLiteralEscapeCode;
  /** Two argument definitions or internal keyword definitions with the same name */
  DUPLICATE_ARG_VARIABLE_DEF: DuplicateArgKeywordVariableDefCode;
  /** Two keyword definitions with the same name */
  DUPLICATE_KEYWORD_DEF: DuplicateKeywordDefCode;
  /** Using the same property in a structure more than once */
  DUPLICATE_PROPERTY: DuplicatePropertyCode;
  /** Using the same keyword more than once */
  DUPLICATE_KEYWORD_USAGE: DuplicateKeywordUsageCode;
  /** When an init method for an object class is not a function */
  INIT_METHOD_NOT_FUNCTION: InitMethodNotFunctionCode;
  /** When we don't know structure that is being referenced as a name */
  UNKNOWN_STRUCTURE: UnknownStructureNameCode;
  /** When we have a bad chain of statements and need to wrap it before continuing */
  ILLEGAL_CHAIN: IllegalChainCode;
  /** When we don't have a structure definition in our docs */
  MISSING_STRUCTURE_FROM_DOCS: MissingStructureFromDocsCode;
  /** When a property is missing from the docs */
  PROPERTY_MISSING_FROM_DOCS: PropertyMissingFromDocsCode;
  /** When a class definition has keywords or arguments and shouldn't */
  CLASS_NO_PARAMETERS: ClassNoParametersCode;
  /** Not enough docs arguments for properties (i.e. empty) */
  NOT_ENOUGH_PROPERTY_DOCS_PARAMETERS: NotEnoughPropertyDocumentationParametersCode;
  /** Too many docs arguments for parameters (i.e. more than just type) */
  TOO_MANY_PROPERTY_DOCS_PARAMETERS: TooManyPropertyDocumentationParametersCode;
  /** When we try to use subscripting (':') with a data type that doesnt work */
  ILLEGAL_SUBSCRIPT: IllegalSubscriptCode;
  /** When we try to use any operators with structures (not allowed) */
  ILLEGAL_STRUCTURE_OPERATION: IllegalStructureOperationCode;
  /** When we try to use any operators with lists where not all types are lists */
  ILLEGAL_LIST_OPERATION: IllegalListOperationCode;
  /** When we try to use any operators with hashes as our first type and not all others are hashes, ordered hashes, or dictionaries */
  ILLEGAL_HASH_OPERATION: IllegalHashOperationCode;
  /** When we try to use any operators with ordered hashes as our first type and not all others are hashes, ordered hashes, or dictionaries */
  ILLEGAL_ORDERED_HASH_OPERATION: IllegalOrderedHashOperationCode;
  /** When we try to use any operators with dictionaries as our first type and not all others are hashes, ordered hashes, or dictionaries */
  ILLEGAL_DICTIONARY_OPERATION: IllegalDictionaryOperationCode;
  /** When we have unknown types being operated on */
  POTENTIAL_TYPE_INCOMPATIBILITIES: PotentialTypeIncompatibilitiesCode;
  /** When we have non-standard types for indexing */
  ILLEGAL_INDEX_TYPE: IllegalIndexTypeCode;
  /** When we merge arrays with unknown types */
  POTENTIAL_IDL_ARRAY_TYPE_INCOMPATIBILITIES: PotentialArrayTypeIncompatibilitiesCode;
  /** When we are trying to dereference a point, but we dont have anything */
  POINTER_NOTHING_TO_DE_REF: PointerNothingToDeReferenceCode;
  /** When we are trying to dereference something besides a pointer */
  POINTER_DE_REF_ILLEGAL_TYPE: PointerDeReferenceIllegalTypeCode;
  /** When we try to index something and one or more types doesnt allow it */
  INDEXING_ERROR: IndexingErrorCode;
  /** When we try to de-reference a pointer and not all types allow it */
  POINTER_DE_REF_AMBIGUITY: PointerDeRefAmbiguityOperationCode;
  /** When we have a keyword being used, but dont know what it is */
  UNKNOWN_KEYWORD: UnknownKeywordCode;
  /** When a ternary operator is incomplete */
  INCOMPLETE_TERNARY: IncompleteTernaryCode;
  /** When a variable is undefined and hasn't been defined */
  UNDEFINED_VAR: UndefinedVariableCode;
  /** When a variable is undefined and hasn't been defined, but a common block is present */
  POTENTIALLY_UNDEFINED_VAR: PotentiallyUndefinedVariableCode;
  /** When a variable is defined, but we use it before it is actually defined */
  VAR_USAGE_BEFORE_DEF: VariableUsageBeforeDefinitionCode;
  /** When a variable is defined, but we use it before it is actually defined and we have a common block */
  POTENTIAL_VAR_USAGE_BEFORE_DEF: PotentialVariableUsageBeforeDefinitionCode;
  /** When we use shorthand notation for a keyword that is ambiguous */
  AMBIGUOUS_KEYWORD_ABBREVIATION: AmbiguousKeywordAbbreviationCode;
  /** When we have a variable that is not used */
  UNUSED_VARIABLE: UnusedVariableCode;
  /** Illegal use of parentheses for indexing */
  ILLEGAL_VARIABLE_INDEX: IllegalVariableIndexCode;
  /** IWhen include references are circular */
  CIRCULAR_INCLUDE: CircularIncludeCode;
  /** When we disable a problem, but the alias is unknown */
  UNKNOWN_DISABLED_ALIAS: UnknownDisabledAliasCode;
  /** When we detect code that is floating and should have assignment or something as part of it */
  STANDALONE_EXPRESSION: StandaloneExpressionCode;
  /** When we will automatically print a statement in notebooks */
  IMPLIED_PRINT_NOTEBOOK: ImpliedPrintForNotebookCode;
}

/**
 * Lookup with the problem codes that IDL will report
 */
export const IDL_PROBLEM_CODES: IProblemLookup = {
  NOT_CLOSED: 0,
  UNEXPECTED_CLOSER: 1,
  UNKNOWN_BRANCH_TOKEN: 2,
  AFTER_MAIN: 3,
  EMBARRASSING_TOKEN: 4,
  EMBARRASSING_FILE: 5,
  TODO: 6,
  UNKNOWN_TOKEN: 7,
  ILLEGAL_ARROW: 8,
  ILLEGAL_COMMA: 9,
  ILLEGAL_COLON: 10,
  ILLEGAL_INCLUDE: 11,
  RESERVED_VARIABLE: 12,
  ILLEGAL_TERNARY: 13,
  COLON_IN_FUNCTION: 14,
  COLON_IN_FUNCTION_METHOD: 15,
  DOUBLE_TOKEN: 16,
  ILLEGAL_STRUCTURE: 17,
  ILLEGAL_PARENTHESES: 18,
  ILLEGAL_BRACKET: 19,
  RETURN_VALUES_PROCEDURES: 20,
  RETURN_VALUES_FUNCTIONS: 21,
  RETURN_FUNCTION_MISSING: 22,
  DUPLICATE_PROCEDURE: 23,
  DUPLICATE_FUNCTION: 24,
  DUPLICATE_PROCEDURE_METHOD: 25,
  DUPLICATE_FUNCTION_METHOD: 26,
  DUPLICATE_STRUCTURE: 27,
  DUPLICATE_SYSTEM_VARIABLE: 28,
  RESERVED_PROCEDURE: 29,
  RESERVED_FUNCTION: 30,
  RETURN_MISSING: 31,
  ROUTINES_FIRST: 32,
  MISSING_MAIN_END: 33,
  EMPTY_MAIN: 34,
  ILLEGAL_AFTER_LINE_CONTINUATION: 35,
  RESERVED_PROCEDURE_METHOD: 36,
  RESERVED_FUNCTION_METHOD: 37,
  NO_COMPILE_OPT: 38,
  NO_COMPILE_OPT_IDL2: 39,
  ILLEGAL_COMPILE_OPT: 40,
  MISSING_COMPILE_OPTIONS: 41,
  USE_IDL2_COMPILE_OPT: 42,
  EXPECTED_COMMA: 43,
  UNEXPECTED_COMMA: 44,
  MULTIPLE_COMPILE_OPT: 45,
  UNCLOSED_QUOTE: 46,
  ARGS_FIRST: 47,
  ARGS_MISSING_FROM_DOCS: 48,
  NO_ARGS_TO_DOCUMENT: 49,
  KEYWORDS_MISSING_FROM_DOCS: 50,
  NO_KEYWORDS_TO_DOCUMENT: 51,
  RETURNS_MISSING_FROM_DOCS: 52,
  INVALID_IN_OUT_DOCS: 53,
  INVALID_REQUIRED_OPTIONAL_DOCS: 54,
  INVALID_TYPE_DOCS: 55,
  INVALID_PRIVATE_DOCS: 56,
  NOT_ENOUGH_DOCS_PARAMETERS: 57,
  TOO_MANY_DOCS_PARAMETERS: 58,
  DOCS_NOT_LEFT_ALIGNED: 59,
  RETURN_DOCS_MISSING_TYPE: 60,
  RETURN_DOCS_INVALID: 61,
  RETURN_DOCS_NOT_NEEDED: 62,
  DOCUMENTED_PARAMETER_DOESNT_EXIST: 63,
  PARAMETER_IS_MISSING_FROM_DOCS: 64,
  STRING_LITERAL_TOO_MANY_ARGS: 65,
  BAD_CONTINUE_LOCATION: 66,
  BAD_BREAK_LOCATION: 67,
  EXPECTED_STATEMENT: 68,
  STANDALONE_DOT: 69,
  TEMPLATE_LITERAL_HEX: 70,
  UNKNOWN_TEMPLATE_LITERAL_ESCAPE: 71,
  DUPLICATE_ARG_VARIABLE_DEF: 72,
  DUPLICATE_KEYWORD_DEF: 73,
  DUPLICATE_PROPERTY: 74,
  DUPLICATE_KEYWORD_USAGE: 75,
  INIT_METHOD_NOT_FUNCTION: 76,
  UNKNOWN_STRUCTURE: 77,
  ILLEGAL_CHAIN: 78,
  MISSING_STRUCTURE_FROM_DOCS: 79,
  PROPERTY_MISSING_FROM_DOCS: 80,
  CLASS_NO_PARAMETERS: 81,
  NOT_ENOUGH_PROPERTY_DOCS_PARAMETERS: 82,
  TOO_MANY_PROPERTY_DOCS_PARAMETERS: 83,
  ILLEGAL_SUBSCRIPT: 84,
  ILLEGAL_STRUCTURE_OPERATION: 85,
  ILLEGAL_LIST_OPERATION: 86,
  ILLEGAL_HASH_OPERATION: 87,
  ILLEGAL_ORDERED_HASH_OPERATION: 88,
  ILLEGAL_DICTIONARY_OPERATION: 89,
  POTENTIAL_TYPE_INCOMPATIBILITIES: 90,
  ILLEGAL_INDEX_TYPE: 91,
  POTENTIAL_IDL_ARRAY_TYPE_INCOMPATIBILITIES: 92,
  POINTER_NOTHING_TO_DE_REF: 93,
  POINTER_DE_REF_ILLEGAL_TYPE: 94,
  INDEXING_ERROR: 95,
  POINTER_DE_REF_AMBIGUITY: 96,
  UNKNOWN_KEYWORD: 97,
  INCOMPLETE_TERNARY: 98,
  UNDEFINED_VAR: 99,
  POTENTIALLY_UNDEFINED_VAR: 100,
  VAR_USAGE_BEFORE_DEF: 101,
  POTENTIAL_VAR_USAGE_BEFORE_DEF: 102,
  AMBIGUOUS_KEYWORD_ABBREVIATION: 103,
  UNUSED_VARIABLE: 104,
  ILLEGAL_VARIABLE_INDEX: 105,
  CIRCULAR_INCLUDE: 106,
  UNKNOWN_DISABLED_ALIAS: 107,
  STANDALONE_EXPRESSION: 108,
  IMPLIED_PRINT_NOTEBOOK: 109,
};
